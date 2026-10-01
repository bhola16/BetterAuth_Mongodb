import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

const uri = process.env.BETTER_AUTH_DB_URL;

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URL is not defined");
}

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const client = new MongoClient(uri);
const db = client.db("better-auth");

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,

    autoSignInAfterVerification: true,

    expiresIn: 3600,

    sendVerificationEmail: async ({ user, url }) => {
      console.log("Sending verification email to:", user.email);
      console.log("Verification URL:", url);

      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h1>Please verify your email address</h1>

          <p>Hello ${user.name},</p>

          <p>
            Please click the link below to verify your email address:
          </p>

          <p>
            <a href="${url}">
              Verify Email
            </a>
          </p>

          <p>
            This verification link will expire in 5 minutes.
          </p>
        `,
      });

      if (error) {
        console.error("Resend email error:", error);
        throw new Error(error.message);
      }

      console.log("Verification email sent successfully:", data);
    },
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