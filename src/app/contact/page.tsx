import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "문의",
  `${siteConfig.name} 서비스 문의, 오류 제보, 개인정보 관련 요청 접수 방법을 안내합니다.`,
  "/contact"
);

export default function ContactPage() {
  const title = "문의";
  const description = "서비스 오류, 계산 기준 제보, 개인정보 관련 요청은 이메일로 접수합니다.";

  return (
    <>
      <WebPageJsonLd title={title} description={description} path="/contact" />
      <BreadcrumbJsonLd items={[{ name: "홈", path: "/" }, { name: title, path: "/contact" }]} />
      <LegalPage
        eyebrow="Contact"
        title={title}
        description={description}
        sections={[
          {
            title: "문의 이메일",
            body: (
              <a className="text-lg font-bold text-brand-navy hover:underline" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            )
          },
          {
            title: "접수 가능한 내용",
            items: [
              "계산 기준 또는 결과 오류 제보",
              "페이지 오타, 링크 오류, 접근성 문제 제보",
              "개인정보 열람, 정정, 삭제, 처리정지 요청",
              "광고, 외부 링크, 서비스 운영 관련 문의"
            ]
          },
          {
            title: "문의 시 포함하면 좋은 정보",
            items: [
              "문제가 발생한 페이지 주소",
              "입력한 계산 조건과 예상한 결과",
              "사용 중인 브라우저와 기기 종류",
              "답변을 받을 이메일 주소"
            ]
          }
        ]}
      />
    </>
  );
}
