import { useUser, useUserList } from "~/models/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow} from "~/components/AnimeList";
import { createEffect, createMemo, createSignal, Resource } from "solid-js";
import { Anime, List } from ".prisma/client";

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
    <main class="full-width">
      <h1>{user()?.username + "'s profile"}</h1>
      <AnimeList animeList={getSortedList()} isUserList="true" />
    </main>
  );
}

