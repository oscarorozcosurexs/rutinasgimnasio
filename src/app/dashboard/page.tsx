"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type Workout = {
  id: number;
  name: string;
  exercises: Exercise[];
};

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 1,
    name: "Push Day",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 80 },
      { name: "Overhead Press", sets: 3, reps: 10, weight: 50 },
      { name: "Tricep Dips", sets: 3, reps: 12, weight: 0 },
    ],
  },
  {
    id: 2,
    name: "Cardio",
    exercises: [
      { name: "Treadmill Run", sets: 1, reps: 1, weight: 0 },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workouts = MOCK_WORKOUTS;

  return (
    <div className="flex flex-col flex-1 px-6 py-8 max-w-2xl mx-auto w-full gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View your logged workouts by date.
        </p>
      </div>

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
                setDate(d);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Workouts — {formatDate(date)}
        </h2>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Dumbbell className="size-8 opacity-40" />
              <p className="text-sm">No workouts logged for this date.</p>
            </CardContent>
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{workout.name}</CardTitle>
                <CardDescription>
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {workout.exercises.map((exercise) => (
                    <li
                      key={exercise.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-muted-foreground">
                        {exercise.sets} × {exercise.reps}
                        {exercise.weight > 0 ? ` @ ${exercise.weight} kg` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
