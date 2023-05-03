import "./navbar.css";
import { createEffect, createSignal, Show, Signal } from 'solid-js';
import { useUser } from "../models/useUserData";
import { useLocation } from "solid-start";
import { sleep } from "~/utils/helper";


export default function NavBar() {
    const [query, setQuery] = createSignal("");
    const [username, setUsername] = createSignal("Login") as Signal<string | undefined>;
    const user = useUser();
    const location = useLocation();
    
    const getUsername = () => {
        if (!location.pathname.includes("login")) {
            return user()?.username || "Login";
        }
        return "Login";
    };

    return (
        <div class="nav-container">
            <ul class="navbar">
                <li><a href="/" class="logo-link"><img src="/images/logo.svg" width="250px" height="52" style="display:block;" /></a></li>
                <li><a href="/">Home</a></li>
                <li class="dropdown">
                    <a href="#" class="dropbtn">Anime</a>
                    <div class="dropdown-content">
                        <a href="/top">Top</a>
                        <a href="/popular">Popular</a>
                        <a href="/search">Search</a>
                    </div>
                </li>
                <li><a href="/reccomendations">Reccomendations</a></li>
                <li>
                    <input id="nav-search-box" type="text" value={query()} onInput={(evt) => setQuery(evt.currentTarget.value)} />
                </li>
                <li><a class="nav-search-button" href={"/search?q=" + query()}>Search</a></li>
                <Show when={getUsername() != "Login"} fallback={
                    <li class="profile"><a href={"/login"}>{"Login"}</a></li>
                }>
                <li class="profile"><a href={"/users/" + getUsername() + "/profile"}>{getUsername()}</a></li>
                </Show>
                
            </ul>
        </div>
    )
}