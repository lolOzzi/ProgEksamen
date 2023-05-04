import { createMemo, createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useLocation, useSearchParams, useRouteData } from "solid-start";
import { useUser, useUserList } from "../models/getUserData";
import AnimeList from "../views/AnimeList";
import { AnimeShow, getAnimeList } from '../models/getAnimeData';
import { userAnimeList } from "./users/[id]/profile";


export function routeData() {
  return useUserList();
}


export default function Home() {

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [userAniList, setUserAniList] = createSignal<AnimeShow[] | undefined>([]);
  const userList = useRouteData<typeof routeData>()


  onMount(async () => {
    if (searchParams.q) {
      const termAnimeSearch = await getAnimeList("anime", "getAnimeSearch", { q: searchParams.q, order_by: "members"});
      const letterAnimeSearch = await getAnimeList("anime", "getAnimeSearch", { letter: searchParams.q});
      let theShows =termAnimeSearch.concat(letterAnimeSearch).filter((show, index, self) => index === self.findIndex((s) => (s.mal_id === show.mal_id)));
      theShows.sort((a, b) => (a.members! < b.members!) ? 1 : -1);
      setAnimeList(theShows);
    } else {
      const theShows = await getAnimeList("top", "getTopAnime");
      setAnimeList(theShows);
    }

  });

  createMemo( async () => {
    const data = await userAnimeList(userList);
    setUserAniList(data);
  });


  const handleSearch = async () => {
    console.log("searching for: ", searchParams.q);
    const termAnimeSearch = await getAnimeList("anime", "getAnimeSearch", { q: searchParams.q, order_by: "members"});
    const letterAnimeSearch = await getAnimeList("anime", "getAnimeSearch", { letter: searchParams.q});
    const theShows = termAnimeSearch.concat(letterAnimeSearch).filter((show, index, self) => index === self.findIndex((s) => (s.mal_id === show.mal_id)));
    theShows.sort((a, b) => (a.members! < b.members!) ? 1 : -1);
    setAnimeList(theShows);

  };

  return (
    <main class="full-width title-main">
      <div class="title-container">
        <h1 class="list-title">Search Anime</h1>
      </div>
      <div class="search">
        <div id="search-container">
          <input id="search-box" type="text" value={searchParams.q ? searchParams.q : ""} onInput={(evt) => { setSearchParams({ q: evt.currentTarget.value }); }} />
          <button id="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div class="list-container">
        <AnimeList animeList={animeList()} userList={userAniList()} />
      </div>
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
