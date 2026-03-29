"use client";

import { useState, useMemo } from "react";
import type { Event } from "@/components/events/EventsContent";

export interface CalendarState {
  year: number;
  month: number;
  daysInMonth: number;
  firstDayOfWeek: number;
  today: string;
  selectedDate: string | null;
  eventsByDate: Record<string, Event[]>;
  setSelectedDate: (date: string | null) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  monthLabel: string;
}

export function buildDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function useCalendar(events: Event[]): CalendarState {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const initialDate = useMemo(() => {
    if (events.length > 0) {
      const d = new Date(events[0].event_date + "T00:00:00");
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [events]);

  const [year, setYear] = useState(initialDate.year);
  const [month, setMonth] = useState(initialDate.month);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const event of events) {
      const key = event.event_date;
      if (!map[key]) map[key] = [];
      map[key].push(event);
    }
    return map;
  }, [events]);

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month]
  );

  const firstDayOfWeek = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month]
  );

  const monthLabel = useMemo(
    () =>
      new Date(year, month, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [year, month]
  );

  function prevMonth() {
    setSelectedDate(null);
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    setSelectedDate(null);
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return {
    year,
    month,
    daysInMonth,
    firstDayOfWeek,
    today,
    selectedDate,
    eventsByDate,
    setSelectedDate,
    prevMonth,
    nextMonth,
    monthLabel,
  };
}
