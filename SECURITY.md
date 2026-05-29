# Security Policy

이 프로젝트는 로그인, DB 저장, 외부 API 연동 없이 동작하는 계산기 사이트입니다. 그래도 운영 전후 아래 항목을 주기적으로 확인하세요.

## 배포 전 필수 점검

```bash
npm ci
npm run check
```

`npm run check`는 TypeScript 검사, ESLint, 단위 테스트, production build, `npm audit --audit-level=low`를 순서대로 실행합니다.

## 보안 설계

- DB와 세션을 사용하지 않습니다.
- 입력값은 React Hook Form, Zod, 숫자 clamp 유틸, query string 파서에서 검증합니다.
- JSON-LD는 `<`, `>`, `&`, U+2028, U+2029 문자를 escape 처리합니다.
- canonical/sitemap 기준 URL은 `https` 또는 로컬 개발용 `http://localhost`만 허용합니다.
- 보안 헤더는 `next.config.ts`에서 전역 적용합니다.
- production browser source map은 비활성화되어 있습니다.

## 의존성 관리

- Render는 `npm ci`를 사용하므로 `package-lock.json` 기준으로 재현 가능한 설치를 합니다.
- 직접 의존성 버전은 caret 없이 고정되어 있습니다.
- Next.js, React, react-server-dom 관련 보안 공지가 나오면 즉시 버전을 검토하세요.

## 운영 환경변수

```text
NODE_VERSION=20.19.0
NEXT_PUBLIC_SITE_URL=https://실제도메인
NEXT_TELEMETRY_DISABLED=1
GOOGLE_SITE_VERIFICATION=Search Console 인증값
```

`GOOGLE_SITE_VERIFICATION`은 공개 메타태그에 들어가는 값이며 비밀키가 아닙니다. DB URL, API Key, 인증 토큰은 이 프로젝트에 필요하지 않습니다.
