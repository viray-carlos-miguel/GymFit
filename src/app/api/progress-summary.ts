import { NextApiRequest, NextApiResponse } from "next";
import { getMonthlyProgressSummary } from "~/server/queries";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { year, month } = req.query;

    // Check if year and month are provided
    if (!year || !month) {
        return res.status(400).json({ error: "Year and month are required" });
    }

    try {
        // Get the summary from the server-side query
        const summary = await getMonthlyProgressSummary(Number(year), Number(month));

        // Respond with the summary in JSON format
        return res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching progress data:", error);

        // Return a server error if something goes wrong
        return res.status(500).json({ error: "Internal server error" });
    }
}
