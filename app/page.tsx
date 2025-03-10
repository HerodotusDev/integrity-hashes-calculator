import { Suspense } from "react";
import ClientPage from "./client_page";

export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientPage />
        </Suspense>
    );
}
