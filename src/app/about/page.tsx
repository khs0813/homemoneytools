import { LegalPage } from "@/components/legal/LegalPage";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "사이트 소개",
  "Home Money Calculator가 어떤 계산기와 가이드를 제공하는지, 어떤 원칙으로 콘텐츠를 운영하는지 소개합니다.",
  "/about"
);

export default function AboutPage() {
  const title = "사이트 소개";
  const description = "실수령액, 대출이자, 세금, 생활비, 공과금, 부동산 비용을 설명형 콘텐츠와 함께 제공하는 계산기 사이트입니다.";

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/about" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/about" }]} />
      <LegalPage
        eyebrow="About"
        title={title}
        description={description}
        sections={[
          {
            title: "무엇을 제공하나요",
            items: [
              "실수령액, 대출이자, 퇴직금, 배당금, 환율, 해외주식 양도세, 전기요금, 에어컨 전기세, 자동차 유지비, 월 생활비 등 핵심 생활 금융 계산기",
              "각 계산기의 공식, 예시, 결과 해석 방법, 자주 하는 실수, FAQ를 포함한 설명형 계산기 페이지",
              "사용자가 실제 검색하는 질문을 바탕으로 작성한 정보성 가이드 콘텐츠"
            ]
          },
          {
            title: "운영 원칙",
            items: [
              "계산 결과만 보여주는 얇은 페이지보다 계산 맥락과 해석 방법을 함께 제공하는 콘텐츠 중심 구성을 지향합니다.",
              "계산 결과는 참고용으로 제공하며, 세금·대출·급여·공과금 등 중요한 의사결정은 공식 기준과 전문가 확인을 전제로 합니다.",
              "입력값을 회원 데이터베이스에 저장하지 않는 구조를 유지해 빠른 사용성과 프라이버시를 우선합니다."
            ]
          },
          {
            title: "누가 사용하면 좋은가요",
            items: [
              "이직이나 연봉 협상 전에 월 실수령을 확인하려는 직장인",
              "대출 상환부담, 생활비, 공과금, 차량 유지비를 현실적으로 점검하려는 가계 사용자",
              "배당금, 환율, 해외주식 세금처럼 원화 기준 체감 수익을 보고 싶은 투자자",
              "전세·월세·취득세·청약 같은 주거비용도 함께 비교하려는 사용자"
            ]
          }
        ]}
      />
    </>
  );
}
