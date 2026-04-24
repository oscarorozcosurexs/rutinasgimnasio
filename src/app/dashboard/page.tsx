import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsByUserAndDate } from "@/data/workouts";
import { DatePicker } from "./_components/DatePicker";

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam
    ? new Date(`${dateParam}T00:00:00`)
    : new Date();

  const workouts = await getWorkoutsByUserAndDate(userId!, date);

  return (
    <div className="flex flex-col flex-1 px-6 py-8 max-w-2xl mx-auto w-full gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          View your logged workouts by date.
        </p>
      </div>

      <DatePicker date={date} />

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
                  {workout.workoutExercises.length} exercise{workout.workoutExercises.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2">
                  {workout.workoutExercises.map((we) => (
                    <li
                      key={we.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium">{we.exercise.name}</span>
                      <span className="text-muted-foreground">
                        {we.sets.length} set{we.sets.length !== 1 ? "s" : ""}
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
