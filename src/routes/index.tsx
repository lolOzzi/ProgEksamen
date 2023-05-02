import { refetchRouteData, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/models/session";
import { useUser } from "../models/useUserData";
import Slider from "../views/slider";
import { getAnimeList, AnimeShow } from "../views/AnimeList";
import { createResource, createSignal, onMount, Resource } from "solid-js";
import { clientOnly } from "solid-start/islands";
import { AnimeSeason } from "@tutkli/jikan-ts";
import { sleep } from "../utils/helper";
import './index.css';
import { isServer } from "solid-js/web";

export function routeData() {
  return useUser();
}



export default function Home() {
  enum AnimeSeason {
    winter = 0,
    spring = 1,
    summer = 2,
    fall = 3,
  }
  const getSeason = (d: Date) => Math.floor((d.getMonth() / 12 * 4)) % 4;
  const date = new Date();

  const [topAnimeList] = createResource( async () => {return await getAnimeList("top", "getTopAnime"); });
  const [seasonAnimeList] = createResource(async () => {return await getAnimeList("seasons", "getSeasonNow"); });
  const [nextSeasonAnimeList ] = createResource(async () => {return await getAnimeList("seasons", "getSeason", date.getFullYear(), AnimeSeason[getSeason(date) + 1]); });
  


  return (
    <main class="full-width title-main">
      <div class="title-container">
        <h1 class="list-title">Home</h1>
      </div>
      <div class="home-container">
      <h3>Top Anime</h3>
      <Slider animeList={topAnimeList()}/>
      <h3>Current Season Anime</h3>
      <Slider animeList={seasonAnimeList()}/>
      <h3>Next Season Anime</h3>
      <Slider animeList={nextSeasonAnimeList()}/>
      </div>
    </main>



  );
}
