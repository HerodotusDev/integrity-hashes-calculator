import { poseidonHashMany } from "micro-starknet";

const hash = (input: string[]) => {
    try {
        return (
            "0x" + poseidonHashMany(input.map((x) => BigInt(x))).toString(16)
        );
    } catch (e) {
        return "-";
    }
};

function shorten(input: string) {
    if (input.length < 10) {
        return input;
    }
    return input.slice(0, 8) + "..." + input.slice(-8);
}

export { shorten };
export default hash;
