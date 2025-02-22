import axios from "axios";
import { GATE_IO_API_URL } from "../../../config/gateio";

export async function GET(): Promise<Response> {
    console.log("Fetching data from:", GATE_IO_API_URL);

    try {
        const response = await axios.get(GATE_IO_API_URL);
        console.log("API Response:", response.data);

        if (!response.data || response.data.length === 0) {
            console.error("No data received from Gate.io");
            return new Response(JSON.stringify({ error: "No data received" }), { status: 500 });
        }

        const coins: any[] = response.data;

        // ✅ Ensure "last_price" and "volume" exist
        const filteredTickers = coins
            .filter((coin) => parseFloat(coin.change_percentage) <= -42)
            .map((coin) => ({
                pair: coin.currency_pair,
                drop: `${coin.change_percentage}%`,
                lastPrice: coin.last_price ?? "N/A",
                volume: coin.volume ?? "N/A",
            }));

        console.log("Filtered Tickers:", filteredTickers);

        return new Response(JSON.stringify({ message: "Filtered tickers fetched", tickers: filteredTickers }), { status: 200 });
    } catch (error) {
        console.error("API Fetch Error:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch tickers" }), { status: 500 });
    }
}
