"use client";

import { useState } from "react";
import Plain, { usePlain } from "./plain";
import Bootloaded, { useBootloader } from "./bootloaded";
import VerificationHash from "./verification-hash";

interface Props {
    programHash: string;
    output: string[];
    bootloaderHash: string;
    updateProgramHash?: React.Dispatch<React.SetStateAction<string>>;
    updateOutput?: React.Dispatch<React.SetStateAction<string[]>>;
    updateBootloaderHash?: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProgramViewer({
    programHash,
    output,
    bootloaderHash,
    updateProgramHash,
    updateOutput,
    updateBootloaderHash,
}: Props) {
    const [isBootloaded, setIsBootloaded] = useState(true);
    const [layout, setLayout] = useState("recursive");
    const [hasher, setHasher] = useState("keccak_160_lsb");
    const [stoneVersion, setStoneVersion] = useState("stone6");
    const [memoryVerification, setMemoryVerification] = useState("relaxed");
    const [securityBits, setSecurityBits] = useState("96");

    const {
        bootloaderOutput,
        bootloaderOutputHash,
        factHash: bootloaderFactHash,
    } = useBootloader({ programHash, output, bootloaderHash });

    const { outputHash, factHash } = usePlain({ programHash, output });

    return (
        <div className="pb-8">
            <button
                onClick={() => setIsBootloaded(!isBootloaded)}
                className="rounded-lg border border-white px-4 py-2 transition-all hover:bg-white hover:text-black"
            >
                Switch to {isBootloaded ? "Plain" : "Bootloaded"} View
            </button>

            {isBootloaded ? (
                <Bootloaded
                    programHash={programHash}
                    output={output}
                    bootloaderHash={bootloaderHash}
                    bootloaderOutput={bootloaderOutput}
                    bootloaderOutputHash={bootloaderOutputHash}
                    factHash={bootloaderFactHash}
                    programHash_update={updateProgramHash}
                    output_update={updateOutput}
                    bootloaderHash_update={updateBootloaderHash}
                />
            ) : (
                <Plain
                    programHash={programHash}
                    output={output}
                    outputHash={outputHash}
                    factHash={factHash}
                    updateProgramHash={updateProgramHash}
                    updateOutput={updateOutput}
                />
            )}

            <div className="h-12" />

            <VerificationHash
                layout={layout}
                hasher={hasher}
                stoneVersion={stoneVersion}
                memoryVerification={memoryVerification}
                factHash={isBootloaded ? bootloaderFactHash : factHash}
                securityBits={securityBits}
                updateLayout={setLayout}
                updateHasher={setHasher}
                updateStoneVersion={setStoneVersion}
                updateMemoryVerification={setMemoryVerification}
                updateSecurityBits={setSecurityBits}
            />
        </div>
    );
}
