import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.BETTER_AUTH_DB_URL;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

const client = new MongoClient(uri);
const db = client.db("better-auth");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },
});