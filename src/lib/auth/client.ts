import { authQueries } from "@/services/queries";
import { useQuery } from "@tanstack/react-query";
import { organizationClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [organizationClient(), passkeyClient()],
});

export const useAuthentication = () => {
	const { data: userSession } = useQuery(authQueries.user());

	return { userSession, isAuthenticated: !!userSession };
};

export const useAuthenticatedUser = () => {
	const { userSession } = useAuthentication();

	if (!userSession) {
		throw new Error("User is not authenticated!");
	}

	return userSession;
};
