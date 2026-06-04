import { LegalPage } from "@/components/legal/LegalPage";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "사이트 소개",
  "집계산의 운영 목적, 계산 기준 관리 방식, 오류 제보 방법, 광고 운영 원칙, 면책 범위를 안내합니다.",
  "/about"
);

export default function AboutPage() {
  const title = "사이트 소개";
  const description = "집계산은 전세·월세·매매·대출·청약 같은 주거비 의사결정을 돕기 위해 계산과 해석을 함께 제공하는 정보 서비스입니다.";

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/about" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/about" }]} />
      <LegalPage
        eyebrow="사이트 소개"
        title={title}
        description={description}
        sections={[
          {
            title: "운영 목적",
            items: [
              "전세, 월세, 매매, 대출, 청약처럼 집과 관련된 비용 판단을 조금 더 명확하게 돕는 것이 목적입니다.",
              "계산 결과만 보여주는 것이 아니라 월 부담액, 총비용, 위험 구간, 실제 사례, 공식 참고 출처까지 함께 제공해 의사결정 맥락을 설명하려고 합니다."
            ]
          },
          {
            title: "계산 기준 관리 방식",
            items: [
              "각 계산기 페이지에는 기준일과 참고 출처를 함께 표시합니다.",
              "중개보수, 취득세, DSR, 청약가점처럼 제도 기준이 중요한 항목은 공식 기관 자료를 우선 참고합니다.",
              "법령, 금융규제, 요율이 바뀔 수 있으므로 중요한 결정 전에는 반드시 최신 공식 기준을 다시 확인해야 합니다."
            ]
          },
          {
            title: "오류 제보 방법",
            items: [
              "계산 결과나 설명 문구에서 오류를 발견하면 문의 페이지 또는 이메일로 알려주시면 확인 후 수정합니다.",
              "오류 제보 시 페이지 주소, 입력값, 기대한 결과를 함께 보내주면 검토가 훨씬 빠릅니다."
            ]
          },
          {
            title: "광고 운영 원칙",
            items: [
              "콘텐츠보다 광고가 먼저 보이거나 사용을 방해하는 배치는 지양합니다.",
              "자동 리디렉션, 빈 광고 박스, 과도한 팝업처럼 사용자 경험을 해치는 요소는 두지 않는 방향을 원칙으로 합니다."
            ]
          },
          {
            title: "면책 설명",
            items: [
              "본 사이트는 금융·세무·법률 자문 서비스를 제공하지 않습니다.",
              "계산 결과와 글은 참고용 정보이며 실제 세금, 대출 심사, 청약 결과, 중개보수, 계약 조건은 개인 상황과 최신 제도에 따라 달라질 수 있습니다.",
              "중요한 의사결정 전에는 금융기관, 공인중개사, 지방자치단체, 관계 기관의 최신 기준을 확인하시기 바랍니다."
            ]
          }
        ]}
      />
    </>
  );
}
