import { createMemo, createResource, createSignal, onMount, ResourceActions, ResourceReturn, Show } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser, useUserList } from "../models/useUserData";
import ListComp from "../views/AnimeList";
import { AnimeShow, getAnimeList } from '../views/AnimeList';
import { userAnimeList } from "./users/[id]/profile";
import { isServer } from "solid-js/web";

export function routeData() {
  return useUserList();
}

export default function Home() {
  const userList = useRouteData<typeof routeData>()

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);

  onMount(async () => {
    const theShows = await getAnimeList("top", "getTopAnime");
    setAnimeList(theShows);
  });

  const [userAniList, setUserAniList] = createSignal<AnimeShow[] | undefined>([]);
  createMemo( async () => {
    const data = await userAnimeList(userList);
    setUserAniList(data);

  });


  return (
    <main class="full-width title-main">
      <div class="title-container">
        <h1 class="list-title">Top Anime</h1>
      </div>
      <div class="list-container">
        <ListComp animeList={animeList()} userList={userAniList()} isRanked="true" />
      </div>
    </main>

  );
}
