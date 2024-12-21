import { useState, useEffect } from "react";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Trade } from "@/app/utils/types";
import { getTrades } from "@/app/utils/httpClient";

export function Trades({ market }: { market: string }) {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial trades for the market
    getTrades(market).then((data) => {
      // Sort the fetched trades by timestamp in descending order and limit to the latest 20 trades
      const sortedData = data.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
      setTradeData(sortedData);
      setLoading(false);
    });

    // Register the callback for "trade" messages
    const tradeCallback = (newTrade: Trade) => {
      setTradeData((prevTradeData) => {
        const updatedTrades = [newTrade, ...prevTradeData];
        // Sort by timestamp in descending order and limit to the latest 20 trades
        return updatedTrades
          .sort((a, b) => b.timestamp - a.timestamp) 
          .slice(0, 20); // Keep only the latest 20 trades
      });
    };

    SignalingManager.getInstance().registerCallback(
      "trade",
      tradeCallback,
      `TRADE-${market}`
    );

    // Subscribe to trade events for the given market
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`trade.${market}`],
    });

    // Cleanup function
    return () => {
      SignalingManager.getInstance().deRegisterCallback("trade", `TRADE-${market}`);
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`trade.${market}`],
      });
    };
  }, [market]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-b-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-800 scrollbar-thumb-rounded-md scrollbar-transition duration-500 ease-in-out hover:scrollbar-thumb-gray-600">
        {tradeData.length === 0 ? (
          <div>No trades available</div>
        ) : (
          <table className="min-w-full table-auto">            
            <tbody>
              {tradeData.map((trade, index) => {
                const currentPrice = Number(trade.price);
                const previousPrice = index < tradeData.length - 1
                  ? Number(tradeData[index + 1]?.price)
                  : currentPrice;

                // Price comparison for color logic: Green for >= and Red for <
                const priceColor =
                  currentPrice >= previousPrice ? "text-green-500" : "text-red-500";

                return (
                  <tr key={trade.id} className="">
                    <td className={`text-left ${priceColor}`}>{currentPrice.toFixed(2)}</td>
                    <td className="text-center">{Number(trade.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

