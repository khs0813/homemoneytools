import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "개인정보처리방침",
  `${siteConfig.name}의 개인정보 처리 기준, 자동 수집 정보, 광고 쿠키, 정보주체 권리 행사 방법을 안내합니다.`,
  "/privacy-policy"
);

export default function PrivacyPolicyPage() {
  const title = "개인정보처리방침";
  const description = `${siteConfig.name}은 계산기 입력값을 회원 데이터베이스에 저장하지 않으며 문의 접수와 서비스 운영에 필요한 최소한의 정보만 처리합니다.`;

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/privacy-policy" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/privacy-policy" }]} />
      <LegalPage
        eyebrow="Privacy"
        title={title}
        description={description}
        sections={[
          {
            title: "1. 처리하는 개인정보 항목",
            items: [
              "회원가입, 댓글, 결제 기능을 제공하지 않으며 계산기에 입력한 값은 별도 회원 데이터베이스에 저장하지 않습니다.",
              "문의 메일을 보내는 경우 회신을 위해 이메일 주소, 이름 또는 닉네임, 문의 내용이 처리될 수 있습니다.",
              "보안과 통계 목적 범위에서 IP 주소, 브라우저 정보, 접속 시각, 요청 URL, 쿠키 식별자 등 접속 기록이 자동 생성될 수 있습니다."
            ]
          },
          {
            title: "2. 개인정보 처리 목적",
            items: [
              "문의 접수와 답변 발송, 서비스 관련 안내를 위해 문의 정보를 처리합니다.",
              "비정상 접속 방지, 보안 사고 대응, 오류 분석, 서비스 품질 개선을 위해 접속 기록을 처리합니다.",
              "광고 게재 및 성과 측정을 위해 Google AdSense 등 제3자 광고 서비스가 쿠키 또는 유사 기술을 사용할 수 있습니다."
            ]
          },
          {
            title: "3. 보유 및 이용 기간",
            items: [
              "문의 정보는 처리 목적 달성 후 지체 없이 삭제하며 분쟁 대응이 필요한 경우 최대 3년간 보관할 수 있습니다.",
              "접속 기록은 보안 및 장애 대응 목적에 필요한 기간 동안 보관한 뒤 파기합니다.",
              "계산기 입력값은 저장하지 않으므로 서비스 제공 후 별도 보유하지 않습니다."
            ]
          },
          {
            title: "4. 쿠키와 광고 기술",
            items: [
              "쿠키는 이용 환경 유지, 보안, 통계, 광고 제공을 위해 사용될 수 있습니다.",
              "이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 기존 쿠키를 삭제할 수 있습니다.",
              "광고 쿠키의 상세 처리 방식은 각 광고 사업자의 정책과 광고 설정 페이지를 통해 확인할 수 있습니다."
            ]
          },
          {
            title: "5. 정보주체의 권리",
            items: [
              "이용자는 본인 개인정보의 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.",
              `권리 행사는 ${siteConfig.contactEmail}로 요청할 수 있으며 본인 확인 후 관련 법령에 따라 처리합니다.`,
              "개인정보 침해에 대한 상담이나 구제가 필요한 경우 관계 기관을 이용할 수 있습니다."
            ]
          }
        ]}
      />
    </>
  );
}
