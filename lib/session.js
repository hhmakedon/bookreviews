import { cookies } from "next/headers";
import { getAuthorizedEmail, hasFirebaseAdminConfig } from "@/lib/config";
import { getFirebaseAdminAuth } from "@/lib/firebase-admin";

export const SESSION_COOKIE_NAME = "mr_makedon_session";

export async function getAuthorizedUserFromSessionCookie(sessionCookie) {
  if (!hasFirebaseAdminConfig()) {
    return null;
  }

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);

    if (decodedToken.email !== getAuthorizedEmail()) {
      return null;
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return getAuthorizedUserFromSessionCookie(sessionCookie);
}

export async function requireAuthorizedRequestUser(request) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return {
      error: "Please log in first.",
      status: 401,
    };
  }

  const user = await getAuthorizedUserFromSessionCookie(sessionCookie);

  if (!user) {
    return {
      error: "Your session has expired. Please log in again.",
      status: 401,
    };
  }

  return { user };
}
