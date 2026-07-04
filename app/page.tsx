import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FlowTimeline from "@/components/FlowTimeline";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import WaitlistCTA from "@/components/WaitlistCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <FlowTimeline />
      <Features />
      <Pricing />
      <WaitlistCTA />
    </>
  );
}
