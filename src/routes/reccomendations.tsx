import { useUser, useUserList } from "~/models/getUserData";
import { useRouteData } from "solid-start";
import { AnimeShow, getReccomendations} from "~/models/getAnimeData";
import AnimeList from "~/views/AnimeList";
import { userAnimeList } from "~/routes/users/[id]/profile";
import { createMemo, createSignal, Show } from "solid-js";

export function routeData() {
	return { list: useUserList(), user: useUser() };
}

export default function Home() {
	const userData = useRouteData<typeof routeData>();
	const userList = userData.list;
	const user = userData.user;
	const [aniList, setAniList] = createSignal<AnimeShow[] | undefined>();
	const [userAniList, setUserAniList] = createSignal<AnimeShow[] | undefined>([]);
	

	createMemo(async () => {
		let Reccomendations: AnimeShow[] | undefined = [];
		const listData = await userAnimeList(userList);
		listData?.sort((a, b) => (b.rating ? +b.rating : -Infinity) - (a.rating ? +a.rating : -Infinity));
		if (listData !== undefined) {
			setUserAniList(listData);
		}
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
				const tempReccomendations: AnimeShow[] = Reccomendations.filter((show, index, self) => index === self.findIndex((s) => (s.mal_id === show.mal_id)));
				Reccomendations = tempReccomendations;
				if (Reccomendations.length >= 15) {
					break;
				}
			}
		}
		setAniList(Reccomendations);
			
	});


	return (
		<main class="full-width title-main">
			<div class="title-container">
				<h1 class="list-title">{user()?.username + "'s Reccomendations"}</h1>
			</div>

			<div class="list-container">
				<Show when={aniList()} fallback={<div><h2 style="font-size:1.5rem;">loading...</h2></div>}>
					<Show when={aniList()?.length != 0} fallback={
						<div><h2 style="font-size:1.5rem;">Try adding some anime with a rating of 7 or above!</h2></div>
					}>
						<AnimeList animeList={aniList()} userList={userAniList()} reccomendations={true} />
					</Show>
				</Show>
			</div>


		</main>
	);
}

