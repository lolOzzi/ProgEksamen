import { refetchRouteData, useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/db/session";
import { useUser } from "../db/useUser";
import Slider from "../components/slider";
import { getAnimeList, AnimeShow } from "../components/listComp";
import { createSignal, onMount } from "solid-js";

export function routeData() {
  return useUser();
}

export default function Home() {
  const user = useRouteData<typeof routeData>();
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  const [topAnimeList, setTopAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [seasonAnimeList, setSeasonAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);
  const [nextSeasonAnimeList, setNextSeasonAnimeList] = createSignal<AnimeShow[] | undefined>(undefined);

  onMount(async () => {
    const theTopShows = await getAnimeList("top", "getTopAnime");
    setTopAnimeList(theTopShows);
    const theSeasonShows = await getAnimeList("seasons", "getSeasonNow");
    setSeasonAnimeList(theSeasonShows);
    const theNextSeasonShows = await getAnimeList("seasons", "getSeasonUpcoming");
    setNextSeasonAnimeList(theNextSeasonShows);

  });

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
