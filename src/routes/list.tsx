import { createResource, createSignal, onMount, ResourceActions, ResourceReturn } from "solid-js";
import { refetchRouteData, useRouteData } from "solid-start";
import { useUser } from "../db/useUser";
import ListComp from "./listComp";
import { JikanClient, JikanResponse, Anime } from '@tutkli/jikan-ts';
import { parseArgs } from "util";


export function routeData() {
  return useUser();
}

export const useAnimeResource  = (dataType: string, ...args: any[]) => 
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
      console.log(anime.title);
      return {
        title: anime.title,
        score: anime.score,
        image_url: anime.images.webp.image_url,
      } as AnimeShow;
    });
    console.log(theShows)
    return theShows;
    });

export type AnimeShow = {
  title: string;
  score: number;
  image_url: string;
};

export default function Home() {
  const user = useRouteData<typeof routeData>();

  const [animeList, setAnimeList] = createSignal<AnimeShow[] | undefined>(
    undefined
  );
  const [query, setQuery] = createSignal("");
 
  onMount(async () => {
    const [theShows] = await useAnimeResource("top", 1);
    setAnimeList(theShows);
  });
  
  const handleSearch = async () => {
    console.log("searching for: ", query());
    const [theShows, {refetch}] = await useAnimeResource("search", { q: query() });
    if (theShows === undefined) {
      console.log("theShows is undefined");
    }
    else {
      console.log("theList: " + theShows);
    }
    const crad = await theShows.read();
    setAnimeList(theShows);

    console.log("animeList: " + animeList());
  };

  return (
    <main class="full-width">
      <h1>Hello {user()?.username}</h1>
      <div class="search">
        <input type="text" value={query()} onInput={(evt) => setQuery(evt.currentTarget.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <h3>Anime List</h3>
      <ListComp animeList={animeList()}/>
      <button onClick={() => refetchRouteData()}>Refresh</button>
    </main>
  );
}
