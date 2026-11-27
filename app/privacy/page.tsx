import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Cadence collects when you join the waitlist, why, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      intro="Cadence is a concept product and portfolio project designed and built by Malith. The waitlist on this site is real, so this page explains exactly what happens to your email address if you join it."
    >
      <h2>What we collect</h2>
      <p>
        Only the email address you type into the waitlist form. We don&rsquo;t ask for
        your name, and the site doesn&rsquo;t use analytics, advertising trackers or
        cookies.
      </p>

      <h2>Why we collect it</h2>
      <p>
        To keep your place on the waitlist and, at most, send you a confirmation and
        one note if Cadence launches. Your address is never sold, shared for
        marketing, or added to any other list.
      </p>

      <h2>Who processes it</h2>
      <p>
        Emails are stored and sent with <a href="https://resend.com">Resend</a>, an
        email service based in the United States. Resend handles the address only to
        deliver these emails, under its own{" "}
        <a href="https://resend.com/legal/privacy-policy">privacy policy</a>. The site
        itself is hosted on Vercel, which may keep standard server logs (such as IP
        addresses) for security for a short time.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Until the waitlist closes, or until you ask us to delete it, whichever comes
        first.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>To be removed, simply reply to any email from us, or write to the address below.</li>
        <li>
          You can ask to see, correct or delete your address at any time by writing to{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Cadence%20waitlist%20data`}>
            {CONTACT_EMAIL}
          </a>
          . We&rsquo;ll reply within 30 days.
        </li>
      </ul>

      <h2>Changes</h2>
      <p>
        If this page changes in a way that matters, the date at the top will change
        too. We won&rsquo;t start using your address for anything new without asking.
      </p>
    </LegalPage>
  );
}
