import { useState, useEffect } from "react";
import { getDepth, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import Trades from "./Trades";  // Import the Trades component

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [asks, setAsks] = useState<[string, string][]>([]);
  const [price, setPrice] = useState<string>();
  const [view, setView] = useState("depth");  // State to track the active view

  useEffect(() => {
    SignalingManager.getInstance().registerCallback("depth", (data: any) => {
      console.log(data);

      setBids((originalBids) => {
        const bidsAfterUpdate = [...(originalBids || [])];
        for (let i = 0; i < bidsAfterUpdate.length; i++) {
          for (let j = 0; j < data.bids.length; j++) {
            if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
              bidsAfterUpdate[i][1] = data.bids[j][1];
              break;
            }
          }
        }
        return bidsAfterUpdate;
      });

      setAsks((originalAsks) => {
        const asksAfterUpdate = [...(originalAsks) || []];
        for (let i = 0; i < asksAfterUpdate.length; i++) {
          for (let j = 0; j < data.asks.length; j++) {
            if (asksAfterUpdate[i][0] === data.asks[j][0]) {
              asksAfterUpdate[i][1] = data.asks[j][1];
              break;
            }
          }
        }
        return asksAfterUpdate;
      });
    }, `DEPTH-${market}`);

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.200ms.${market}`],
    });
    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsks(d.asks);
    });

    getTicker(market).then((t) => setPrice(t.lastPrice));
    getTrades(market).then((t) => setPrice(t[0].price));

    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
    };
  }, [market]);

  return (
    <div>
      <MainHeader setView={setView} view={view} />  {/* Handle View Change */}
      {view === "depth" && (
          <>
          <ViewTableHeader />
          {asks && <AskTable asks={asks.filter((ask) => parseFloat(ask[1]) > 0)} />}
          <div className="h-2"></div>
          {price && <div className="text-center text-white">{price}</div>}
          <div className="h-3"></div>
          {bids && <BidTable bids={bids.filter((bids) => parseFloat(bids[1]) > 0)} />}
        </>
      )}
      {view === "trades" &&(
        <>
            <TradeHeader />
            <Trades market={market} />
        </>
      ) }  {/* Conditionally Render Trades */}
      <div className="mb-4"></div>
    </div>
  );
}

export default function ViewTableHeader() {
  return (
    <div className="grid grid-cols-3 text-sm">
      <div className="ml-2 text-left text-white">Price</div>
      <div className="text-center text-slate-500">Size</div>
      <div className="mr-2 text-right text-slate-500">Total</div>
    </div>
  );
}

export function TradeHeader() {
    return (
      <div className="grid grid-cols-3 text-sm text-slate-400 font-medium">
        <div className="ml-2 text-left">Price</div>
        <div className="text-center">Qty</div>
        <div className="mr-2 text-center">Time</div>
      </div>
    );
  }

  function MainHeader({ setView, view }: { setView: React.Dispatch<React.SetStateAction<string>>, view: string }) {
    return (
      <div className="p-2 ml-4">
        <div className="items-center justify-start flex-row flex space-x-2">
          {/* Book Tab */}
          <div
            className={`flex justify-center flex-col cursor-pointer py-1 text-sm font-medium outline-none h-[32px] px-3 ${
              view === "depth" 
                ? "rounded-lg bg-baseBackgroundL2" 
                : "hover:opacity-90"
            }`}
            onClick={() => setView("depth")}
          >
            Book
          </div>
  
          {/* Trades Tab */}
          <div
            className={`flex justify-center flex-col cursor-pointer py-1 text-sm font-medium outline-none h-[32px] px-3 ${
              view === "trades" 
                ? "rounded-lg bg-baseBackgroundL2" 
                : "hover:opacity-90 text-baseTextMedEmphasis"
            }`}
            onClick={() => setView("trades")}
          >
            Trades
          </div>
          <div className="border-b"></div>
        </div>
      </div>
    );
  }
  
