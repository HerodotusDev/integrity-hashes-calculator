"use client";

import { poseidonHashMany } from "micro-starknet";
import { ChangeEventHandler, useMemo, useState } from "react";
import Bootloaded from "../_components/bootloaded";
import Plain from "../_components/plain";

export default function ProgramHashPage() {
    const [jsonData, setJsonData] = useState<any>(null);
    const [program_hash, output, output_hash, is_bootloaded] = useMemo(() => {
        if (!jsonData) {
            return [null, null, null, null];
        }
        const page = jsonData["public_input"]["public_memory"];

        const program_end =
            jsonData["public_input"]["memory_segments"]["execution"][
                "begin_addr"
            ] - 2;
        const program = page.filter((x) => x["address"] < program_end);
        let program_hash;
        try {
            program_hash =
                "0x" +
                poseidonHashMany(
                    program.map((x) => BigInt(x["value"])),
                ).toString(16);
        } catch (e) {
            program_hash = null;
        }

        const output_start =
            jsonData["public_input"]["memory_segments"]["output"]["begin_addr"];
        const output_end =
            jsonData["public_input"]["memory_segments"]["output"]["stop_ptr"];
        const output = page
            .filter(
                (x) =>
                    x["address"] >= output_start && x["address"] < output_end,
            )
            .map((x) => x["value"]);
        let output_hash;
        try {
            output_hash =
                "0x" +
                poseidonHashMany(output.map((x) => BigInt(x))).toString(16);
        } catch (e) {
            output_hash = null;
        }

        const is_bootloaded =
            output[0] == "0x1" &&
            output[1] == "0x" + (output.length - 1).toString(16);

        return [program_hash, output, output_hash, is_bootloaded];
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
                } catch (e) {
                    setJsonData(null);
                }
            };
            reader.readAsText(file);
        } else {
            setJsonData(null);
        }
    };

    return (
        <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
            {is_bootloaded === true && program_hash !== null && (
                <>
                    <h2>Your proof looks like bootloaded</h2>
                    <Bootloaded
                        bootloaderHash={program_hash}
                        programHash={output[2]}
                        output={output.slice(3)}
                    />
                </>
            )}
            {is_bootloaded === false && program_hash !== null && (
                <>
                    <h2>Your proof is not bootloaded</h2>
                    <Plain programHash={program_hash} output={output} />
                </>
            )}
        </div>
    );
}
