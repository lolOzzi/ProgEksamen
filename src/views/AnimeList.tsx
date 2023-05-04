import { For, Show, splitProps } from 'solid-js';
import { addAnimeToUserList, removeAnimeFromUserList } from '~/models/session';
import { createServerAction$ } from 'solid-start/server';
import "./AnimeList.css";
import { AnimeShow } from '~/models/getAnimeData';


export default function AnimeList(props: any) {
  const [local, others] = splitProps(props, ['animeList', 'userList', 'isUserList', 'isRanked', 'reccomendations']);
  const [adding, { Form },] = createServerAction$(async (form: FormData, { request },) => {
    const ratingVal = form.get('rating');
    let animeString = form.get('animeToAdd');
    let animeID = form.get('animeToRemove')
    if ((!ratingVal || !animeString) && animeID) {
      removeAnimeFromUserList(+animeID, request);
      return;
    } else if (!ratingVal || !animeString) {
      return;
    }
    const rating = +ratingVal;
    const anime = JSON.parse(animeString as string) as AnimeShow;
    await addAnimeToUserList({
      mal_id: anime.mal_id,
      title: anime.title,
      image_url: anime.image_url,
      rating: rating,
    }, request);
  });


  const checkAdded = (id: number) => {
    let res = undefined;
    local.userList?.forEach((anime: AnimeShow) => {
      if (anime.mal_id === id) {
        res = anime.rating
      }
    });
    if (!res)
      return undefined;
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
                  <Show when={!local.reccomendations} fallback={
                    <th><b></b></th>
                  }>
                    <th><b>Score</b></th>
                  </Show>
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

                      <Show when={!checkAdded(anime.mal_id)}
                        fallback={
                          <>
                            <td>
                              <p>Added</p>
                              <p>Your rating: {checkAdded(anime.mal_id)}</p>
                              <Form>
                                <input type="hidden" name="animeToRemove" value={anime.mal_id} />
                                <button type="submit" disabled={adding.pending}>Remove</button>
                              </Form>
                            </td>
                          </>
                        }>
                        <td>
                          <Form>
                            <label for="rating">Rating (1-10):</label>
                            <input type="number" name="rating" value="10" min="1" max="10" />
                            <input type="hidden" name="animeToAdd" value={JSON.stringify(anime)} />
                            <button type="submit" disabled={adding.pending}>Add</button>
                          </Form>
                        </td>
                      </Show>
                    </>
                  }>
                  <>
                    <td>{anime.rating}</td>
                    <td>
                      <Form>
                        <input type="hidden" name="animeToRemove" value={anime.mal_id} />
                        <button type="submit" disabled={adding.pending}>Remove</button>
                      </Form>
                    </td>
                  </>
                </Show>

              </tr>
            )}
          </For>
        </tbody>
      </table>
    </>
  );
}