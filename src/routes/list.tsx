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
    let response: JikanResponse<Anime[]>;
    switch (dataType) {
      case "top":
            response = await jikanClient.top.getTopAnime(...args);
        break;
      case "search":
            response = await jikanClient.anime.getAnimeSearch(...args)
        break;
      default:
          throw new Error(`Invalid AnimeResourceType: ${dataType}`);
    }
    const data = response.data;
    const theShows = data.map((anime: any) => {
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
  const [animeList] = createAnimeResource("search", { q: 'gintama'});

  return (
    <main class="full-width">
      <h1>Hello {user()?.username}</h1>
      <h3>Anime List</h3>
      <ListComp animeList={animeList()}/>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>
  );
}
