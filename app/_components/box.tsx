import { cn } from "cn-func";
import { shorten } from "./hash";
import { showToast } from "@/app/_utils/toast";

type Props = {
    values: string[];
    topText?: string;
    bottomText?: string[];
    above?: React.ReactNode[];
    below?: React.ReactNode[];
    className?: string;
    onUpdate?: (i: number, s: string) => void;
    root?: boolean | number;
    colStart?: number;
    colShift?: number;
    inputSelect?: Record<number, [string, string][]>;
};

export default function Box({
    values,
    above,
    below,
    className,
    root,
    onUpdate,
    bottomText,
    topText,
    colStart,
    colShift = 1,
    inputSelect,
}: Props) {
    return (
        <div
            className={cn("relative grid", className)}
            style={{
                gridTemplateColumns:
                    root !== false && root !== undefined
                        ? `repeat(${typeof root == "number" ? root : values.length}, 1fr)`
                        : "subgrid",
                gridColumn: `${colStart ?? 1} / span ${values.length}`,
            }}
        >
            {topText && (
                <div className="absolute bottom-full left-1/2 mb-0.5 w-max -translate-x-1/2 bg-black text-center text-white">
                    {topText}
                </div>
            )}
            {above}
            {values.map((value, index) => (
                <div
                    key={index}
                    style={{
                        gridColumn: `${index + colShift} / span 1`,
                    }}
                    className={cn(
                        "border-while relative border text-center",
                        index == 0 && "rounded-l-lg",
                        index == values.length - 1 && "rounded-r-lg",
                    )}
                >
                    {onUpdate ? (
                        inputSelect?.[index] ? (
                            <select
                                className="w-full min-w-12 bg-transparent p-2 text-center text-white"
                                value={value}
                                onChange={(e) =>
                                    onUpdate(index, e.target.value)
                                }
                            >
                                {inputSelect[index].map(([value, text]) => (
                                    <option key={value} value={value}>
                                        {text}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                className="w-full min-w-12 bg-transparent p-2 text-center text-white"
                                value={value}
                                onChange={(e) =>
                                    onUpdate(index, e.target.value)
                                }
                            />
                        )
                    ) : (
                        // <input className="bg-transparent text-white/70 min-w-4 w-auto" value={value} readOnly />
                        <button
                            className="p-2 opacity-70"
                            onClick={(e) => {
                                navigator.clipboard.writeText(value);
                                showToast("Copied!", e.clientX, e.clientY);
                            }}
                        >
                            {shorten(value)}
                        </button>
                    )}
                    {bottomText?.[index] !== undefined && (
                        <div className="absolute top-full mt-1 w-full bg-black p-1 text-sm">
                            {bottomText[index]}
                        </div>
                    )}
                </div>
            ))}
            {below}
        </div>
    );
}
