import "./navbar.css";
import { createEffect, createMemo, createResource, createSignal, Signal} from 'solid-js';
import { useUser } from "../db/useUser";
import { useLocation } from "solid-start";

export default function NavBar() {;
    let [username, setUsername] = createSignal("Login") as Signal<string | undefined>;
    if (!useLocation().pathname.includes("login")) {
        const user = useUser();
        setUsername(user()?.username) ;
    }

    return (
        <div class="nav-container">
            <ul class="navbar">
                <li><img src="/images/logo.svg" width="250px" height="52" style="display:block;"/></li>
                <li><a href="/">Home</a></li>
                <li><a href="/anime">Anime</a></li>
                <li><a href="/search">Search</a></li>
                <li><a href="/reccomendations">Reccomendations</a></li>
                <li><a href={username()? "/profile" : "/login"}>{username()? username() : "Not logged in"}</a></li>
            </ul>
        </div>
    )
}