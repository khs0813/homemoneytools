import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/components/content/GuidePage";
import { getGuideBySlug, guides } from "@/config/guides";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) {
    return buildPageMetadata("가이드", "가이드를 찾을 수 없습니다.", "/guides");
  }
  return buildPageMetadata(guide.title, guide.description, guide.path);
}

export default function GuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = guides.find((item) => item.slug === params.slug);
  if (!guide) notFound();
  return <GuidePage guide={getGuideBySlug(params.slug)} />;
}
