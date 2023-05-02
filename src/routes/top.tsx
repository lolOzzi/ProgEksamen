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
    <main class="full-width">
      <h1 class="list-title">Top Anime</h1>
      <div class="list-container">
        <Show when={userAniList() !== undefined} fallback={
          <div class="loading">
            <p>loading...</p>
          </div>
        }>
        <ListComp animeList={animeList()} userList={userAniList()} isRanked="true" />
          </Show>

      </div>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>

  );
}
