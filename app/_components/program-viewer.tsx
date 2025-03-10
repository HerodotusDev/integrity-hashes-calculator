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
    lockedData?: {
        layout?: string;
        hasher?: string;
        stoneVersion?: string;
        memoryVerification?: string;
        securityBits?: string;
    };
}

export default function ProgramViewer({
    programHash,
    output,
    bootloaderHash,
    updateProgramHash,
    updateOutput,
    updateBootloaderHash,
    lockedData,
}: Props) {
    // if updateBootloaderHash is undefined then bootloaded/plain switching is turned of so only empty string results in plain
    const [isBootloaded, setIsBootloaded] = useState(
        updateBootloaderHash === undefined ? bootloaderHash != "" : true,
    );
    const [layout, setLayout] = useState(lockedData?.layout ?? "recursive");
    const [hasher, setHasher] = useState(
        lockedData?.hasher ?? "keccak_160_lsb",
    );
    const [stoneVersion, setStoneVersion] = useState(
        lockedData?.stoneVersion ?? "stone6",
    );
    const [memoryVerification, setMemoryVerification] = useState(
        lockedData?.memoryVerification ?? "relaxed",
    );
    const [securityBits, setSecurityBits] = useState(
        lockedData?.securityBits ?? "96",
    );

    const {
        bootloaderOutput,
        bootloaderOutputHash,
        factHash: bootloaderFactHash,
    } = useBootloader({ programHash, output, bootloaderHash });

    const { outputHash, factHash } = usePlain({ programHash, output });

    return (
        <>
            {updateBootloaderHash !== undefined && (
                <button
                    onClick={() => setIsBootloaded(!isBootloaded)}
                    className="mb-auto rounded-lg border border-white px-4 py-2 transition-all hover:bg-white hover:text-black"
                >
                    Switch to {isBootloaded ? "Plain" : "Bootloaded"} View
                </button>
            )}

            <div className="w-full">
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
                    updateLayout={
                        lockedData?.layout !== undefined ? undefined : setLayout
                    }
                    updateHasher={
                        lockedData?.hasher !== undefined ? undefined : setHasher
                    }
                    updateStoneVersion={
                        lockedData?.stoneVersion !== undefined
                            ? undefined
                            : setStoneVersion
                    }
                    updateMemoryVerification={
                        lockedData?.memoryVerification !== undefined
                            ? undefined
                            : setMemoryVerification
                    }
                    updateSecurityBits={
                        lockedData?.securityBits !== undefined
                            ? undefined
                            : setSecurityBits
                    }
                />
            </div>
        </>
    );
}
