export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    relevantAsks.reverse();
    const asksWithTotal: [string, string, number][] = [];
    for (let i = relevantAsks.length - 1; i >= 0; i--) {
        const [price, quantity] = relevantAsks[i];
        asksWithTotal.push([price, quantity, (currentTotal += Number(quantity))]);
    }
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return (
        <div>
            {asksWithTotal.map(([price, quantity, total]) => (
                <Ask
                    maxTotal={maxTotal}
                    key={price}
                    price={price}
                    quantity={quantity}
                    total={total}
                />
            ))}
        </div>
    );
};

function Ask({
    price,
    quantity,
    total,
    maxTotal,
}: {
    price: string;
    quantity: string;
    total: number;
    maxTotal: number;
}) {
    return (
        <div className="relative w-full overflow-hidden bg-transparent">
            <div
                className="absolute top-0 left-0 h-full bg-[rgba(228,75,68,0.325)] transition-[width] duration-300 ease-in-out"
                style={{
                    width: `${(100 * total) / maxTotal}%`,
                }}
            ></div>
            <div className="relative grid grid-cols-3 w-full text-xs">
                <div className="ml-2 text-left">{price}</div>
                <div className="text-center">{quantity}</div>
                <div className="mr-2 text-right">{total.toFixed(2)}</div>
            </div>
        </div>
    );
}

