import { GuideArticle } from "@/components/calculator/GuideArticle";
import { getCalculatorBySlug } from "@/config/calculators";
import { buildPageMetadata } from "@/lib/seo";

const info = getCalculatorBySlug("brokerage-fee");

export const metadata = buildPageMetadata(
  `${info.title} 가이드`,
  `${info.title}의 입력값, 계산 공식, 계산 예시, 결과 해석 방법과 자주 하는 실수를 정리한 부동산 주거비 가이드입니다.`,
  info.guidePath
);

export default function GuidePage() {
  return <GuideArticle info={info} />;
}
