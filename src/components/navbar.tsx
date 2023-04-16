import "./navbar.css";
import { createEffect, createMemo, createResource, createSignal, Signal } from 'solid-js';
import { useUser } from "../db/useUser";
import { Navigate, useLocation } from "solid-start";
import { createServerAction$, redirect } from "solid-start/server";
import { useNavigate } from "solid-start";



export default function NavBar() {
    const [query, setQuery] = createSignal("");
    let [username, setUsername] = createSignal("Login") as Signal<string | undefined>;
    
    if (!useLocation().pathname.includes("login")) {
        const user = useUser();
        setUsername(user()?.username);
    }


    return (
        <div class="nav-container">
            <ul class="navbar">
                <li><img src="/images/logo.svg" width="250px" height="52" style="display:block;" /></li>
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
                    <input id="search-box" type="text" value={query()} onInput={(evt) => setQuery(evt.currentTarget.value)} />
                </li>
                <li><a class="search-button" href={"/search?q=" + query()}>Search</a></li>
                <li class="profile"><a href={username() ? "/profile" : "/login"}>{username() ? username() : "Not logged in"}</a></li>
            </ul>
        </div>
    )
}