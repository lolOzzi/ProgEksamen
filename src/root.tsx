// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import NavBar from "./views/navbar";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Link rel="icon" href="/favicon.ico" />
        <Title>Anime Nexus</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />

      </Head>
      <Body>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading</div>}>
            <NavBar/>
            <Routes>
              <FileRoutes />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}
