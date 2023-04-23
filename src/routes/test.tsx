import { JikanClient } from "@tutkli/jikan-ts";
import { getRandomValues } from "crypto";
import { createResource, createSignal, resetErrorBoundaries, Signal } from "solid-js";
import { useRouteData } from "solid-start";
import server$, { createServerAction$ } from "solid-start/server";
import AnimeList, { AnimeShow, getAnimeList } from "~/components/AnimeList";
import { addAnimeToUserList } from "~/db/session";
import { useUser, useUserList } from "~/db/useUserData";

export function routeData() {
    return {user: useUser(), list: useUserList()};
  }

export async function tester() {
    const jikan = new JikanClient();
    //let data = [] as any;
    //data = await jikan.anime.getAnimeById(5114);
    console.log("data: " + await jikan.anime.getAnimeById(1))
    /*const theShows = data.map((anime: any) => {
        return {
          title: anime.title,
          score: anime.score,
          image_url: anime.images.jpg.image_url,
        } as AnimeShow;
      });
    return theShows;*/

}
export default function Home() {
    const userData = useRouteData<typeof routeData>();
    const jikan = new JikanClient();
    //let data = [] as any;
    //data = await jikan.anime.getAnimeById(5114);
    console.log("data: " + jikan.anime.getAnimeById(1))
    //const [animeList, {mutate, refetch}] = createResource(tester);
    const pog =  server$(async (userData) => {
        const user = await userData.user;
        const list = await userData.list;
        //if (!user) {console.log("no user"); return};
        await addAnimeToUserList({mal_id:5114, rating: 10 }, "adce8a51-86c3-4401-aad7-aeab7ef81dc3");
        return userData.list?.anime;
     });
     pog(userData)



    return (
        <main class="full-width">
            <h1>Home</h1>
        </main>
    )

}