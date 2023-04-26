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
            style={`transform: translateX(-${active() * 100}%); left: ${index() * 100*1.2}%; transition: transform 0.4s ease;`}
          >
            <div class="card">
              <img class="slider-img" src={item.image_url} alt={item.title} />
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
      .slider-img {
        width: image-width;
        height: 320px;
      }
      .card {
        height: 440px;
        width: 230px;
        margin-inline: 10px;
      }
      `}
    </style>
    </div>

  );
}
