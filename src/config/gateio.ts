import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    try {
        const response = await axios.get("https://api.gateio.ws/api/v4/spot/tickers");

        return NextResponse.json({ alerts: response.data });
    } catch (error) {
        console.error("API Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}

const GATE_IO_API_URL = "https://api.gateio.ws/api/v4/spot/tickers";
const GATE_IO_API_KEY = process.env.GATE_IO_API_KEY as string;
const GATE_IO_SECRET = process.env.GATE_IO_SECRET as string;

export { GATE_IO_API_URL, GATE_IO_API_KEY, GATE_IO_SECRET };

