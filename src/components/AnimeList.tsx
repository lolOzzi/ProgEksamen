import { createEffect, For, Show, splitProps } from 'solid-js';
import { JikanClient, JikanResponse, Anime, AnimeClient } from '@tutkli/jikan-ts';
import { clientOnly } from 'solid-start/islands';
import { unstable_clientOnly } from 'solid-start';
import "./AnimeList.css";

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
            <Show when={local.isUserList}
              fallback={<th><b>Score</b></th>}>
              <th><b>Rating</b></th>
            </Show>
          </tr>
          <For each={local.animeList}>
            {(anime, i) => (
              <tr class="animelist-item-container">
                <Show when={local.isRanked || local.isUserList}>
                  <td class="ranking" >
                        {i() + 1}
                    </td>
                </Show>
                <td><img src={anime.image_url} alt={anime.title} /></td>
                <td><p>{anime.title}</p></td>
                <Show when={local.isUserList}
                  fallback={<td>{anime.score}</td>}>
                  <td>{anime.rating}</td>
                </Show>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
}