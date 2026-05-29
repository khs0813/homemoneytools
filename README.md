# Home Money Calculator - Render 배포용 부동산·주거비 계산기

DB 없이 동작하는 Next.js App Router 기반 계산기 사이트입니다.

## 포함 계산기

- 전세대출 이자 계산기
- 월세 vs 전세 비교 계산기
- 주택담보대출 DSR 계산기
- 취득세 계산기
- 부동산 중개수수료 계산기
- 월세 환산 계산기
- 청약 가점 계산기

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Vitest
- Render Web Service

## 로컬 실행

```bash
npm install
npm run dev
```

## 테스트 및 전체 점검

```bash
npm run test
npm run check
```

## 빌드

```bash
npm run build
npm run start
```

## Render 배포

`render.yaml`이 포함되어 있습니다. Render에서 GitHub 저장소를 연결하거나 Blueprint로 배포할 수 있습니다.

환경변수:

```text
NODE_VERSION=20.19.0
NEXT_PUBLIC_SITE_URL=https://실제도메인
NEXT_TELEMETRY_DISABLED=1
GOOGLE_SITE_VERIFICATION=Search Console 인증값
```

## 중요 안내

취득세율, 중개보수 요율, DSR 기준, 청약가점 기준은 `/src/config`에 분리되어 있습니다. 법령과 금융기관 심사 기준은 변경될 수 있으므로 실제 서비스 전 최신 기준으로 검수하세요.

이 프로젝트의 계산 결과는 참고용이며 실제 세금, 대출 가능 금액, 청약가점, 중개보수와 다를 수 있습니다.

## 추가 문서

- `SECURITY.md`: 보안 점검 및 운영 정책
- `SEO.md`: 배포 후 SEO 체크리스트

