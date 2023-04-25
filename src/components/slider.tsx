import { createSignal, For, Signal } from "solid-js";
import "./slider.css"
import { AnimeShow } from "./AnimeList";


export default function Slider(props: { animeList?: AnimeShow[] }) {
  const [active, setActive] = createSignal(0);
  
  const changeActive = (direction: number) => {
    const length = props.animeList?.length;
    if (active() + direction < 0 || active() + direction >= (length? length : 0)) {
      return;
    }
    setActive((current) => current + direction);
  };


  return (
    <div class="carousel-container">
      <button class="carousel-button" onClick={() => changeActive(-1)}>‹</button>
      <div class="carousel-items">
        <For each={props.animeList}>
        {(item, index) => (
          <div
            class="carousel-item"
            style={`transform: translateX(${(index() - active()) * 100}%); transition: transform 0.4s ease;`}
          >
            <div class="card">
              <img src={item.image_url} alt={item.title} />
              <p>{item.title}</p>
              <p>{item.score}</p>
            </div>
          </div>
        )}
        </For>
      </div>
      <button class="carousel-button carousel-button_next" onClick={() => changeActive(1)}>›</button>
      <style>
      {`
      img {
        width: image-width;
      }
      `}
    </style>
    </div>

  );
}
