import { createMemo, createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser, useUserList } from "../models/useUserData";
import ListComp from "../views/AnimeList";
import './basiclists.css';

import { AnimeShow, getAnimeList } from '../views/AnimeList';
import { userAnimeList } from "./users/[id]/profile";


export function routeData() {
  return useUserList();
}


export default function Home() {

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);

  const [userAniList, setUserAniList] = createSignal<AnimeShow[] | undefined>([]);
  const userList = useRouteData<typeof routeData>()
  

  onMount(async () => {
    const theShows = await getAnimeList("top", "getTopAnime", { filter: "bypopularity" });
    setAnimeList(theShows);
  });

  createMemo( async () => {
    const data = await userAnimeList(userList);
    setUserAniList(data);
  });

  return (
    <main class="full-width">
      <h1 class="list-title">Most Popular Anime</h1>
      <div class="list-container">
          <ListComp animeList={animeList()} userList={userAniList()} />
      </div>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>

  );
}
