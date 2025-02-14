"use client";

import { useState } from "react";
import ProgramViewer from "./_components/program-viewer";
import Link from "next/link";

export default function Home() {
    const [output, setOutput] = useState(["0xa", "0x90"]);
    const [programHash, setProgramHash] = useState(
        "0x44024d4ce3b8553aef0387ab1c77befaada999a40814f677e289f086d54ccbb",
    );
    const [bootloaderHash, setBootloaderHash] = useState(
        "0x5ab580b04e3532b6b18f81cfa654a05e29dd8e2352d88df1e765a84072db07",
    );

    return (
        <div>
            <p className="mb-2">
                You can also{" "}
                <Link href="/proof" className="text-blue-600">
                    read data from uploaded proof
                </Link>
            </p>
            <ProgramViewer
                programHash={programHash}
                output={output}
                bootloaderHash={bootloaderHash}
                updateProgramHash={setProgramHash}
                updateOutput={setOutput}
                updateBootloaderHash={setBootloaderHash}
            />
        </div>
    );
}
