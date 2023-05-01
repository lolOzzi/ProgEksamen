import { useUser, useUserList } from "~/models/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow, getAnimeList } from "~/components/AnimeList";
import { createEffect, createMemo, createSignal, Resource } from "solid-js";
import { userAnimeList } from "~/routes/users/[id]/profile";
import { JikanClient } from "@tutkli/jikan-ts";

export function routeData() {
	return { list: useUserList(), user: useUser() };
}

export const getReccomendations = async (id: number) => {
	await new Promise(r => setTimeout(r, 500));
	const jikan = new JikanClient();
	const recc = (await jikan.anime.getAnimeRecommendations(id)).data.map((elem) => {
		return {
			mal_id: elem.entry.mal_id,
			title: elem.entry.title,
			image_url: elem.entry.images.webp?.image_url,
			rating: ""
		} as AnimeShow;
	});
	return [recc[0], recc[1]];
}

export default function Home() {
	const userData = useRouteData<typeof routeData>();
	const userList = userData.list;
	const user = userData.user;
	const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>([]);

	createMemo(async () => {
		const data = await userAnimeList(userList);
    data?.sort((a, b) => (b.rating ? +b.rating : -Infinity) - (a.rating ? +a.rating : -Infinity));
		let Reccomendations: AnimeShow[] = [];
		if (data !== undefined) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].rating !== undefined && Number(data[i].rating) >= 7) {
					await getReccomendations(data[i].mal_id).then((res) => {
            console.log(data[i].title + " reccs: " + res[0]?.title + ", " + res[1]?.title);
						if (res[0] !== undefined && data.includes(res[0]) === false)
							Reccomendations.push(res[0]);
						if (res[1] !== undefined && data.includes(res[1]) === false)
							Reccomendations.push(res[1]);
					});
				}
				if (Reccomendations.length >= 8) {

					break;
				}
			}
		}
		setAniList(Reccomendations);
	});


	return (
		<main class="full-width">
			<h1>{user()?.username + "'s Reccomendations"}</h1>
			<AnimeList animeList={aniList()} />
		</main>
	);
}

