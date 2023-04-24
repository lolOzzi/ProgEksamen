import { JikanClient } from "@tutkli/jikan-ts";
import { getRandomValues } from "crypto";
import { createResource, createSignal, resetErrorBoundaries, Signal } from "solid-js";
import { useRouteData } from "solid-start";
import { Form } from "solid-start/data/Form";
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

    //let data = [] as any;
    //data = await jikan.anime.getAnimeById(5114);
    //const [animeList, {mutate, refetch}] = createResource(tester);
    const [enrolling, { Form }] = createServerAction$(async (form: FormData, { request }) => {
        const jikan = new JikanClient();
        const anime = (await jikan.anime.getAnimeById(5114)).data;

        const response = await addAnimeToUserList({title: anime.title, score: anime.score,
                                               image_url: anime.images.webp? anime.images.webp.image_url : anime.images.jpg.image_url,
                                               rating: 10 }, request);
        console.log("response: " + response);
     });


    return (
        <main class="full-width">
          <Form>
            <input type="hidden" name="subject" value="Defense against the Dark Arts" />
            <button type="submit" disabled={enrolling.pending}>
              Add
            </button>
          </Form>
        </main>
    )

}