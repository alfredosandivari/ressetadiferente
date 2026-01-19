"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import type { Matcher } from "react-day-picker";

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// ✅ Parse "YYYY-MM-DD" como fecha LOCAL (no UTC)
function parseLocalDateFromISO(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // local time
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function PickupDatePicker({
  earliestDateStr,
  selectedDateStr,
  onChange,
  disableWeekdays = [],
}: {
  earliestDateStr: string; // "YYYY-MM-DD"
  selectedDateStr: string;
  onChange: (dateStr: string) => void;
  disableWeekdays?: number[]; // 0=Dom ... 6=Sáb
}) {
  const earliestParsed = parseLocalDateFromISO(earliestDateStr);
  const selectedParsed = parseLocalDateFromISO(selectedDateStr);

  const earliest = earliestParsed ? startOfDay(earliestParsed) : null;
  const selected = selectedParsed ? startOfDay(selectedParsed) : undefined;

  const disabledMatchers: Matcher[] = [];
  if (earliest) disabledMatchers.push({ before: earliest });
  if (disableWeekdays.length > 0) {
    disabledMatchers.push({ dayOfWeek: disableWeekdays as any });
  }

  const isDisabled = (d: Date) => {
    const x = startOfDay(d);
    if (earliest && x < earliest) return true;
    if (disableWeekdays.includes(x.getDay())) return true;
    return false;
  };

  return (
    <div className="relative z-10">
      <div className="rounded-xl border border-stone-200 p-3 bg-white shadow-sm pointer-events-auto">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (!d) return;
            if (isDisabled(d)) return;

            const picked = startOfDay(d);

            if (selected && isSameDay(picked, selected)) return;

            onChange(toISODate(picked));
          }}
          disabled={disabledMatchers}
          fixedWeeks
          showOutsideDays
        />

        {earliestDateStr && (
          <p className="mt-2 text-[14px] font-bold text-stone-500">
            Primer día disponible:{" "}
            <span className="font-medium">{earliestDateStr}</span>
          </p>
        )}
      </div>

      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 40px;
        }
        .rdp button {
          cursor: pointer;
        }
        .rdp-day_disabled,
        .rdp-day_disabled button {
          cursor: not-allowed !important;
          pointer-events: none !important;
          opacity: 0.35;
        }
      `}</style>
    </div>
  );
}
