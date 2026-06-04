import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "면책고지",
  `${siteConfig.name} 계산 결과와 가이드 콘텐츠의 참고용 성격, 최신성 한계, 이용자 확인 의무를 안내합니다.`,
  "/disclaimer"
);

export default function DisclaimerPage() {
  const title = "면책고지";
  const description = "계산 결과와 가이드 콘텐츠를 실제 의사결정에 사용할 때 확인해야 할 한계와 주의사항입니다.";

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/disclaimer" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/disclaimer" }]} />
      <LegalPage
        eyebrow="면책 안내"
        title={title}
        description={description}
        sections={[
          {
            title: "1. 참고용 정보",
            body: "본 사이트의 계산 결과는 사용자가 입력한 값을 기준으로 산출한 참고용 정보이며, 실제 전세대출 조건, 월세 조건, 취득세, 청약 기준, 중개보수, 계약 조건과 다를 수 있습니다. 중요한 의사결정 전에는 금융기관, 공인중개사, 지방자치단체, 관계 기관의 최신 기준을 확인하시기 바랍니다."
          },
          {
            title: "2. 공식 판단 대체 불가",
            items: [
              "대출 가능 여부와 한도는 금융기관 심사 결과에 따릅니다.",
              "취득세와 지방교육세 등 세금 계산은 지방자치단체와 위택스 안내 기준에 따라 달라질 수 있습니다.",
              "청약가점, 전월세 전환, 중개보수, 주거비 비교 결과는 모집공고문, 계약 조건, 지역별 실무 기준에 따라 달라질 수 있습니다."
            ]
          },
          {
            title: "3. 최신성의 한계",
            items: [
              "법령, 금리, 세율, 청약 규정, 중개보수 기준은 수시로 변경될 수 있습니다.",
              "운영자는 콘텐츠의 정확성과 최신성을 높이기 위해 노력하지만 모든 변경을 즉시 반영한다고 보장할 수 없습니다.",
              "중요한 거래나 신고, 신청 전에는 반드시 관계 기관의 최신 자료를 확인해야 합니다."
            ]
          },
          {
            title: "4. 책임 제한",
            items: [
              "이용자가 계산 결과 또는 가이드 내용을 근거로 내린 의사결정과 그 결과에 대한 책임은 이용자에게 있습니다.",
              "운영자는 고의 또는 중대한 과실이 없는 한 서비스 이용으로 발생한 간접 손해, 기회 손실, 거래 손실에 대해 책임을 부담하지 않습니다."
            ]
          }
        ]}
      />
    </>
  );
}
