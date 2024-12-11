import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager | null>(null);

  const init = async () => {
    let klineData: KLine[] = [];

    try {
      console.log("Fetching KLine data for market:", market);
      klineData = await getKlines(
        market,
        "1h",
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), // 7 days ago
        Math.floor(new Date().getTime() / 1000) // current time
      );
      console.log("KLine data fetched:", klineData);
    } catch (e) {
      console.error("Error fetching KLine data:", e);
      return;
    }

    if (!chartRef.current) {
      console.error("chartRef is not initialized or is null.");
      return;
    }

    if (chartManagerRef.current) {
      console.log("Destroying existing ChartManager instance.");
      chartManagerRef.current.destroy();
    }

    const transformedData = [
      ...klineData?.map((x) => ({
        close: parseFloat(x.close),
        high: parseFloat(x.high),
        low: parseFloat(x.low),
        open: parseFloat(x.open),
        timestamp: new Date(x.end), // Ensure `end` is a valid timestamp
      })),
    ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [];

    console.log("Transformed KLine data for chart:", transformedData);

    if (transformedData.length > 0) {
      const chartManager = new ChartManager(chartRef.current, transformedData, {
        background: "#0e0f14",
        color: "white",
      });
      chartManagerRef.current = chartManager;
      console.log("ChartManager initialized successfully.");
    } else {
      console.error("Transformed data is empty. ChartManager not initialized.");
    }
  };

  useEffect(() => {
    console.log("TradeView useEffect triggered. Market:", market);
    init();

    return () => {
      if (chartManagerRef.current) {
        console.log("Cleaning up ChartManager instance.");
        chartManagerRef.current.destroy();
        chartManagerRef.current = null;
      }
    };
  }, [market]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
    </>
  );
}
