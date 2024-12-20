import React, { useState, useEffect } from "react";

// Define the type of the props expected
interface Trade {
  id: number;
  price: string;
  quantity: string;
  quoteQuantity: string;
  timestamp: number;
  isBuyerMaker: boolean;
}

const Trades = ({ market }: { market: string }) => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch trades data
  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.backpack.exchange/api/v1/trades?symbol=${market}&limit=50`
      );
      const data = await response.json();
      setTradeData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trades:", error);
      setLoading(false);
    }
  };

  // Use effect to fetch trades initially and then set up polling
  useEffect(() => {
    // Fetch data once when the component mounts
    fetchTrades();

    // Set up polling to fetch new data every 10 seconds
    const intervalId = setInterval(fetchTrades, 10000); // 10000 ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [market]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        {tradeData.length === 0 ? (
          <div>No trades available</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="grid grid-cols-3 p-2 text-slate-500">
                <th className="text-left">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {tradeData.map((trade, index) => {
                const currentPrice = parseFloat(trade.price);
                let priceColor = "";

                // Compare current price to the previous price
                if (index > 0) {
                  const previousPrice = parseFloat(tradeData[index - 1].price);
                  priceColor = currentPrice > previousPrice ? "text-green-500" : "text-red-500";
                }

                return (
                  <tr key={trade.id} className="grid grid-cols-3 p-2">
                    <td className={`text-left ${priceColor}`}>
                      {currentPrice.toFixed(2)}
                    </td>
                    <td className="text-center">{parseFloat(trade.quantity).toFixed(2)}</td>
                    <td className="text-right text-slate-400">
                      {new Date(trade.timestamp).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Trades;
