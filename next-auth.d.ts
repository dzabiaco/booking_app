import { DefaultSession, DefaultUser } from "next-auth";

// Extend the default Session
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;
    }
}

// Extend JWT to include id
declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
    }
}