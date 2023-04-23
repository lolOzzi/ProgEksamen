import { PrismaClient } from "@prisma/client";
import { Anime } from "@shineiichijo/marika";
import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { db } from ".";
type LoginForm = {
  username: string;
  password: string;
};
type animeForm = {
  mal_id: number;
  rating: number;
}


export async function register({ username, password }: LoginForm) {
  return db.user.create({
    data: { username: username, password },
  });
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) return null;
  const isCorrectPassword = password === user.password;
  if (!isCorrectPassword) return null;
  return user;
}

const sessionSecret = import.meta.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // secure doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    secrets: ["hello"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(db: PrismaClient, request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function getUserList(userId: string) {
  const list = await db.list.findUnique({ where: { userId } });
  if (!list) return null;
  return list;
}

export async function addAnimeToUserList({ mal_id, rating }: animeForm, userId: string) {
  let list = await getUserList(userId);
  if (!list) {
    return list = await db.list.create({
      data: {
        user: { connect: { id: userId } },
      },
    })
  }
  console.log("list" + list);
  const anime = await db.anime.create({
    data: { 
      mal_id: mal_id,
      List: {
        connect: { id: list.id },
      },
      rating: rating,
    },
  });
  console.log("anime" + anime)
  return anime; 
}


export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
