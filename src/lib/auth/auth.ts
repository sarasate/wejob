import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { reactStartCookies } from "better-auth/react-start";
import { v4 as uuid } from "uuid";
import { db } from "../db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: () => uuid(),
		},
	},
	plugins: [admin(), passkey(), reactStartCookies()],
});
