import { createEffect, For, Show, splitProps } from 'solid-js';
import { JikanClient, JikanResponse, Anime, AnimeClient } from '@tutkli/jikan-ts';
import { clientOnly } from 'solid-start/islands';
import { unstable_clientOnly } from 'solid-start';
import "./AnimeList.css";

//  https://docs.api.jikan.moe/ for at finde overkatagorier, underkatagorier og parametre
//  syntax: getAnimeList("Overkatagorie", "Underkatagorie", {parametre})  
//  ex. getAnimeList("top", "getTopAnime", { page: 1 }) 
//  ex. getAnimeList("top", "getTopAnime")  //  default page = 1, så dette er det samme som ovenstående
//  ex. getAnimeList("anime", "getAnimeSearch", { q: "naruto", page: 1 })
/*export const theThing = clientOnly<any>(async () => { 
  return {default: await getAnimeList("top", "getTopAnime", { page: 1 })}
})*/
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
  return theShows;
}

export type AnimeShow = {
  title: string;
  score: number;
  image_url: string;
  rating?: string;
};

export default function AnimeList(props: any) {
  const [local, others] = splitProps(props, ['animeList', 'isUserList', 'isRanked']);
  if (local.isUserList) {
    return (
      <>
        <h2>My Anime List</h2>
        <table class="anime-table">
          <tbody>
            <tr>
              <th>
                <b>#</b>
              </th>
              <th>
                <b>Image</b>
              </th>
              <th>
                <b>Title</b>
              </th>
              <th>
                <b>Your Rating</b>
              </th>
            </tr>
            <For each={local.animeList}>
              {(anime, i) => (
                <tr class="animelist-item-container">
                  <Show when={local.isRanked || local.isUserList}>
                    {i() + 1}
                  </Show>
                  <td><img src={anime.image_url} alt={anime.title} /></td>
                  <td><p>{anime.title}</p></td>
                  <td>{anime.rating}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </>
    );
  }
  return (
    <>
      <table class="anime-table">
        <tbody>
          <tr>
            <Show when={local.isRanked || local.isUserList}>
              <th>
                <b>#</b>
              </th>
            </Show>
            <th>
              <b>Image</b>
            </th>
            <th>
              <b>Title</b>
            </th>
            <th>
              <b>Score</b>
            </th>
          </tr>
          <For each={local.animeList}>
            {(anime, i) => (
              <tr class="animelist-item-container">
                <Show when={local.isRanked || local.isUserList}>
                  <p>{i() + 1}</p>
                </Show>
                <td><img src={anime.image_url} alt={anime.title} /></td>
                <td><p>{anime.title}</p></td>
                <td>{anime.score}</td>
              </tr>

            )}
          </For>
        </tbody>
      </table>
    </>
  );
}