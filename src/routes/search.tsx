import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useLocation, useSearchParams, useRouteData } from "solid-start";
import { useUser } from "../db/useUserData";
import ListComp from "../components/AnimeList";

import { AnimeShow, getAnimeList } from '../components/AnimeList';

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
      <h1 class="list-title">Anime Search</h1>
      <div class="search">
        <div id="search-container">
          <input id="search-box" type="text" value={searchParams.q ? searchParams.q : ""} onInput={(evt) => { setSearchParams({ q: evt.currentTarget.value }); }} />
          <button id="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div class="list-container">
        <ListComp animeList={animeList()} />
      </div>
      <button onClick={() => refetchRouteData()}>Refresh</button>
      <style>
        {`
          .search > * > * {
              margin: 0;
              padding: 4px;
              font-size: 1.2em;

          }
      
          #search-button {
              width: 100px;
              font-size: 1.25em;
              margin-left: 10px;
              background-color: #003f75;
              color: white;
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
          #search-container {
            padding: 10px;
            background-color: #dbdbdb;
            border-radius: 5px;
          }
        `}
      </style>
    </main>

  );
}
