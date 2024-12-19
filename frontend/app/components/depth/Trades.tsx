import { getTrades } from "@/app/utils/httpClient";
import { useState, useEffect } from "react";
import TradeHeader from "../depth/Depth"

export default function Trades({ market }: { market: string }) {
  const [tradeData, setTradeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastTradedPrice, setLastTradedPrice] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await getTrades(market);
        setTradeData(data);
      } catch (error) {
        console.log("Error fetching the trades", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, [market]);

  if (loading) {
    return <div>Loading Trades...</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        {/* Table with headers once and values below */}
        {tradeData.length === 0 ? (
          <div>No trades available</div>
        ) : (
          <div className="overflow-y-auto">
            {/* Render TradeHeader */}
            {/* <TradeHeader /> */}
            {/* Table for displaying trades */}
            <table className="min-w-full">
              <tbody>
                {/* Displaying the trades */}
                {tradeData.map((trade) => (
                  <tr key={trade.id} className="grid grid-cols-3 p-2">
                    <td className="text-left">{trade.price}</td>
                    <td className="text-center">{trade.quantity}</td>
                    <td className="text-right text-slate-400">
                      {new Date(trade.timestamp).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
