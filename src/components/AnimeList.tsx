import { createEffect, For, Show, splitProps } from 'solid-js';
import { JikanClient, JikanResponse, Anime, AnimeClient } from '@tutkli/jikan-ts';
import { clientOnly } from 'solid-start/islands';
import { unstable_clientOnly } from 'solid-start';
import "./AnimeList.css";
import { addAnimeToUserList } from '~/models/session';
import { createServerAction$ } from 'solid-start/server';
import { Form } from 'solid-start/data/Form';

export const getAnimeList = async <T extends keyof JikanClient>(objectName: T, methodName: keyof JikanClient[T], ...args: any[]) => {

  const jikanClient = new JikanClient();
  let response: JikanResponse<Anime[]>;
  response = await (jikanClient[objectName][methodName] as (...args: any[]) => Promise<JikanResponse<Anime[]>>)(...args);

  const data = response.data;
  const theShows = data.map((anime: any) => {
    //console.log(anime.title);
    return {
      mal_id: anime.mal_id,
      title: anime.title,
      score: anime.score,
      image_url: anime.images.webp.image_url,
    } as AnimeShow;
  });
  return theShows;
}

export type AnimeShow = {
  mal_id: number;
  title: string;
  score: number;
  image_url: string;
  rating?: string;
};

export default function AnimeList(props: any) {
  const [local, others] = splitProps(props, ['animeList', 'userList', 'isUserList', 'isRanked']);
  const [adding, { Form },] = createServerAction$(async (form: FormData, { request },) => {
    const ratingVal = form.get('rating');
    let animeString = form.get('anime');
    if (!ratingVal || !animeString) return;
    const rating = +ratingVal;
    const anime = JSON.parse(animeString as string) as AnimeShow;
    await addAnimeToUserList({
      mal_id: anime.mal_id,
      title: anime.title, score: anime.score,
      image_url: anime.image_url,
      rating: rating
    }, request);
  });

  const checkAdded = (id: number) => {
    const res = local.userList?.anime.forEach((anime: AnimeShow) => {
      if (anime.mal_id === id) {
        return [true, anime.rating];
      }
    });
    console.log("the id" + id + "res" + res)
    if (!res)
      return [false, undefined];
    return res;
  };

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
              fallback={
                <>
                  <th><b>Score</b></th>
                  <th><b>Add Anime</b></th>
                </>
              }>
              <th><b>Rating</b></th>
            </Show>
          </tr>
          <For each={local.animeList}>
            {(anime: AnimeShow, i) => (
              <tr class="animelist-item-container">
                <Show when={local.isRanked || local.isUserList}>
                  <td class="ranking" >
                    {i() + 1}
                  </td>
                </Show>
                <td><img src={anime.image_url} alt={anime.title} /></td>
                <td><p>{anime.title}</p></td>
                <Show when={local.isUserList}
                  fallback={
                    <>
                      <td>{anime.score}</td>
                      <td>

                        <Show when={!checkAdded(anime.mal_id)[0]}
                          fallback={
                            <>
                            <p>Added</p>
                             <p>Your rating: {checkAdded(anime.mal_id)[1]}</p>
                            </>
                          }>
                          <Form>
                            <label for="rating">Rating (1-10):</label>
                            <input type="number" name="rating" value="10" min="1" max="10" />
                            <input type="hidden" name="anime" value={JSON.stringify(anime)} />
                            <button type="submit" disabled={adding.pending}>Add</button>
                          </Form>
                        </Show>


                      </td>
                    </>
                  }>
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