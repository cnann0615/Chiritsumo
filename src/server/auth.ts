import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    // サインインしたときに、Tsumo Balanceテーブルに新しいレコードを作成する
    signIn: async ({ user }) => {
      try {
        // 既存レコードを確認
        const existingRecord = await db.tsumoBalance.findUnique({
          where: { userId: user.id },
        });

        // 既存レコードがなければ新規レコードを作成
        if (!existingRecord) {
          await db.tsumoBalance.create({
            data: {
              userId: user.id,
              tsumoBalance: 0,
            },
          });
        }
        return true;
      } catch (error) {
        console.error("Error checking or creating record on signIn:", error);
        return true;
      }
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
