import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "../lib/db";
import { jobTable } from "../lib/db/schema";

export const getJobs = createServerFn({ method: "GET" }).handler(async () => {
	return Sentry.startSpan({ name: "Fetching all jobs" }, async () => {
		const jobs = await db.select().from(jobTable);
		// Convert JsonValue to serializable format
		return jobs.map((job) => ({
			...job,
			data: job.data ? JSON.parse(JSON.stringify(job.data)) : null,
		}));
	});
});
