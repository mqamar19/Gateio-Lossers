import axios from "axios";
import { GATE_IO_API_URL } from "../../../config/gateio";
import { sendEmail } from "../send-email/route";

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
        let alerts: any[] = [];

        coins.forEach((coin) => {
            let change = parseFloat(coin.change_percentage);

            // 🛠 Ensure change is a valid number before using it
            if (isNaN(change) || change === null || change === undefined) {
                console.warn(`Invalid change_percentage for ${coin.currency_pair}:`, coin.change_percentage);
                return; // Skip this coin
            }

            if (change <= -42) {
                alerts.push({
                    pair: coin.currency_pair,
                    drop: `${change}%`,
                    lastPrice: coin.last_price,
                    volume: coin.volume,
                });
            }
        });

        console.log("Alerts Generated:", alerts);

        if (alerts.length > 0) {
            await sendEmail("Gate.io Alert", JSON.stringify(alerts, null, 2));
        }

        return new Response(JSON.stringify({ message: "Check completed", alerts }), { status: 200 });
    } catch (error) {
        console.error("API Fetch Error:", error);
        return new Response(JSON.stringify({ error: "Failed to check prices" }), { status: 500 });
    }
}
