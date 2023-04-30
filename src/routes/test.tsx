import { JikanClient } from "@tutkli/jikan-ts";
import { getRandomValues } from "crypto";
import { createResource, createSignal, resetErrorBoundaries, Signal } from "solid-js";
import { useRouteData } from "solid-start";
import { Form } from "solid-start/data/Form";
import server$, { createServerAction$ } from "solid-start/server";
import AnimeList, { AnimeShow, getAnimeList } from "~/components/AnimeList";
import { addAnimeToUserList } from "~/models/session";
import { useUser, useUserList } from "~/models/useUserData";

export function routeData() {
    return {user: useUser(), list: useUserList()};
  }

export async function tester() {

}
export default function Home() {



    return (
        <main class="full-width">

        </main>
    )

}