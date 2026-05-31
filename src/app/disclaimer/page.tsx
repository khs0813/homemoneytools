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
        eyebrow="Notice"
        title={title}
        description={description}
        sections={[
          {
            title: "1. 참고용 정보",
            body: "본 웹사이트의 계산 결과와 가이드 콘텐츠는 일반적인 정보 제공을 위한 참고 자료입니다. 이용자의 개별 계약 조건, 지역, 자산 상태, 금융기관 심사 기준, 법령 개정 여부에 따라 실제 결과와 달라질 수 있습니다."
          },
          {
            title: "2. 공식 판단 대체 불가",
            items: [
              "대출 가능 여부와 한도는 금융기관 심사 결과에 따릅니다.",
              "취득세, 중개보수, 청약 가점 등은 관련 법령, 지방자치단체, 한국부동산원, 국세청, 금융기관 등 공식 기준을 확인해야 합니다.",
              "본 서비스는 세무, 법률, 금융, 부동산 중개 자문을 제공하지 않습니다."
            ]
          },
          {
            title: "3. 최신성의 한계",
            items: [
              "공개 자료와 법령 기준은 수시로 변경될 수 있습니다.",
              "운영자는 콘텐츠의 정확성과 최신성을 높이기 위해 노력하지만, 모든 변경 사항의 즉시 반영을 보장하지 않습니다.",
              "중요한 거래나 신고 전에는 반드시 관계 기관의 최신 자료를 확인해야 합니다."
            ]
          },
          {
            title: "4. 책임 제한",
            items: [
              "이용자가 계산 결과 또는 콘텐츠를 근거로 내린 의사결정과 그 결과에 대한 책임은 이용자에게 있습니다.",
              "운영자는 고의 또는 중대한 과실이 없는 한 서비스 이용으로 발생한 간접 손해, 기회 손실, 거래 손실에 대해 책임을 부담하지 않습니다."
            ]
          },
          {
            title: "5. 오류 제보",
            items: [
              `계산 기준이나 콘텐츠 오류를 발견한 경우 ${siteConfig.contactEmail}로 알려주시면 확인 후 필요한 범위에서 수정합니다.`
            ]
          }
        ]}
      />
    </>
  );
}
