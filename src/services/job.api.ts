import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import prisma from "../lib/prisma";

export const getJobs = createServerFn({ method: "GET" }).handler(async () => {
	return Sentry.startSpan({ name: "Fetching all jobs" }, async () => {
		const jobs = await prisma.job.findMany();
		// Convert JsonValue to serializable format
		return jobs.map((job) => ({
			...job,
			data: job.data ? JSON.parse(JSON.stringify(job.data)) : null,
		}));
	});
});
