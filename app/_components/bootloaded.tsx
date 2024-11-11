"use client";

import { useMemo } from "react";
import Arrow from "./arrow";
import Box from "./box";
import hash from "./hash";

interface Props {
    programHash: string;
    output: string[];
    bootloaderHash: string;
    updateProgramHash?: (s: string) => void;
    updateOutput?: (s: string[]) => void;
    updateBootloaderHash?: (s: string) => void;
}

export default function Bootloaded({
    programHash,
    output,
    bootloaderHash,
    updateProgramHash,
    updateOutput,
    updateBootloaderHash,
}: Props) {
    const bootloaderNoJobs = 1;
    const bootloaderOutput = useMemo(
        () => [
            "0x" + bootloaderNoJobs.toString(16),
            "0x" + (output.length + 2).toString(16),
            programHash,
            ...output,
        ],
        [programHash, output],
    );
    const bootloaderOutputHash = useMemo(
        () => hash(bootloaderOutput),
        [bootloaderOutput],
    );
    const factHash = useMemo(
        () => hash([bootloaderHash, bootloaderOutputHash]),
        [bootloaderHash, bootloaderOutputHash],
    );

    return (
        <div className="flex min-w-min items-center justify-center px-4 pt-8">
            <Box
                root
                values={bootloaderOutput}
                bottomText={["constant", "output size + 2"]}
                above={[
                    <Box
                        values={[programHash]}
                        topText="program hash"
                        onUpdate={
                            updateProgramHash
                                ? (_, s) => updateProgramHash(s)
                                : undefined
                        }
                        below={[
                            <Arrow
                                cols={[true]}
                                className="col-start-3"
                                key="2"
                            />,
                        ]}
                        className="mx-1"
                        colStart={3}
                        key="1"
                    />,
                    <Box
                        values={output}
                        topText="output"
                        onUpdate={
                            updateOutput
                                ? (i, s) =>
                                      updateOutput(output.toSpliced(i, 1, s))
                                : undefined
                        }
                        colStart={4}
                        below={output.map((_, i) => (
                            <Arrow key={i} cols={[true]} />
                        ))}
                        key="3"
                    />,
                ]}
                below={[
                    <Arrow
                        cols={bootloaderOutput.map(() => true)}
                        key="1"
                        bottom={3}
                    />,
                    <Box
                        values={[bootloaderHash]}
                        topText="bootloader program hash"
                        onUpdate={
                            updateBootloaderHash
                                ? (_, s) => updateBootloaderHash(s)
                                : undefined
                        }
                        colStart={1}
                        key="2"
                    />,
                    <Box
                        values={[bootloaderOutputHash]}
                        topText="bootloader output hash"
                        colStart={3}
                        key="3"
                    />,
                    <Arrow
                        cols={[true, false, true]}
                        colStart={1}
                        bottom={2}
                        key="4"
                    />,
                    <Box
                        values={[factHash]}
                        topText="fact hash"
                        colStart={2}
                        key="5"
                    />,
                ]}
            />
            {updateOutput && (
                <>
                    <button
                        className="mb-auto ml-1 mt-1 size-8 shrink-0 rounded-lg border border-white transition-all hover:bg-white hover:text-black"
                        onClick={() => updateOutput([...output, "0x0"])}
                    >
                        +
                    </button>
                    <button
                        className="mb-auto ml-1 mt-1 size-8 shrink-0 rounded-lg border border-white transition-all hover:bg-white hover:text-black"
                        onClick={() => updateOutput(output.slice(0, -1))}
                    >
                        -
                    </button>
                </>
            )}
        </div>
    );
}
