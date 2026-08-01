# Render AdFit Env Map

현재 프로젝트는 Next.js이므로 client에서 쓰는 AdFit 값은 기존 방식과 일치하는 `NEXT_PUBLIC_*` 접두사를 사용한다. DAN ID는 저장소에 커밋하지 않는다.

## Feature Flags

| 역할 | env 이름 | 기본값 | 비활성화 값 |
| --- | --- | --- | --- |
| 계산 결과 직후 광고 | `NEXT_PUBLIC_ADFIT_ENABLE_RESULT_PRIMARY` | `true` | `false`, `0`, `off`, `no` |
| 중간 콘텐츠 광고 | `NEXT_PUBLIC_ADFIT_ENABLE_MID_CONTENT` | `true` | `false`, `0`, `off`, `no` |
| 콘텐츠 종료 광고 | `NEXT_PUBLIC_ADFIT_ENABLE_END` | `true` | `false`, `0`, `off`, `no` |
| 데스크톱 우측 광고 | `NEXT_PUBLIC_ADFIT_ENABLE_DESKTOP_RAIL` | `true` | `false`, `0`, `off`, `no` |

## Ad Unit Env

| 광고단위 역할 | env 이름 | 필요한 발급 크기 | 호출 조건 |
| --- | --- | --- | --- |
| 모바일 직사각형 이미지 | `NEXT_PUBLIC_ADFIT_MOBILE_RECTANGLE_IMAGE` | 320x480 | 모바일 `result_primary`, 결과 렌더링 이후. 우선 선택. |
| 모바일 배너 | `NEXT_PUBLIC_ADFIT_MOBILE_BANNER` | 300x250 | 모바일 `result_primary`, 직사각형 이미지 env가 없을 때만 fallback. |
| 모바일용 얇은 띠배너 | `NEXT_PUBLIC_ADFIT_MOBILE_THIN_BANNER` | 320x50 | 모바일 `mid_content` 또는 `end`. |
| 웹 배너 | `NEXT_PUBLIC_ADFIT_DESKTOP_WEB_BANNER` | 728x90 | 데스크톱 `result_primary`, `mid_content`, `end`. |
| 우측상단 | `NEXT_PUBLIC_ADFIT_DESKTOP_RIGHT_TOP` | 160x600 | 데스크톱 `desktop_rail`. |

## 동작 규칙

- env 값이 비어 있으면 광고 DOM을 만들지 않고, 빈 박스도 렌더링하지 않는다.
- 모바일 직사각형 이미지와 모바일 배너가 모두 있으면 `result_primary`에서는 직사각형 이미지 하나만 호출한다.
- 모바일과 데스크톱 단위를 동시에 DOM에 넣고 CSS로 숨기지 않는다.
- `data-ad-width`, `data-ad-height`는 위 표의 발급 크기와 일치해야 한다.
- AdFit SDK는 `https://t1.kakaocdn.net/kas/static/ba.min.js`를 앱에서 한 번만 로드한다.
- 동일 `page_path + placement + device + env_name + ad_size` slot key는 같은 브라우저 세션의 route 재마운트나 React Strict Mode 재렌더에서 재요청하지 않는다.
