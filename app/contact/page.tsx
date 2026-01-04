"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Section";

function ContactContent() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState("");

  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    if (subjectParam) {
      setSubject(decodeURIComponent(subjectParam));
    }
  }, [searchParams]);

  return (
    <Section title="Contact" eyebrow="Get in Touch">
      <div className="max-w-2xl prose-content">
        <p className="mb-8">
          Get in touch with IC-FOODS. We welcome inquiries about partnerships,
          collaborations, and opportunities to work together.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-primary mb-3">
              General Inquiries
            </h2>
            <p>
              <a
                href={`mailto:info@ic-foods.org${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
              >
                info@ic-foods.org
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-3">
              Partnerships
            </h2>
            <p>
              <a
                href={`mailto:partnerships@ic-foods.org${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
              >
                partnerships@ic-foods.org
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-3">Media</h2>
            <p>
              <a
                href={`mailto:media@ic-foods.org${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
              >
                media@ic-foods.org
              </a>
            </p>
          </div>

          {subject && (
            <div className="p-4 bg-surface-raised rounded-lg border border-subtle-border">
              <p className="text-sm text-muted-text">
                <strong>Suggested subject:</strong> {subject}
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <Section title="Contact" eyebrow="Get in Touch">
          <div className="max-w-2xl prose-content">
            <p className="mb-8">
              Get in touch with IC-FOODS. We welcome inquiries about
              partnerships, collaborations, and opportunities to work together.
            </p>
          </div>
        </Section>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
