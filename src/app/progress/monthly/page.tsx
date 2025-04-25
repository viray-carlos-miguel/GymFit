// src/app/progress/monthly/page.tsx
import { getMonthlyProgress } from "~/server/actions/progress";
import MonthlyReportView from "./MonthlyReportView";

export default async function MonthlyReportPage({
    searchParams,
}: {
    searchParams: { year?: string; month?: string };
}) {
    const currentDate = new Date();
    const year = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear();
    const month = searchParams.month ? parseInt(searchParams.month) : currentDate.getMonth() + 1;

    const data = await getMonthlyProgress(year, month);

    return <MonthlyReportView initialData={data} year={year} month={month} />;
}