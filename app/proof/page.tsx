"use client";

import { ChangeEventHandler, useMemo, useState } from "react";
import Bootloaded, { useBootloader } from "../_components/bootloaded";
import Plain, { usePlain } from "../_components/plain";
import VerificationHash from "../_components/verification-hash";
import hash from "../_components/hash";
import Link from "next/link";

export default function ProgramHashPage() {
    const [stoneVersion, setStoneVersion] = useState("");
    const [memoryVerification, setMemoryVerification] = useState("");

    const [jsonData, setJsonData] = useState<any>(null);
    const parsed = useMemo(() => {
        if (!jsonData) {
            return null;
        }
        try {
            const page = jsonData["public_input"]["public_memory"];

            const program_end =
                jsonData["public_input"]["memory_segments"]["execution"][
                    "begin_addr"
                ] - 2;
            const program = page.filter((x: any) => x["address"] < program_end);
            const program_hash = hash(program.map((x: any) => x["value"]));

            const output_start =
                jsonData["public_input"]["memory_segments"]["output"][
                    "begin_addr"
                ];
            const output_end =
                jsonData["public_input"]["memory_segments"]["output"][
                    "stop_ptr"
                ];
            const output = page
                .filter(
                    (x: any) =>
                        x["address"] >= output_start &&
                        x["address"] < output_end,
                )
                .map((x: any) => x["value"]);

            const is_bootloaded =
                output[0] == "0x1" &&
                output[1] == "0x" + (output.length - 1).toString(16);

            const layout = jsonData["public_input"]["layout"];
            const hasher = jsonData["proof_parameters"]["commitment_hash"]
                .replace("keccak256", "keccak")
                .replace("blake256", "blake2s")
                .replace("masked", "");

            const log_n_cosets =
                jsonData["proof_parameters"]["stark"]["log_n_cosets"];
            const n_queries =
                jsonData["proof_parameters"]["stark"]["fri"]["n_queries"];
            const proof_of_work_bits =
                jsonData["proof_parameters"]["stark"]["fri"][
                    "proof_of_work_bits"
                ];

            const security_bits = (
                log_n_cosets * n_queries +
                proof_of_work_bits
            ).toString();

            return {
                program_hash,
                output,
                is_bootloaded,
                layout,
                hasher,
                security_bits,
            };
        } catch {
            return null;
        }
    }, [jsonData]);

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target?.files?.[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsedData = JSON.parse(
                        event.target?.result as string,
                    );
                    setJsonData(parsedData);
                } catch {
                    setJsonData(null);
                }
            };
            reader.readAsText(file);
        } else {
            setJsonData(null);
        }
    };

    const programHash = parsed?.output?.[2];
    const childOutput = parsed?.output?.slice(3);
    const {
        bootloaderOutput,
        bootloaderOutputHash,
        factHash: bootloadedFactHash,
    } = useBootloader({
        bootloaderHash: parsed?.program_hash ?? "",
        programHash: programHash ?? "",
        output: childOutput ?? [],
    });

    const { outputHash, factHash: plainFactHash } = usePlain({
        programHash: parsed?.program_hash ?? "",
        output: parsed?.output,
    });

    if (jsonData === null)
        return (
            <div className="flex flex-col gap-2">
                <input type="file" accept=".json" onChange={handleFileChange} />
                <Link href="/" className="text-blue-600">
                    Go to interactive view
                </Link>
            </div>
        );

    return (
        <div>
            <button className="text-blue-600" onClick={() => setJsonData(null)}>
                Submit another
            </button>{" "}
            |{" "}
            <Link href="/" className="text-blue-600">
                Go to interactive view
            </Link>
            {jsonData !== null &&
                (parsed !== null ? (
                    <h2>
                        Your proof{" "}
                        {parsed.is_bootloaded ? "looks like" : "is not"}{" "}
                        bootloaded
                    </h2>
                ) : (
                    <h2>File cannot be parsed as a proof</h2>
                ))}
            {parsed?.is_bootloaded === true && (
                <Bootloaded
                    bootloaderHash={parsed.program_hash}
                    programHash={programHash}
                    output={childOutput}
                    bootloaderOutput={bootloaderOutput}
                    bootloaderOutputHash={bootloaderOutputHash}
                    factHash={bootloadedFactHash}
                />
            )}
            {parsed?.is_bootloaded === false && (
                <Plain
                    programHash={parsed.program_hash}
                    output={parsed.output}
                    outputHash={outputHash}
                    factHash={plainFactHash}
                />
            )}
            {parsed !== null && (
                <>
                    <div className="h-12" />

                    <VerificationHash
                        layout={parsed.layout}
                        hasher={parsed.hasher}
                        stoneVersion={stoneVersion}
                        memoryVerification={memoryVerification}
                        securityBits={parsed.security_bits}
                        factHash={
                            parsed.is_bootloaded
                                ? bootloadedFactHash
                                : plainFactHash
                        }
                        updateStoneVersion={setStoneVersion}
                        updateMemoryVerification={setMemoryVerification}
                    />
                </>
            )}
        </div>
    );
}
