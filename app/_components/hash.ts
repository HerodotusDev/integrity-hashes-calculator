import { poseidonHashMany } from "micro-starknet";

const hash = (input: string[]) => {
    try {
        return (
            "0x" + poseidonHashMany(input.map((x) => BigInt(x))).toString(16)
        );
    } catch {
        return "-";
    }
};

function shorten(input: string) {
    if (input.length <= 19) {
        return input;
    }
    return input.slice(0, 8) + "..." + input.slice(-8);
}

function stringToHex(input: string) {
    return "0x" + Buffer.from(input).toString("hex");
}

export { shorten, stringToHex };
export default hash;
