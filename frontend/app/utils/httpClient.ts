import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

const BASE_URL = "https://api.backpack.exchange/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
    const tickers = await getTickers();
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
    
    const response = await axios.get(`http://localhost:4000/api/v1/tickers`)
    return response.data
}

export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`http://localhost:4000/api/v1/depth?symbol=${market}`);
    return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`http://localhost:4000/api/v1/trades?symbol=${market}&limit=50`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    try {
        const response = await axios.get(`http://localhost:4000/api/v1/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
        console.log("API Response:", response.data); // Log the data
        const data: KLine[] = response.data;
        return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
    } catch (error) {
        console.error("Error fetching KLines:", error);
        throw error;
    }
}

export async function getMarkets(): Promise<string[]> {
    const response = await axios.get(`http://localhost:4000/markets`);
    return response.data;
}
