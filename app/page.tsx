"use client";

import { useState } from "react";
import ProgramViewer from "./_components/program-viewer";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [output, setOutput] = useState(
        searchParams.get("o")?.split(",") ?? ["0xa", "0x90"],
    );
    const [programHash, setProgramHash] = useState(
        searchParams.get("p") ??
            "0x44024d4ce3b8553aef0387ab1c77befaada999a40814f677e289f086d54ccbb",
    );
    const [bootloaderHash, setBootloaderHash] = useState(
        searchParams.get("b") ??
            "0x5ab580b04e3532b6b18f81cfa654a05e29dd8e2352d88df1e765a84072db07",
    );

    const hasDefaultValue =
        searchParams.has("o") ||
        searchParams.has("p") ||
        searchParams.has("b") ||
        searchParams.has("l") ||
        searchParams.has("h") ||
        searchParams.has("v") ||
        searchParams.has("m") ||
        searchParams.has("s");

    const switchToEditMode = () => {
        const params = new URLSearchParams(searchParams);
        params.set("e", "true");
        router.replace(`?${params.toString()}`);
    };

    const switchToLockedMode = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("e");
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap">
            {!searchParams.has("e") && hasDefaultValue ? (
                <button
                    onClick={switchToEditMode}
                    className="rounded-lg border border-white px-4 py-2 transition-all hover:bg-white hover:text-black"
                >
                    Switch to edit mode
                </button>
            ) : (
                <>
                    <p className="mb-2 w-full">
                        You can also{" "}
                        <Link href="/proof" className="text-blue-600">
                            read data from uploaded proof
                        </Link>
                    </p>
                    {hasDefaultValue && (
                        <button
                            onClick={switchToLockedMode}
                            className="mr-2 rounded-lg border border-white px-4 py-2 transition-all hover:bg-white hover:text-black"
                        >
                            Switch to locked mode
                        </button>
                    )}
                </>
            )}
            <ProgramViewer
                programHash={programHash}
                output={output}
                bootloaderHash={bootloaderHash}
                updateProgramHash={
                    !searchParams.has("e") && searchParams.has("p")
                        ? undefined
                        : setProgramHash
                }
                updateOutput={
                    !searchParams.has("e") && searchParams.has("o")
                        ? undefined
                        : setOutput
                }
                updateBootloaderHash={
                    !searchParams.has("e") && searchParams.has("b")
                        ? undefined
                        : setBootloaderHash
                }
                lockedData={{
                    layout: searchParams.get("l") ?? undefined,
                    hasher: searchParams.get("h") ?? undefined,
                    stoneVersion: searchParams.get("v") ?? undefined,
                    memoryVerification: searchParams.get("m") ?? undefined,
                    securityBits: searchParams.get("s") ?? undefined,
                }}
            />
        </div>
    );
}
