import "./navbar.css";

export default function NavBar() {


    return (
        <div class="nav-container">
            <ul class="navbar">
                <li><a href="/">Home</a></li>
                <li><a href="/anime">Anime</a></li>
                <li><a href="/search">Search</a></li>
                <li><a href="/reccomendations">Reccomendations</a></li>
                <li><a href="/profile">Profile</a></li>
            </ul>
        </div>
    )
}