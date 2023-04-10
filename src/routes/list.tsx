import { createResource } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser } from "../db/useUser";
import ListComp from "./listComp";
import { JikanClient, JikanResponse, Anime } from '@tutkli/jikan-ts';


export function routeData() {
  return useUser();
}

export const createAnimeResource = (dataType: string, ...args: any[]) =>
  createResource<AnimeShow[]>(async () => {
    const jikanClient = new JikanClient();
    const response = await jikanClient.top.getTopAnime({page: 1});
    const data = await response.data;
    const theShows = await data.map((anime: any) => {
      return {
        title: anime.title,
        score: anime.score,
        image_url: anime.images.webp.image_url,
      } as AnimeShow;
    });
    return theShows;
  });

export type AnimeShow = {
  title: string;
  score: number;
  image_url: string;
};

export default function Home() {
  const user = useRouteData<typeof routeData>();
  const [animeList] = createAnimeResource('loadTop', 1);

  return (
    <main class="full-width">
      <h1>Hello {user()?.username}</h1>
      <h3>Anime List</h3>
      <ListComp animeList={animeList()}/>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>
  );
}
