import { PrismaClient } from "@prisma/client";
import { createServerData$, redirect } from "solid-start/server";

import { getUser } from "./session";

export const useUser = () =>
  createServerData$(async (_, { request }) => {
    const db = new PrismaClient();
    const user = await getUser(db, request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });

export const useUserList = () =>
  createServerData$(async (_, { request }) => {
    const db = new PrismaClient();
    const user = await getUser(db, request);

    if (!user) {
      throw redirect("/login");
    }
    const list = await db.list.findUnique({ where: { userId: user.id } });
    
    const anime = await db.anime.findMany({ where: { listId: list?.id } });
    if (!list) return null;
    return {list, anime};
  });