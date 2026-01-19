"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string; description?: string };

export function PickerDropdown({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  disabled = false,
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) || null,
    [options, value]
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <label className="block font-medium text-stone-700 mb-1">{label}</label>

      {/* Hidden input para que FormData siga funcionando */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={[
          "w-full rounded-xl border border-stone-200 bg-white px-3 py-2",
          "text-left shadow-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-amber-400",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-stone-300",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className={`text-xs ${selected ? "text-stone-900" : "text-stone-500"}`}>
              {selected ? selected.label : placeholder}
            </div>
            {selected?.description ? (
              <div className="text-[11px] text-stone-500 truncate">
                {selected.description}
              </div>
            ) : null}
          </div>

          <span className="text-stone-400">▾</span>
        </div>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
          <div className="max-h-56 overflow-auto">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full px-3 py-2 text-left transition",
                    active ? "bg-amber-50" : "hover:bg-stone-50",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-stone-900">
                        {opt.label}
                      </div>
                      {opt.description ? (
                        <div className="text-[11px] text-stone-500">
                          {opt.description}
                        </div>
                      ) : null}
                    </div>
                    {active ? <span className="text-amber-600">✓</span> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
