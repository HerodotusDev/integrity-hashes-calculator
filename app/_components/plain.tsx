"use client";

import { useMemo } from "react";
import Arrow from "./arrow";
import Box from "./box";
import hash from "./hash";

interface Props {
    programHash: string;
    output: string[];
    updateProgramHash?: (s: string) => void;
    updateOutput?: (s: string[]) => void;
}

export default function Plain({
    programHash,
    output,
    updateProgramHash,
    updateOutput,
}: Props) {
    const outputHash = useMemo(() => hash(output), [output]);
    const factHash = useMemo(
        () => hash([programHash, outputHash]),
        [programHash, outputHash],
    );

    return (
        <div className="flex min-w-min items-center justify-center px-4 pt-8">
            <Box
                root={output.length + 2}
                values={output}
                colStart={3}
                colShift={3}
                below={[
                    <Arrow
                        cols={output.map(() => true)}
                        bottom={1}
                        colStart={3}
                        key="1"
                    />,
                    <Box
                        values={[programHash]}
                        topText="program hash"
                        onUpdate={
                            updateProgramHash
                                ? (_, s) => updateProgramHash(s)
                                : undefined
                        }
                        key="2"
                    />,
                    <Box
                        values={[outputHash]}
                        topText="output hash"
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
