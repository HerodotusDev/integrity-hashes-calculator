import { cn } from "cn-func";

export default function Arrow({
    cols,
    bottom,
    className,
    colStart,
}: {
    cols: boolean[];
    bottom?: number;
    className?: string;
    colStart?: number;
}) {
    return (
        <div
            className={cn("grid w-full grid-cols-subgrid", className)}
            style={{
                gridColumn:
                    (colStart ? `${colStart} / ` : "") + `span ${cols.length}`,
            }}
        >
            {cols.map((c, i) => (
                <div key={i} className="flex w-full justify-center">
                    {c && <div className="h-10 w-0.5 bg-white" />}
                </div>
            ))}
            {cols.length >= 2 &&
                cols.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-0.5 bg-white",
                            i == 0 && "ml-auto w-1/2",
                            i == cols.length - 1 && "w-1/2",
                        )}
                    />
                ))}
            {bottom !== undefined && (
                <div
                    className="flex w-full flex-col items-center"
                    style={{ gridColumnStart: bottom }}
                >
                    <div className="absolute -translate-y-1/2 border border-white bg-black p-1">
                        poseidon_hash
                    </div>
                    <div className="h-16 w-0.5 bg-white" />
                </div>
            )}
        </div>
    );
}
