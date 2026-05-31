import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "이용약관",
  `${siteConfig.name} 계산기와 가이드 이용 조건, 이용자 책임, 서비스 변경 기준을 안내합니다.`,
  "/terms"
);

export default function TermsPage() {
  const title = "이용약관";
  const description = `${siteConfig.name} 웹사이트 이용 조건과 이용자 및 운영자의 기본 권리와 책임을 안내합니다.`;

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/terms" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/terms" }]} />
      <LegalPage
        eyebrow="Terms"
        title={title}
        description={description}
        sections={[
          {
            title: "1. 목적",
            body: "본 약관은 이용자가 부동산·주거비 계산기와 가이드 콘텐츠를 이용할 때 필요한 기본 사항을 정합니다."
          },
          {
            title: "2. 서비스의 성격",
            items: [
              "본 서비스는 전세대출 이자, 월세와 전세 비교, DSR, 취득세, 중개보수, 월세 환산, 청약 가점 등에 관한 참고용 계산 결과와 설명을 제공합니다.",
              "계산 결과는 이용자가 입력한 값과 공개된 기준을 바탕으로 산출한 추정치이며, 금융·세무·법률 자문이나 공공기관의 공식 판단을 대체하지 않습니다.",
              "서비스는 회원가입 없이 무료로 제공되며, 운영 상황에 따라 일부 기능이 변경, 중단 또는 종료될 수 있습니다."
            ]
          },
          {
            title: "3. 이용자의 책임",
            items: [
              "이용자는 본인이 입력한 값의 정확성을 직접 확인해야 합니다.",
              "중요한 계약, 대출, 세금 신고, 청약 신청 등 실제 의사결정 전에는 금융기관, 세무사, 공인중개사, 공공기관 등 관련 전문가와 최신 기준을 확인해야 합니다.",
              "이용자는 서비스의 정상 운영을 방해하거나 자동화된 과도한 요청, 보안 우회, 콘텐츠 무단 복제 등 부정한 방식으로 서비스를 이용할 수 없습니다."
            ]
          },
          {
            title: "4. 콘텐츠와 지식재산권",
            items: [
              "웹사이트의 계산 로직, 설명 문구, 화면 구성 등 콘텐츠에 대한 권리는 운영자 또는 정당한 권리자에게 있습니다.",
              "개인적 참고 목적의 링크 공유는 가능하지만, 콘텐츠를 무단으로 복제, 배포, 상업적으로 재이용하는 행위는 제한될 수 있습니다."
            ]
          },
          {
            title: "5. 광고와 외부 링크",
            items: [
              "본 서비스에는 광고 또는 외부 사이트로 이동하는 링크가 포함될 수 있습니다.",
              "외부 사이트의 콘텐츠, 개인정보 처리, 거래 조건은 해당 사이트의 정책에 따르며 운영자가 이를 보증하지 않습니다."
            ]
          },
          {
            title: "6. 약관 변경",
            items: [
              "운영자는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 이 페이지에 게시한 때부터 적용됩니다.",
              `약관 관련 문의는 ${siteConfig.contactEmail}로 보낼 수 있습니다.`
            ]
          }
        ]}
      />
    </>
  );
}
