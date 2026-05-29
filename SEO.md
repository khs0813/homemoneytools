# SEO Checklist

## 기술 SEO

- 페이지별 고유 title과 description 적용
- canonical URL 적용
- sitemap.xml과 robots.txt 자동 생성
- Open Graph / Twitter Card 적용
- FAQPage, BreadcrumbList, WebApplication, WebPage, Article, ItemList JSON-LD 적용
- `/site.webmanifest`, favicon, icon, OG image 제공
- `/llms.txt` 제공
- 모바일 우선 반응형 레이아웃

## 배포 후 할 일

1. Render 환경변수 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 변경합니다.
2. Google Search Console에서 도메인을 등록합니다.
3. 인증값을 `GOOGLE_SITE_VERIFICATION`에 넣고 재배포합니다.
4. Search Console에서 `/sitemap.xml`을 제출합니다.
5. 대표 계산기 URL을 URL 검사 도구로 확인합니다.

## 콘텐츠 운영 원칙

- 취득세, DSR, 중개보수, 청약가점 기준은 변경될 수 있으므로 `src/config`의 version과 값을 최신화합니다.
- 법령 또는 금융기관 기준 변경 시 `siteConfig.lastUpdated`도 함께 갱신합니다.
- 계산기 페이지는 입력 폼만 두지 말고 공식, 예시, 주의사항, FAQ, 관련 계산기 내부링크를 유지합니다.
