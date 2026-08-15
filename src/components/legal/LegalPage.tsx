import type { ReactNode } from "react";
import { AdFitInlineBanner } from "@/components/adfit/AdFitPageAds";
import { PageContainer } from "@/components/layout/PageContainer";
import { siteConfig } from "@/config/site";

type LegalSection = {
  title: string;
  body?: ReactNode;
  items?: ReactNode[];
};

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <PageContainer className="py-10 md:py-14">
      <article className="max-w-4xl">
        <p className="text-sm font-bold text-brand-emerald">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
        <dl className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-bold text-slate-950">최종 수정일</dt>
            <dd className="mt-1">{siteConfig.lastUpdated}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-950">문의</dt>
            <dd className="mt-1">
              <a className="font-semibold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </dd>
          </div>
        </dl>
        {children}
        <div className="mt-10 grid gap-8">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-black text-slate-950">{section.title}</h2>
              {section.body ? <div className="mt-4 text-base leading-7 text-slate-700">{section.body}</div> : null}
              {section.items ? (
                <ul className="mt-4 grid gap-3 text-base leading-7 text-slate-700">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
        <AdFitInlineBanner />
      </article>
    </PageContainer>
  );
}
