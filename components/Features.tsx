"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Timer, Waves, VolumeX, type LucideIcon } from "lucide-react";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  copy: string;
}[] = [
  {
    icon: Timer,
    title: "Tempo Blocks",
    copy: "Time-boxed focus that adapts to your energy. Set the beat once and let the day keep time.",
  },
  {
    icon: Waves,
    title: "Flow State detection",
    copy: "Cadence senses when you've hit your stride and quietly protects it — extending blocks, holding pings.",
  },
  {
    icon: VolumeX,
    title: "Silent mode that stays silent",
    copy: "No badges. No buzz. No ‘quick question.’ Silence that actually holds until you resurface.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative px-5 py-20 sm:px-6 sm:py-28 md:py-36">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl sm:mb-16">
          <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-accent sm:mb-5 sm:text-sm">
            <span className="h-px w-8 bg-accent/50" />
            Features
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl">
            Built to keep your beat.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <MagneticCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MagneticCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Raw pointer position, normalized to [-0.5, 0.5] within the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const springCfg = { stiffness: 150, damping: 15, mass: 0.4 };
  const rotateX = useSpring(useMotionValue(0), springCfg);
  const rotateY = useSpring(useMotionValue(0), springCfg);
  const glowX = useSpring(px, { stiffness: 120, damping: 20 });
  const glowY = useSpring(py, { stiffness: 120, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
    rotateY.set(nx * 14); // tilt toward cursor horizontally
    rotateX.set(-ny * 14); // and vertically
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const glow = useMotionTemplate`radial-gradient(240px circle at ${glowX}px ${glowY}px, rgba(198,255,61,0.12), transparent 70%)`;

  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface/50 p-7 transition-colors hover:border-text-muted/30"
      >
        {/* Cursor-following glow */}
        <motion.div
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div
          style={{ transform: "translateZ(40px)" }}
          className="relative flex flex-col"
        >
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg/60 text-accent">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="font-display text-xl font-semibold text-text-primary">
            {feature.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {feature.copy}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
