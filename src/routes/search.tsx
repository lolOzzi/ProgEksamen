import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser } from "../db/useUser";
import ListComp from "../components/listComp";

import { AnimeShow, getAnimeList } from '../components/listComp';
export function routeData() {
  return useUser();
}



export default function Home() {
  const user = useRouteData<typeof routeData>();

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [query, setQuery] = createSignal("");

  onMount(async () => {
    const theShows = await getAnimeList("top", "getTopAnime");
    setAnimeList(theShows);
  });

  const handleSearch = async () => {
    console.log("searching for: ", query());
    const theShows = await getAnimeList("anime", "getAnimeSearch", { q: query() });

    setAnimeList(theShows);

  };

  return (
    <main class="full-width">
      <h1>Hello {user()?.username}</h1>
      <div class="search">
        <input type="text" value={query()} onInput={(evt) => setQuery(evt.currentTarget.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h3>Anime List</h3>
      <ListComp animeList={animeList()} />
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>
  );
}
