import type { FAQ } from "@/config/calculators";
import { safeJsonStringify } from "@/lib/json-ld";

export function FaqSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-950">자주 묻는 질문</h2>
      <div className="mt-5 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-2xl bg-slate-50 p-4">
            <summary className="cursor-pointer font-semibold text-slate-900">{faq.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FaqJsonLd({ faqs }: { faqs: FAQ[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }} />;
}
