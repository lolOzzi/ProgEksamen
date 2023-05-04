import { Anime, JikanClient, JikanResponse } from "@tutkli/jikan-ts";
import { sleep } from "~/utils/helper";

export type AnimeShow = {
    mal_id: number;
    title: string;
    score: number;
    image_url: string;
    rating?: string;
    members?: number;
  };
  

export const getAnimeList = async <T extends keyof JikanClient>(objectName: T, methodName: keyof JikanClient[T], ...args: any[]) => {

    const jikanClient = new JikanClient();
    let response = {} as JikanResponse<Anime[]>;
    const MAX_RETRIES = 10;
  
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        response = await (jikanClient[objectName][methodName] as (...args: any[]) => Promise<JikanResponse<Anime[]>>)(...args);
        break;
      } catch (error) {
        console.log(`Request failed, retrying (${i + 1}/${MAX_RETRIES})...`);
        await sleep(666 * (i + 1));
      }
    }
    if (response.data === undefined) {
      throw new Error(`Too many Requests, try again later`);
    }
    const data = response.data;
    const theShows = data.map((anime: any) => {
      return {
        mal_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.webp.image_url,
        score: anime.score,
        members: anime.members,
      } as AnimeShow;
    });
    return theShows;
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