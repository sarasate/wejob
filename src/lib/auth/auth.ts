import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { reactStartCookies } from "better-auth/react-start";
import { v4 as uuid } from "uuid";

import prisma from "../prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	// databaseHooks: {
	// 	session: {
	// 		create: {
	// 			before: async (session) => {
	// 				// const organization = await getActiveOrganization(session.userId);
	// 				return {
	// 					data: {
	// 						...session,
	// 						activeOrganizationId: "952a233b-6549-4567-b5ba-b343828951fd",
	// 					},
	// 				};
	// 			},
	// 		},
	// 	},
	// },
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: () => uuid(),
		},
	},
	plugins: [
		admin(),
		passkey(),
		// organization({
		// 	teams: {
		// 		enabled: true,
		// 		allowRemovingAllTeams: false,
		// 	},
		// }),
		// NOTE Needs to be last in the plugins array
		reactStartCookies(),
	],
});
