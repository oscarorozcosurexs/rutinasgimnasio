"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"), 10);
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

export function DatePicker({ date }: { date: Date }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit gap-2">
          <CalendarIcon className="size-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (d) {
              router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
              router.refresh();
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
