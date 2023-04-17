import { createSignal, For, Signal } from "solid-js";
import "./slider.css"
import { AnimeShow } from "../components/listComp";


export default function Slider(props: { animeList?: AnimeShow[] }) {
  const [active, setActive] = createSignal(0);
  const [items, setItems] = createSignal() as Signal<AnimeShow[] | undefined>;
  setItems(props.animeList);

  console.log(items());

  const changeActive = (direction: number) => {
    const length = items()?.length;
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
            <div>
              <img src={item.image_url} alt={item.title} />
              <p>{item.title}</p>
              <p>{item.score}</p>
            </div>
          </div>
        )}
        </For>
      </div>
      <button class="carousel-button carousel-button_next" onClick={() => changeActive(1)}>›</button>
    </div>
  );
}
