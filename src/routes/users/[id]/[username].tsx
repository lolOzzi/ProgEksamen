import { useLocation } from "@solidjs/router"


export default function Home() {

    const location = useLocation();


    return (
        <main class="full-width">
            <h1>Home</h1>
            <h3>{location.pathname}</h3>
        </main>
    )
}