import { For } from 'solid-js';
import { JikanClient, JikanResponse, Anime, AnimeClient } from '@tutkli/jikan-ts';



//  https://docs.api.jikan.moe/ for at finde overkatagorier, underkatagorier og parametre
//  syntax: getAnimeList("Overkatagorie", "Underkatagorie", {parametre})  
//  ex. getAnimeList("top", "getTopAnime", { page: 1 }) 
//  ex. getAnimeList("top", "getTopAnime")  //  default page = 1, så dette er det samme som ovenstående
//  ex. getAnimeList("anime", "getAnimeSearch", { q: "naruto" })
export const getAnimeList = async <T extends keyof JikanClient>(objectName: T, methodName: keyof JikanClient[T], ...args: any[]) => {
  
  const jikanClient = new JikanClient();
  let response: JikanResponse<Anime[]>;

  response = await (jikanClient[objectName][methodName] as (...args: any[]) => Promise<JikanResponse<Anime[]>>)(...args);

  const data = response.data;
  const theShows = data.map((anime: any) => {
    //console.log(anime.title);
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

export default function AnimeList(props: {animeList?: AnimeShow[]}) {
  return (
    <>
      <For each={props.animeList}>
        {(anime) => (
          <div>
            <img src={anime.image_url} alt={anime.title} />
            <p>{anime.title}</p>
            <p>{anime.score}</p>
          </div>
          )}
      </For>
      <style>
      {`
        p {
          margin: 10px;
          color: black;
        }
      `}
    </style>
    </>
  );
}