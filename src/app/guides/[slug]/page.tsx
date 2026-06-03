import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/components/content/GuidePage";
import { getGuideBySlug, guides } from "@/config/guides";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) {
    return buildPageMetadata("가이드", "가이드를 찾을 수 없습니다.", "/guides");
  }
  return buildPageMetadata(guide.title, guide.description, guide.path);
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <GuidePage guide={getGuideBySlug(slug)} />;
}
