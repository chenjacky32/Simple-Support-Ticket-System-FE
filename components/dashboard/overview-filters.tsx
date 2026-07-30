import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { DateRange } from "react-day-picker"

interface OverviewFiltersProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function OverviewFilters({ date, setDate }: OverviewFiltersProps) {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-xs">
      <CardTitle>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Overview Statistics</h2>
        <CardDescription className="text-sm text-muted-foreground">Filter ticket aggregates by submission date</CardDescription>
      </CardTitle>
      <CardContent className="border-none p-0 m-0 shadow-none">
        <DatePickerWithRange date={date} setDate={setDate} className="w-64" />
      </CardContent>
    </Card>
  );
}
