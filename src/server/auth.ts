import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { loginSchema } from "@/validations/auth";
import { TOKEN_EXPIRY } from "@/config/app";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
    maxAge: TOKEN_EXPIRY.session,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            hashedPassword: true,
            role: true,
            image: true,
            emailVerified: true,
            isActive: true,
          },
        });

        if (!user || !user.hashedPassword) return null;
        if (!user.isActive) return null;
        if (!user.emailVerified) return null;

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.isActive = user.isActive;
      }

      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { isActive: true },
        });
        token.isActive = dbUser?.isActive ?? false;
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
});
