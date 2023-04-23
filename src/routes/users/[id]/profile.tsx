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

  const animeIds = list()?.anime.map((anime: any) => anime.mal_id);
  console.log(animeIds)

  const animePromises = animeIds?.map(async (id: any) => {
    console.log("animePromises " + id)
    const jikan = new JikanClient();
    return (await jikan.anime.getAnimeById(id)).data;
  });

  const animeListValue = await Promise.all(animePromises || []);
  console.log("animeListValue " + animeListValue)
  const theShows = animeListValue.map((anime) => {
    return {
      title: anime.title,
      score: anime.score,
      image_url: anime.images.jpg.image_url,
    } as AnimeShow;
  });
  console.log("theShows " + theShows)
  return theShows
}

export default function Home() {
  const userData = useRouteData<typeof routeData>();
  const userList = userData.list;
  const user = userData.user;
  const [aniList, setAniList] = createSignal<AnimeShow[]>([]);
  createMemo( () => theAnime(userList)); // dont remove this line

  createEffect(async () => {
    const data = await theAnime(userList);
    setAniList(data);
  });

  return (
    <main class="full-width">
      <h1>{user()?.username + "'s profile"}</h1>
      <AnimeList animeList={aniList()} />
    </main>
  );
}
