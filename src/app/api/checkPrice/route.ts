import axios, { AxiosResponse } from "axios";
import { GATE_IO_API_URL } from "../../../config/gateio";

type Coin = {
  currency_pair: string;
  change_percentage: string | number;
  last_price?: string | null;
  volume?: string | null;
};

type ApiResponse = Coin[]; // Expected API response structure

export async function GET(): Promise<Response> {
  console.log("Fetching data from:", GATE_IO_API_URL);

  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(GATE_IO_API_URL);
    console.log("API Response:", response.data);

    if (!response.data || response.data.length === 0) {
      console.error("No data received from Gate.io");
      return new Response(JSON.stringify({ error: "No data received" }), { status: 500 });
    }

    const coins: Coin[] = response.data;

    // ✅ Ensure "last_price" and "volume" exist and change_percentage is a valid number
    const filteredTickers = coins
      .filter((coin) => {
        const change = parseFloat(String(coin.change_percentage));
        return !isNaN(change) && change <= -42;
      })
      .map((coin) => ({
        pair: coin.currency_pair,
        drop: `${coin.change_percentage}%`,
        lastPrice: coin.last_price ?? "N/A",
        volume: coin.volume ?? "N/A",
      }));

    console.log("Filtered Tickers:", filteredTickers);

    return new Response(
      JSON.stringify({ message: "Filtered tickers fetched", tickers: filteredTickers }),
      { status: 200 }
    );
  } catch (error) {
    console.error("API Fetch Error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch tickers", details: (error as Error).message }),
      { status: 500 }
    );
  }
}
