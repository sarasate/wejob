import { queryOptions } from "@tanstack/react-query";
import { getUserSession } from "@/services/auth.api";
import { getJobs } from "@/services/job.api";

export const authQueries = {
	all: ["auth"],
	user: () =>
		queryOptions({
			queryKey: [...authQueries.all, "user"],
			queryFn: () => getUserSession(),
			staleTime: 5000,
		}),
};

export const jobsQueries = {
	all: ["jobs"],
	allJobs: () =>
		queryOptions({
			queryKey: [...jobsQueries.all, "allJobs"],
			queryFn: () => getJobs(),
		}),
};
