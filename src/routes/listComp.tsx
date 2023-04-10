import { For } from 'solid-js';
import { AnimeShow } from './list';


export default function AnimeList(props: {animeList?: AnimeShow[]}) {
  return (
    <>
      <For each={props.animeList}>
        {(anime) => (
          <div>
            <img src={anime.image_url} alt={anime.title} />
            <p>{anime.title}</p>
            <p>{anime.score}</p>
          </div>
          )}
      </For>
      <style>
      {`
        p {
          margin: 10px;
          color: black;
        }
      `}
    </style>
    </>
  );
}