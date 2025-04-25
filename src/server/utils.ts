import { auth } from "@clerk/nextjs/server";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

// Ensure user is authenticated
export const ensureAuth = async () => {
    const user = await auth();
    if (!user.userId) {
        throw new Error("Unauthorized");
    }
    return user;
};

// Utility to get the start and end of the month
export const getMonthStartEnd = (year: number, month: number) => {
    const monthStart = startOfMonth(new Date(year, month - 1));
    const monthEnd = endOfMonth(new Date(year, month - 1));
    return { monthStart, monthEnd };
};

// Utility to get the start and end of a day
export const getDayStartEnd = (date: Date) => {
    return {
        dayStart: startOfDay(date),
        dayEnd: endOfDay(date)
    };
};
