"use client";

import { useState } from "react";
import Bootloaded from "./_components/bootloaded";
import Link from "next/link";

export default function Home() {
    const [output, setOutput] = useState(["0x5", "0xd"]);
    const [programHash, setProgramHash] = useState(
        "0x59874649ccc5a0a15ee77538f1eb760acb88cab027a2d48f4246bf17b7b7694",
    );
    const [bootloaderHash, setBootloaderHash] = useState(
        "0x40519557c48b25e7e7d27cb27297300b94909028c327b385990f0b649920cc3",
    );
    // fact hash: 0x7e5c70a21c04ac05f296a3ff378eb31789f0665150980fef53cb3d09dd5b4fd

    return (
        <>
            <p>
                You can also{" "}
                <Link href="/proof" className="text-blue-600">
                    read data from uploaded proof
                </Link>
            </p>
            <Bootloaded
                programHash={programHash}
                output={output}
                bootloaderHash={bootloaderHash}
                updateProgramHash={setProgramHash}
                updateOutput={setOutput}
                updateBootloaderHash={setBootloaderHash}
            />
        </>
    );
}
