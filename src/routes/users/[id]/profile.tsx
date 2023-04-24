import { useLocation } from "@solidjs/router"
import { useUser, useUserList } from "~/db/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow, getAnimeList } from "~/components/AnimeList";
import { createEffect, createMemo, createResource, createSignal, For, onMount, Resource, Signal } from "solid-js";
import { JikanClient } from "@tutkli/jikan-ts";
import { Anime, List, User } from ".prisma/client";


export function routeData() {
  return {list: useUserList(), user: useUser()};
}

export const theAnime = async (list: Resource<{
  list: List;
  anime: Anime[];
} | null | undefined>) => {

  const theShows = list()?.anime.map((anime) => {
    return {
      title: anime.title,
      score: anime.score,
      image_url: anime.image_url,
      rating: anime.rating.toString(),
    } as AnimeShow;
  });

  console.log("theShows " + theShows)
  return theShows
}

export default function Home() {
  const userData = useRouteData<typeof routeData>();
  const userList = userData.list;
  const user = userData.user;
  const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>([]);
  const listmoment = createMemo( async () => await theAnime(userList)); // dont remove this line
/*
  createEffect(async () => {
    const data = await theAnime(userList);
    setAniList(data);
  });*/

  return (
    <main class="full-width">
      <h1>{user()?.username + "'s profile"}</h1>
      <AnimeList animeList={listmoment()} />
    </main>
  );
}
