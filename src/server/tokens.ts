// import { db } from "@/server/db";
// import crypto from "crypto";

// //helpers
// function generateToken(): string {
//   return crypto.randomUUID();
// }

// function oneHourFromNow(): Date {
//   return new Date(Date.now() + 3600 * 1000);
// }

// function twentyFourHoursFromNow(): Date {
//   return new Date(Date.now() + 24 * 3600 * 1000);
// }

// //password reset tokens
// export async function createPasswordResetToken(userId: string, email: string) {
//   await db.passwordResetToken.deleteMany({ where: { userId } });

//   const token = generateToken();
//   const expires = oneHourFromNow();

//   await db.passwordResetToken.create({
//     data: { userId, email, token, expires },
//   });

//   return token;
// }

// export async function getPasswordResetToken(token: string) {
//   return db.passwordResetToken.findUnique({ where: { token } });
// }

// export async function deletePasswordResetToken(token: string) {
//   await db.passwordResetToken.delete({ where: { token } });
// }

// //email verification tokens

// export async function createEmailVerificationToken(
//   userId: string,
//   email: string,
// ) {
//   // purana token delete karo pehle
//   await db.emailVerificationToken.deleteMany({ where: { userId } });

//   const token = generateToken();
//   const expires = twentyFourHoursFromNow();

//   await db.emailVerificationToken.create({
//     data: { userId, email, token, expires },
//   });

//   return token;
// }

// export async function getEmailVerificationToken(token: string) {
//   return db.emailVerificationToken.findUnique({ where: { token } });
// }

// export async function deleteEmailVerificationToken(token: string) {
//   await db.emailVerificationToken.delete({ where: { token } });
// }

// //token validation helper

// export function isTokenExpired(expires: Date): boolean {
//   return new Date(expires) < new Date();
// }

import { db } from "@/server/db";
import crypto from "crypto";

//helpers
function generateToken(): string {
  return crypto.randomUUID();
}

function oneHourFromNow(): Date {
  return new Date(Date.now() + 3600 * 1000);
}

function twentyFourHoursFromNow(): Date {
  return new Date(Date.now() + 24 * 3600 * 1000);
}

//password reset tokens
export async function createPasswordResetToken(userId: string, email: string) {
  await db.passwordResetToken.deleteMany({ where: { userId } });

  const token = generateToken();
  const expires = oneHourFromNow();

  await db.passwordResetToken.create({
    data: { userId, email, token, expires },
  });

  return token;
}

export async function getPasswordResetToken(token: string) {
  return db.passwordResetToken.findUnique({ where: { token } });
}

export async function deletePasswordResetToken(token: string) {
  await db.passwordResetToken.deleteMany({ where: { token } });
}

//email verification tokens
export async function createEmailVerificationToken(
  userId: string,
  email: string,
) {
  // purana token delete karo pehle
  await db.emailVerificationToken.deleteMany({ where: { userId } });

  const token = generateToken();
  const expires = twentyFourHoursFromNow();

  await db.emailVerificationToken.create({
    data: { userId, email, token, expires },
  });

  return token;
}

export async function getEmailVerificationToken(token: string) {
  return db.emailVerificationToken.findUnique({ where: { token } });
}

export async function deleteEmailVerificationToken(token: string) {
  await db.emailVerificationToken.deleteMany({ where: { token } });
}

//token validation helper

export function isTokenExpired(expires: Date): boolean {
  return new Date(expires) < new Date();
}
