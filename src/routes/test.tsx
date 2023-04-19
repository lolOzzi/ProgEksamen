import { useRouteData } from "solid-start";
import { useUserList } from "~/db/useUser";

export function routeData() {
    return useUserList();
  }


export default function Home() {
    const list = useRouteData<typeof routeData>();
    console.log(list());

    return (
        <main class="full-width">
            <h1>Home</h1>

        </main>
    )

}