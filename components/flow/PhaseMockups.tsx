"use client";

import { Check, Moon, Zap, Coffee, Rocket } from "lucide-react";
import TempoBar from "../TempoBar";

/** Small, dark UI mockups shown inside each flow-timeline panel. */

function MockShell({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  // Every phase mock is an identical app-window frame: same fixed width AND
  // height. The body flexes to fill, so content differences never change the
  // card's size — like real screens in the Cadence app.
  return (
    <div className="flex h-[340px] w-full max-w-md flex-col rounded-2xl border border-border bg-surface/80 p-1.5 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex shrink-0 items-center gap-1.5 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a32]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a32]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a32]" />
        <span className="ml-2 text-[11px] text-text-muted">{label}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center overflow-hidden rounded-xl bg-bg/60 p-5">
        {children}
      </div>
    </div>
  );
}

export function MorningMock() {
  const blocks = [
    { t: "09:00", n: "Inbox triage", w: "40%" },
    { t: "09:30", n: "Design review", w: "70%" },
    { t: "10:15", n: "Deep work — Auth flow", w: "100%", active: true },
  ];
  return (
    <MockShell label="cadence — today">
      <div className="mb-4 flex items-center gap-2 text-text-muted">
        <Moon className="h-4 w-4 text-violet" />
        <span className="text-xs">Morning · planning your tempo</span>
      </div>
      <div className="space-y-2.5">
        {blocks.map((b) => (
          <div
            key={b.t}
            className={`flex items-center gap-3 rounded-lg border p-2.5 ${
              b.active
                ? "border-accent/40 bg-accent/[0.06]"
                : "border-border bg-surface/60"
            }`}
          >
            <span className="w-10 text-[11px] tabular-nums text-text-muted">
              {b.t}
            </span>
            <div className="flex-1">
              <div className="mb-1 text-xs text-text-primary">{b.n}</div>
              <div className="h-1 rounded-full bg-surface-2">
                <div
                  className={`h-full rounded-full ${
                    b.active ? "bg-accent" : "bg-violet/60"
                  }`}
                  style={{ width: b.w }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </MockShell>
  );
}

export function DeepWorkMock() {
  return (
    <MockShell label="cadence — focus">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-xs text-text-primary">Flow state detected</span>
        </div>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          LIVE
        </span>
      </div>
      <div className="flex flex-col items-center py-3">
        <div className="font-display text-5xl font-semibold tabular-nums text-text-primary">
          52:14
        </div>
        <span className="mt-1 text-[11px] text-text-muted">
          Tempo Block · Auth flow
        </span>
        <TempoBar bars={24} className="mt-5 h-8 gap-[3px]" />
      </div>
    </MockShell>
  );
}

export function BreakMock() {
  return (
    <MockShell label="cadence — break">
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet/15">
          <Coffee className="h-5 w-5 text-violet" />
        </div>
        <div className="font-display text-2xl font-medium text-text-primary">
          Breathe. 5:00
        </div>
        <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-text-muted">
          Notifications are silenced. Cadence resumes the beat when you&rsquo;re
          ready — no pings, no guilt.
        </p>
        <div className="mt-4 flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-violet animate-heartbeat" />
          Silent mode active
        </div>
      </div>
    </MockShell>
  );
}

export function ShippedMock() {
  const rows = [
    "Auth flow — shipped",
    "Design review — done",
    "Inbox — cleared",
  ];
  return (
    <MockShell label="cadence — recap">
      <div className="mb-4 flex items-center gap-2">
        <Rocket className="h-4 w-4 text-accent" />
        <span className="text-xs text-text-primary">Today, in rhythm</span>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-surface/60 p-2.5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15">
              <Check className="h-3 w-3 text-accent" />
            </span>
            <span className="text-xs text-text-primary">{r}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-accent/[0.07] p-3">
        <span className="text-xs text-text-muted">Deep-work hours</span>
        <span className="font-display text-lg font-semibold text-accent">
          4h 12m
        </span>
      </div>
    </MockShell>
  );
}
