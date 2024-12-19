export const BidTable = ({ bids }: { bids: [string, string][] }) => {
    let currentTotal = 0;
    const relevantBids = bids.slice(0, 15);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [
        price,
        quantity,
        (currentTotal += Number(quantity)),
    ]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return (
        <div>
            {bidsWithTotal.map(([price, quantity, total]) => (
                <Bid
                    maxTotal={maxTotal}
                    total={total}
                    key={price}
                    price={price}
                    quantity={quantity}
                />
            ))}
        </div>
    );
};

function Bid({
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
                className="absolute top-0 left-0 h-full bg-[rgba(1,167,129,0.325)] transition-[width] duration-300 ease-in-out"
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

