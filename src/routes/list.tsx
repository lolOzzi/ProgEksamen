import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser } from "../db/useUser";
import ListComp from "./listComp";
import { JikanClient, JikanResponse, Anime, AnimeClient } from '@tutkli/jikan-ts';

export function routeData() {
  return useUser();
}

type JikanObject = keyof JikanClient;

export const getAnimeList = async <T extends JikanObject>(
  objectName: T, methodName: keyof JikanClient[T], ...args: any[]
) => {
  const jikanClient = new JikanClient();
  let response: JikanResponse<Anime[]>;

  response = await (jikanClient[objectName][methodName] as (...args: any[]) => Promise<JikanResponse<Anime[]>>)(...args);
  
  const data = response.data;
  const theShows = data.map((anime: any) => {
    console.log(anime.title);
    return {
      title: anime.title,
      score: anime.score,
      image_url: anime.images.webp.image_url,
    } as AnimeShow;
  });
  console.log(theShows)
  return theShows;
}

export type AnimeShow = {
  title: string;
  score: number;
  image_url: string;
};

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
