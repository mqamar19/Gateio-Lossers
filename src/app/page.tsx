"use client";
import { useState, useEffect } from "react";

type Ticker = {
  pair: string;
  drop: string;
  lastPrice: string;
  volume: string;
};

export default function TickerTable() {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  const fetchTickers = async () => {
    try {
      const response = await fetch("/api/checkPrice");
      const data = await response.json();
      console.log("API Response:", data); // ✅ Debugging
      setTickers(data.tickers || []);
    } catch (error) {
      console.error("Error fetching tickers:", error);
    }
  };

  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">🚀 Gate.io Tickers (-52% Drop)</h1>

      <div className="w-full max-w-lg bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Biggest Losers (-42% or More):</h2>
        <table className="w-full border-collapse border border-gray-600 text-sm">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-2 py-1">Pair</th>
              <th className="border border-gray-600 px-2 py-1">Drop</th>
              <th className="border border-gray-600 px-2 py-1">Last Price</th>
              <th className="border border-gray-600 px-2 py-1">Volume</th>
            </tr>
          </thead>
          <tbody>
            {tickers.length > 0 ? (
              tickers.map((ticker, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-600 px-2 py-1">{ticker.pair}</td>
                  <td className="border border-gray-600 px-2 py-1 text-red-500">{ticker.drop}</td>
                  <td className="border border-gray-600 px-2 py-1">{ticker.lastPrice ?? "N/A"}</td>
                  <td className="border border-gray-600 px-2 py-1">{ticker.volume ?? "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-2">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
