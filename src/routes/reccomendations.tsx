import { useUser, useUserList } from "~/models/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow, getAnimeList} from "~/components/AnimeList";
import { createEffect, createMemo, createSignal, Resource } from "solid-js";
import { Anime, List } from ".prisma/client";
import { userAnimeList } from "~/routes/users/[id]/profile";

export function routeData() {
  return {list: useUserList(), user: useUser()};
}


export const getReccomendations = async (id: number) => {
    const recc = await getAnimeList("anime", "getAnimeRecommendations", id);
    return [recc[0], recc[1]];
}

export default function Home() {
  const userData = useRouteData<typeof routeData>();
  const userList = userData.list;
  const user = userData.user;
  const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>([]);
  
  createMemo( async () => {
    const data = await userList()?.anime;
    let Reccomendations: AnimeShow[] = [];
    if (data !== undefined) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].rating === 10) {
                await getReccomendations(data[i].mal_id).then((res) => {
                    Reccomendations.push(res[0]);
                    Reccomendations.push(res[1]);
                });
            }
            if (Reccomendations.length === 6) {
                break;
            }
        }
    }z
    setAniList(Reccomendations);
  });

  
  return (
    <main class="full-width">
      <h1>{user()?.username + "'s Reccomendations"}</h1>
      <AnimeList animeList={aniList()} isUserList="true" />
    </main>
  );
}

