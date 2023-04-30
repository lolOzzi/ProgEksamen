import { refetchRouteData, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/models/session";
import { useUser } from "../models/useUserData";
import Slider from "../components/slider";
import { getAnimeList, AnimeShow } from "../components/AnimeList";
import { createResource, createSignal, onMount } from "solid-js";
import { clientOnly } from "solid-start/islands";
import { AnimeSeason } from "@tutkli/jikan-ts";

export function routeData() {
  return useUser();
}

export default function Home() {
  const user = useRouteData<typeof routeData>();
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );
  enum AnimeSeason {
    winter = 0,
    spring = 1,
    summer = 2,
    fall = 3,
  }
  const getSeason = (d: Date) => Math.floor((d.getMonth() / 12 * 4)) % 4;
  const date = new Date();

  const [topAnimeList] = createResource( async () => await getAnimeList("top", "getTopAnime"));
  const [seasonAnimeList] = createResource(async () => await getAnimeList("seasons", "getSeasonNow"));
  const [nextSeasonAnimeList ] = createResource(async () => await getAnimeList("seasons", "getSeason", date.getFullYear(), AnimeSeason[getSeason(date) + 1]));
  //const [nextSeasonAnimeList ] = createResource(async () => await getAnimeList("seasons", "getSeasonUpcoming")); API is broken
 


  return (
    <main class="full-width">
      <h1>Home</h1>
      <h3>Top Anime</h3>
      <Slider animeList={topAnimeList()}/>
      <h3>Current Season Anime</h3>
      <Slider animeList={seasonAnimeList()}/>
      <h3>Next Season Anime</h3>
      <Slider animeList={nextSeasonAnimeList()}/>
      <button onClick={() => refetchRouteData()}>Refresh</button>
      <Form>
        <button name="logout" type="submit">
          Logout
        </button>
      </Form>
      <script>


      </script>
    </main>



  );
}
