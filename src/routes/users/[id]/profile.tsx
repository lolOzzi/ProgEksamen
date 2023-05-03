import { useUser, useUserList } from "~/models/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow} from "~/views/AnimeList";
import { createEffect, createMemo, createSignal, Resource, Show } from "solid-js";
import { Anime, List } from ".prisma/client";
import { Form } from "solid-start/data/Form";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/models/session";

export function routeData() {
  return {list: useUserList(), user: useUser()};
}

export const userAnimeList = async (list: Resource<{
  list: List;
  anime: Anime[];
} | null | undefined>) => {

  return list()?.anime.map((anime) => {
    return {
      mal_id: anime.mal_id,
      title: anime.title,
      score: anime.score,
      image_url: anime.image_url,
      rating: anime.rating.toString(),
    } as AnimeShow;
  });
}

export default function Home() {
  const userData = useRouteData<typeof routeData>();
  const userList = userData.list;
  const user = userData.user;
  const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>([]);

  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );

  
  createMemo( async () => {
    const data = await userAnimeList(userList);
    setAniList(data);
  });

  
  function getSortedList() {
    const tempList = aniList();
    if (tempList === undefined)
     return tempList;
    else {
      return tempList.sort((a, b) => (b.rating ? +b.rating : -Infinity) - (a.rating ? +a.rating : -Infinity));
    }
  }
  return (
    <main class="full-width title-main">
      <div class="title-container">
        <h1 class="list-title">{user()?.username + "'s profile"}</h1>
      </div>
      <Form>
        <button name="logout" type="submit">
          Logout
        </button>
      <h2 class="list-title" style="color:#252526; font-size:1.75rem; margin-top:2em;">Your Anime List</h2>
      </Form>
      <div class="list-container" style="margin-top:0.5em;">
        <Show when={getSortedList()?.length != 0} fallback={
          <div><h2 style="font-size:1.2rem;">Try adding some anime first!</h2></div>
        }>
          <AnimeList animeList={getSortedList()} isUserList="true" />
        </Show>

      </div>
    </main>
  );
}

