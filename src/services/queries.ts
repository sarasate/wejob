import { getUserSession } from "@/services/auth.api";
import { queryOptions } from "@tanstack/react-query";

export const authQueries = {
	all: ["auth"],
	user: () =>
		queryOptions({
			queryKey: [...authQueries.all, "user"],
			queryFn: () => getUserSession(),
			staleTime: 5000,
		}),
};
