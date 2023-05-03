import { useUser, useUserList } from "~/models/useUserData";
import { useRouteData } from "solid-start";
import AnimeList, { AnimeShow, getAnimeList } from "~/views/AnimeList";
import { createEffect, createMemo, createSignal, Resource, Show } from "solid-js";
import { userAnimeList } from "~/routes/users/[id]/profile";
import { JikanClient } from "@tutkli/jikan-ts";
import { isServer } from "solid-js/web";
import { sleep } from "~/utils/helper";

export function routeData() {
	return { list: useUserList(), user: useUser() };
}

export const getReccomendations = async (id: number) => {
	await new Promise(r => setTimeout(r, 333));
	const jikan = new JikanClient();
	let recc = [] as AnimeShow[];
	const MAX_RETRIES = 10;

	for (let i = 0; i < MAX_RETRIES; i++) {
		try {
			recc = (await jikan.anime.getAnimeRecommendations(id)).data.map((elem) => {
				return {
					mal_id: elem.entry.mal_id,
					title: elem.entry.title,
					image_url: elem.entry.images.webp?.image_url,
					rating: ""
				} as AnimeShow;
			});
			break;
		} catch (error) {
			console.log(`Request failed, retrying (${i + 1}/${MAX_RETRIES})...`);
			await sleep(666 * (i + 1));
		}
	}
	if (recc === undefined) {
		throw new Error(`Too many Requests, try again later`);
	}

	return [recc[0], recc[1]];
}

export default function Home() {
	const userData = useRouteData<typeof routeData>();
	const userList = userData.list;
	const user = userData.user;
	const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>();
	const [userAniList, setUserAniList] = createSignal<AnimeShow[] | undefined>([]);
	const [noRecc, setNoRecc] = createSignal<boolean>(false);

	createMemo(async () => {
		const data = await userAnimeList(userList);
		data?.sort((a, b) => (b.rating ? +b.rating : -Infinity) - (a.rating ? +a.rating : -Infinity));
		if (data !== undefined)
			setUserAniList(data);
	});

	createMemo(async () => {
		setAniList(undefined);
		let Reccomendations: AnimeShow[] | undefined = undefined;

		const data = userAniList();

		if (data?.length !== 0 && data !== undefined) {
			Reccomendations = [];
			for (let i = 0; i < data.length; i++) {
				if (data[i].rating !== undefined && Number(data[i].rating) >= 7) {
					await getReccomendations(data[i].mal_id).then((res) => {
						if (res[0].mal_id !== undefined && !data.some(obj => obj.mal_id === res[0].mal_id)) {
							Reccomendations?.push(res[0]);
						}
						if (res[1] !== undefined && !data.some(obj => obj.mal_id === res[1].mal_id)) {
							Reccomendations?.push(res[1]);
						}
					});
				}
				if (Reccomendations.length >= 10) {
					break;
				}
			}
		}
		setAniList(Reccomendations ? Reccomendations : undefined);
	});


	return (
		<main class="full-width title-main">
			<div class="title-container">
				<h1 class="list-title">{user()?.username + "'s Reccomendations"}</h1>
			</div>

			<div class="list-container">
				<Show when={aniList()} fallback={<div><h2 style="font-size:1.5rem;">loading...</h2></div>}>
					<Show when={aniList()?.length !== 0} fallback={
						<div><h2 style="font-size:1.5rem;">Try adding some anime with a rating above 7 first!</h2></div>
					}>
						<AnimeList animeList={aniList()} userList={userAniList()} />
					</Show>
				</Show>
			</div>


		</main>
	);
}

