"use client";

import { useMemo } from "react";
import Arrow from "./arrow";
import Box from "./box";
import hash from "./hash";

interface BootloaderInput {
    programHash: string;
    output: string[];
    bootloaderHash: string;
}

interface BootloaderOutput {
    bootloaderOutput: string[];
    bootloaderOutputHash: string;
    factHash: string;
}

export function useBootloader({
    programHash,
    output,
    bootloaderHash,
}: BootloaderInput): BootloaderOutput {
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

    return { bootloaderOutput, bootloaderOutputHash, factHash };
}

type BootloaderInputUpdate = {
    [K in keyof BootloaderInput as `${K & string}_update`]?:
        | React.Dispatch<React.SetStateAction<BootloaderInput[K]>>
        | undefined;
};

export default function Bootloaded({
    programHash,
    output,
    bootloaderHash,
    bootloaderOutput,
    bootloaderOutputHash,
    factHash,
    programHash_update,
    output_update,
    bootloaderHash_update,
}: BootloaderInput & BootloaderInputUpdate & BootloaderOutput) {
    return (
        <div className="flex min-w-min items-center justify-center px-4">
            <Box
                root
                values={bootloaderOutput}
                bottomText={["constant", "output size + 2"]}
                above={[
                    <Box
                        values={[programHash]}
                        topText="program hash"
                        onUpdate={
                            programHash_update
                                ? (_, s) => programHash_update(s)
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
                            output_update
                                ? (i, s) =>
                                      output_update(output.toSpliced(i, 1, s))
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
                            bootloaderHash_update
                                ? (_, s) => bootloaderHash_update(s)
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
            {output_update && (
                <>
                    <button
                        className="mb-auto ml-1 mt-1 size-8 shrink-0 rounded-lg border border-white transition-all hover:bg-white hover:text-black"
                        onClick={() => output_update([...output, "0x0"])}
                    >
                        +
                    </button>
                    <button
                        className="mb-auto ml-1 mt-1 size-8 shrink-0 rounded-lg border border-white transition-all hover:bg-white hover:text-black"
                        onClick={() => output_update(output.slice(0, -1))}
                    >
                        -
                    </button>
                </>
            )}
        </div>
    );
}
