import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "FAQ" };

const FAQS: { category: string; question: string; answer: string }[] = [
  {
    category: "General",
    question: "What is Nexus Dispatch?",
    answer:
      "A multi-tenant dispatch and telemetry platform for cold-chain logistics — fleet dispatch, live temperature monitoring and alerting, and role-based access, with every customer's data isolated at the database layer.",
  },
  {
    category: "General",
    question: "Do I need a credit card to start a trial?",
    answer: "No. You can create a workspace and explore the product for 14 days with no card on file.",
  },
  {
    category: "Sensors & telematics",
    question: "What temperature range counts as a thermal excursion?",
    answer:
      "The default cold-chain band is 2–8°C, configurable per vehicle or per shipment. A reading within 0.5°C of either bound is flagged as a warning; outside the band is an excursion.",
  },
  {
    category: "Sensors & telematics",
    question: "How often does telemetry update?",
    answer: "Reefer sensors report on their own configured interval; the dashboard reflects each new reading as it arrives.",
  },
  {
    category: "Security",
    question: "How is my company's data kept separate from other customers?",
    answer:
      "Every table enforces row-level security in Postgres, scoped to your workspace's own ID carried in your session — not just filtered in the application code. One tenant's data is never visible to another's queries, even by mistake.",
  },
  {
    category: "Billing & trials",
    question: "What happens when my trial ends?",
    answer:
      "We'll email you before it ends. If your subscription lapses, your workspace moves to read-only: you can still see your history, but new shipments and edits are paused until billing is reconnected.",
  },
  {
    category: "Billing & trials",
    question: "Can I change plans later?",
    answer: "Yes — upgrade or downgrade from Billing & Tariffs in your workspace settings at any time.",
  },
];

const CATEGORIES = Array.from(new Set(FAQS.map((f) => f.category)));

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-margin py-margin-lg lg:py-20">
      <div className="text-center">
        <h1 className="text-headline-lg text-on-surface">Frequently asked questions</h1>
        <p className="mt-space-sm text-body-lg text-on-surface-variant">
          Can&apos;t find what you need? Reach us at{" "}
          <a href="mailto:support@nexusdispatch.com" className="text-action hover:underline">
            support@nexusdispatch.com
          </a>
          .
        </p>
      </div>

      <div className="mt-margin-lg space-y-margin">
        {CATEGORIES.map((category) => (
          <div key={category} className="space-y-space-md">
            <h2 className="text-title-md uppercase tracking-wide text-on-surface-variant">{category}</h2>
            <div className="space-y-space-sm">
              {FAQS.filter((f) => f.category === category).map((f) => (
                <Card key={f.question}>
                  <CardContent className="space-y-space-xs p-space-lg">
                    <p className="flex items-start gap-space-sm text-title-md text-on-surface">
                      <Icon name="help_outline" size={18} className="mt-0.5 shrink-0 text-action" />
                      {f.question}
                    </p>
                    <p className="pl-space-xl text-body-md text-on-surface-variant">{f.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
