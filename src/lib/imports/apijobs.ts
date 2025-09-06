import * as Sentry from "@sentry/tanstackstart-react";
import { env } from "../../env";
import { sql } from "../db";

// TypeScript interfaces for APIJobs API response
interface APIJobsSearchRequest {
	q: string;
	size: number;
}

interface APIJobsJob {
	id: string;
	title: string;
	description: string;
	employment_type: string;
	workplace_type: string;
	hiring_organization_name: string;
	hiring_organization_url: string;
	hiring_organization_logo: string;
	country: string;
	region: string;
	city: string;
	base_salary_currency: string;
	base_salary_min_value: number;
	base_salary_max_value: number;
	base_salary_unit: string;
	experience_requirements_months: number;
	education_requirements: string;
	skills_requirements: string[];
	responsibilities: string[];
	industry: string;
	website: string;
	[key: string]: unknown; // For additional fields
}

interface APIJobsSearchResponse {
	ok: boolean;
	hits: APIJobsJob[];
	facets: Record<string, Array<{ key: string; doc_count: number }>>;
	total: number;
}

class APIJobsImporter {
	private apiKey: string;
	private baseUrl = "https://api.apijobs.dev/v1";

	constructor() {
		this.apiKey = env.APIJOBS_API_KEY;
	}

	async searchJobs(
		query: string,
		size: number = 50,
	): Promise<APIJobsSearchResponse> {
		const response = await fetch(`${this.baseUrl}/job/search`, {
			method: "POST",
			headers: {
				apikey: this.apiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				q: query,
				size,
			} as APIJobsSearchRequest),
		});

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`,
			);
		}

		return await response.json();
	}

	async importJobs(
		query: string,
		size: number = 50,
	): Promise<{ imported: number; errors: number }> {
		return await Sentry.startSpan(
			{ name: "Import jobs from APIJobs" },
			async () => {
				let imported = 0;
				let errors = 0;

				try {
					console.log(`🔍 Searching for jobs with query: "${query}"`);
					const searchResponse = await this.searchJobs(query, size);

					console.log(
						`📊 Found ${searchResponse.total} total jobs, processing ${searchResponse.hits.length} jobs...`,
					);

					for (const job of searchResponse.hits) {
						try {
							await this.importJob(job);
							imported++;
							console.log(
								`✅ Imported job: ${job.title} at ${job.hiring_organization_name}`,
							);
						} catch (error) {
							errors++;
							console.error(`❌ Failed to import job "${job.title}":`, error);
							Sentry.captureException(error, {
								tags: { operation: "import_job" },
								extra: { jobId: job.id, jobTitle: job.title },
							});
						}
					}

					console.log(
						`🎉 Import completed: ${imported} jobs imported, ${errors} errors`,
					);
					return { imported, errors };
				} catch (error) {
					console.error("💥 Import failed:", error);
					Sentry.captureException(error, {
						tags: { operation: "import_jobs" },
						extra: { query, size },
					});
					throw error;
				}
			},
		);
	}

	private async importJob(job: APIJobsJob): Promise<void> {
		// Check if job already exists by ID
		const existingJob = await sql`
			SELECT id FROM job WHERE id = ${job.id} LIMIT 1
		`;

		if (existingJob.length > 0) {
			console.log(`⏭️  Skipping duplicate job: ${job.title} (ID: ${job.id})`);
			return;
		}

		// Create location string from available fields
		const locationParts = [job.city, job.region, job.country].filter(Boolean);
		const location =
			locationParts.length > 0 ? locationParts.join(", ") : "Unknown";

		// Prepare job data for database
		const jobData = {
			id: job.id, // Use the job ID from the API
			title: job.title,
			description: job.description,
			location: location,
			provider: "apijobs",
			data: {
				employment_type: job.employment_type,
				workplace_type: job.workplace_type,
				hiring_organization_name: job.hiring_organization_name,
				hiring_organization_url: job.hiring_organization_url,
				hiring_organization_logo: job.hiring_organization_logo,
				country: job.country,
				region: job.region,
				city: job.city,
				salary: {
					currency: job.base_salary_currency,
					min: job.base_salary_min_value,
					max: job.base_salary_max_value,
					unit: job.base_salary_unit,
				},
				experience_requirements_months: job.experience_requirements_months,
				education_requirements: job.education_requirements,
				skills_requirements: job.skills_requirements,
				responsibilities: job.responsibilities,
				industry: job.industry,
				website: job.website,
				// Store all additional fields that aren't already mapped
				...Object.fromEntries(
					Object.entries(job).filter(
						([key]) =>
							![
								"id",
								"title",
								"description",
								"employment_type",
								"workplace_type",
								"hiring_organization_name",
								"hiring_organization_url",
								"hiring_organization_logo",
								"country",
								"region",
								"city",
								"base_salary_currency",
								"base_salary_min_value",
								"base_salary_max_value",
								"base_salary_unit",
								"experience_requirements_months",
								"education_requirements",
								"skills_requirements",
								"responsibilities",
								"industry",
								"website",
							].includes(key),
					),
				),
			},
		};

		await sql`
			INSERT INTO job (id, title, description, location, provider, data, created_at, updated_at)
			VALUES (${jobData.id}, ${jobData.title}, ${jobData.description}, ${jobData.location}, ${jobData.provider}, ${JSON.stringify(jobData.data)}, NOW(), NOW())
		`;
	}

	async close(): Promise<void> {
		// Drizzle doesn't require explicit connection closing
		// The connection is managed automatically
	}
}

// Main execution function
async function main() {
	const importer = new APIJobsImporter();

	try {
		// You can modify these parameters as needed
		const query = process.argv[2] || "software engineer";
		const size = parseInt(process.argv[3]) || 50;

		console.log(`🚀 Starting job import...`);
		console.log(`📝 Query: "${query}"`);
		console.log(`📊 Size: ${size}`);

		const result = await importer.importJobs(query, size);

		console.log(`\n📈 Final Results:`);
		console.log(`   ✅ Jobs imported: ${result.imported}`);
		console.log(`   ❌ Errors: ${result.errors}`);

		process.exit(result.errors > 0 ? 1 : 0);
	} catch (error) {
		console.error("💥 Script failed:", error);
		process.exit(1);
	} finally {
		await importer.close();
	}
}

// Export for use in other modules
export { APIJobsImporter, type APIJobsJob, type APIJobsSearchResponse };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
