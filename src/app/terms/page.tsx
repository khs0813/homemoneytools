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
        eyebrow="이용안내"
        title={title}
        description={description}
        sections={[
          {
            title: "1. 목적",
            body: "본 약관은 이용자가 주거비 계산기와 가이드 콘텐츠를 이용할 때 필요한 기본 사항을 정합니다."
          },
          {
            title: "2. 서비스의 성격",
            items: [
              "본 서비스는 전세대출 이자, 월세 vs 전세 비교, DSR, 취득세, 중개보수, 전월세 전환, 청약가점 등 주거비 의사결정에 관한 참고용 계산 결과와 설명형 콘텐츠를 제공합니다.",
              "계산 결과는 입력값과 공개 기준을 바탕으로 산출한 추정치이며, 금융·세무·법률 자문이나 공공기관의 공식 판단을 대체하지 않습니다.",
              "서비스는 무료로 제공되며 운영 상황에 따라 일부 기능이 변경, 중단 또는 종료될 수 있습니다."
            ]
          },
          {
            title: "3. 이용자의 책임",
            items: [
              "이용자는 본인이 입력한 값의 정확성을 직접 확인해야 합니다.",
              "중요한 전세계약, 월세계약, 매매계약, 대출 실행, 청약 신청, 취득세 신고 전에는 반드시 금융기관, 공인중개사, 지방자치단체, 관계 기관의 최신 기준을 확인해야 합니다.",
              "자동화된 과도한 요청, 보안 우회, 콘텐츠 무단 복제 등 정상 운영을 방해하는 행위는 허용되지 않습니다."
            ]
          },
          {
            title: "4. 콘텐츠와 지식재산권",
            items: [
              "계산 로직, 설명 문구, 화면 구성 등 콘텐츠에 대한 권리는 운영자 또는 정당한 권리자에게 있습니다.",
              "개인적 참고 목적의 링크 공유는 가능하지만 콘텐츠를 무단으로 복제, 배포, 상업적으로 재이용하는 행위는 제한될 수 있습니다."
            ]
          },
          {
            title: "5. 광고와 외부 링크",
            items: [
              "본 서비스에는 광고 또는 외부 사이트로 이동하는 링크가 포함될 수 있습니다.",
              "외부 사이트의 콘텐츠, 개인정보 처리, 거래 조건은 해당 사이트의 정책에 따릅니다."
            ]
          }
        ]}
      />
    </>
  );
}
