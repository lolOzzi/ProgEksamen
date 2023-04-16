import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useLocation, useSearchParams, useRouteData } from "solid-start";
import { useUser } from "../db/useUser";
import ListComp from "../components/listComp";

import { AnimeShow, getAnimeList } from '../components/listComp';

export default function Home() {

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();


  onMount(async () => {
    if (searchParams.q) {
      console.log("searching for: ", searchParams.q);
      const theShows = await getAnimeList("anime", "getAnimeSearch", { q: searchParams.q });
      setAnimeList(theShows);
    } else {
      const theShows = await getAnimeList("top", "getTopAnime");
      setAnimeList(theShows);
    }

  });

  const handleSearch = async () => {
    console.log("searching for: ", searchParams.q);
    const theShows = await getAnimeList("anime", "getAnimeSearch", { q: searchParams.q });

    setAnimeList(theShows);

  };

  return (
    <main class="full-width">
      <h1>Anime Search</h1>
      <div class="search">
        <input id="search-box" type="text" value={searchParams.q? searchParams.q : ""} onInput={(evt) => {setSearchParams({ q: evt.currentTarget.value });}}/>
        <button id="search-button" onClick={handleSearch}>Search</button>
      </div>
      <ListComp animeList={animeList()} />
      <button onClick={() => refetchRouteData()}>Refresh</button>
      <style>
        {`
          .search > * {
              margin: 0;
              padding: 4px;
              font-size: 1.2em;

          }
      
          #search-button {
              margin-left: 10px;
              margin-right: 80vw;
              width: 100px;
              font-size: 1.25em;
              padding: 6px;
          }
      
          #search-box {
              width: 20vw;
              
          }
          .search {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              margin-top: 20px;
          }
        `}
      </style>
    </main>

  );
}
