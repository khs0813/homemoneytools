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
  const description = `${siteConfig.name}은 계산기 이용에 필요한 최소한의 정보만 처리하며, 회원가입이나 입력값 저장 기능을 제공하지 않습니다.`;

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
              "회원가입, 댓글, 결제 기능을 제공하지 않으며 이용자가 계산기에 입력한 금액, 금리, 기간 등 계산 입력값을 별도 데이터베이스에 저장하지 않습니다.",
              "문의 메일을 보내는 경우 회신을 위해 이메일 주소, 이름 또는 닉네임, 문의 내용이 처리될 수 있습니다.",
              "서비스 보안, 장애 대응, 통계 분석 과정에서 IP 주소, 브라우저 정보, 접속 일시, 요청 URL, 쿠키 식별자 등 접속 기록이 자동으로 생성될 수 있습니다."
            ]
          },
          {
            title: "2. 개인정보 처리 목적",
            items: [
              "문의 접수, 답변 발송, 서비스 이용 관련 안내를 위해 문의 정보를 처리합니다.",
              "비정상 접속 방지, 보안 사고 대응, 오류 분석, 서비스 품질 개선을 위해 접속 기록을 처리합니다.",
              "광고 게재 및 성과 측정을 위해 Google AdSense 등 제3자 광고 서비스가 쿠키 또는 유사 기술을 사용할 수 있습니다."
            ]
          },
          {
            title: "3. 보유 및 이용 기간",
            items: [
              "문의 정보는 처리 목적 달성 후 지체 없이 삭제하며, 분쟁 대응이 필요한 경우 접수일로부터 최대 3년간 보관할 수 있습니다.",
              "접속 기록은 보안 및 장애 대응 목적에 필요한 기간 동안 보관한 뒤 파기합니다. 관계 법령에 별도 보관 의무가 있는 경우 해당 기간을 따릅니다.",
              "계산기 입력값은 저장하지 않으므로 서비스 제공 후 별도 보유하지 않습니다."
            ]
          },
          {
            title: "4. 제3자 제공 및 처리 위탁",
            items: [
              "법령에 근거가 있거나 이용자 동의가 있는 경우를 제외하고 개인정보를 제3자에게 판매하거나 제공하지 않습니다.",
              "웹사이트 호스팅, 이메일 수신, 보안·분석, 광고 제공 과정에서 해당 기능 제공업체가 필요한 범위의 정보를 처리할 수 있습니다.",
              "Google 등 광고 사업자는 자체 정책에 따라 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정 또는 광고 설정에서 맞춤형 광고를 제한할 수 있습니다."
            ]
          },
          {
            title: "5. 쿠키와 자동 수집 기술",
            items: [
              "쿠키는 이용 환경 유지, 보안, 통계, 광고 제공을 위해 사용될 수 있는 작은 정보 파일입니다.",
              "이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 기존 쿠키를 삭제할 수 있습니다. 단, 일부 기능이나 광고 표시 방식이 달라질 수 있습니다.",
              "제3자 광고 쿠키의 세부 처리 방식은 각 광고 사업자의 개인정보 보호 및 광고 설정 페이지를 통해 확인할 수 있습니다."
            ]
          },
          {
            title: "6. 정보주체의 권리",
            items: [
              "이용자는 본인 개인정보의 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.",
              `권리 행사는 ${siteConfig.contactEmail}로 요청할 수 있으며, 본인 확인 후 관련 법령에 따라 처리합니다.`,
              "개인정보 침해에 대한 상담이나 구제가 필요한 경우 개인정보침해신고센터, 개인정보분쟁조정위원회 등 관계 기관을 이용할 수 있습니다."
            ]
          },
          {
            title: "7. 개인정보 보호 책임",
            items: [
              `${siteConfig.name}은 개인정보 관련 문의와 권리 행사를 ${siteConfig.contactEmail}에서 접수합니다.`,
              "개인정보처리방침의 내용이 변경되는 경우 이 페이지를 통해 변경 내용을 공개합니다."
            ]
          }
        ]}
      />
    </>
  );
}
