import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser } from "../models/useUserData";
import ListComp from "../components/AnimeList";
import './basiclists.css';

import { AnimeShow, getAnimeList } from '../components/AnimeList';

export default function Home() {

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [query, setQuery] = createSignal("");

  


  onMount(async () => {
    const theShows = await getAnimeList("top", "getTopAnime", { filter: "bypopularity" });
    setAnimeList(theShows);
  });


  return (
    <main class="full-width">
      <h1 class="list-title">Most Popular Anime</h1>
      <div class="list-container">
          <ListComp animeList={animeList()} />
      </div>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>

  );
}
