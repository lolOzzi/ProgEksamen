import { PrismaClient } from "@prisma/client";
import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { db } from ".";

type LoginForm = {
  username: string;
  password: string;
};
type AnimeForm = {
  mal_id: number;
  title: string;
  image_url: string;
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

//@ts-ignore
const sessionSecret = import.meta.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
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

export async function addAnimeToUserList({mal_id, title, image_url, rating}: AnimeForm, request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  let list = await getUserList(userId);
  if (!list) {
     list = await db.list.create({
      data: {
        user: { connect: { id: userId } },
      },
    })
  }
  const anime = await db.anime.create({
    data: {
      mal_id: mal_id,
      title: title,
      image_url: image_url,
      List: {
        connect: { id: list.id },
      },
      rating: rating,
    },
  });
  return anime; 
}

export async function removeAnimeFromUserList(mal_id: number, request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  let list = await getUserList(userId);
  if (!list) {
    return null;
  }
  const anime = await db.anime.delete({
    where: {
      mal_id_listId: {
        mal_id: mal_id,
        listId: list.id,
      }
    },
  });
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
