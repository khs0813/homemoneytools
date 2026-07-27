import type { CalculatorInfo } from "@/config/calculators";
import type { OfficialSource } from "@/config/housing-content";

export type CalculatorQualityContent = {
  checks: string[];
  basisNote: string;
  shortDisclaimer: string;
  contentModifiedDate?: string;
  calculationBasisDate?: string;
  sourceCheckedAt?: string;
  officialSources?: OfficialSource[];
};

const checkedAt = "2026-07-27";

export const calculatorQualityContentBySlug: Record<string, CalculatorQualityContent> = {
  "take-home-pay": {
    checks: ["세전 연봉 기준 월 예상 실수령액", "4대 보험과 근로소득세 추정 공제액", "비과세 수당 반영 전후 차이", "실수령액 대비 공제율"],
    basisNote: "급여 항목과 부양가족 입력값을 기준으로 단순 추정합니다. 회사별 급여 규정, 비과세 처리, 원천징수 방식은 실제 명세서를 우선 확인해야 합니다.",
    shortDisclaimer: "실수령액은 입력값 기준 추정치입니다. 실제 급여명세서, 연말정산, 회사 급여 규정과 다를 수 있습니다."
  },
  "loan-interest": {
    checks: ["상환방식별 월 납입액", "만기일시상환 월 이자", "원리금균등 총이자", "원금균등 첫 달과 마지막 달 납입액"],
    basisNote: "사용자가 입력한 원금, 금리, 기간, 상환방식을 월 단위로 환산해 계산합니다. 은행별 일수 계산, 실행일, 수수료는 별도입니다.",
    shortDisclaimer: "대출이자 결과는 입력 조건에 따른 참고값입니다. 실제 상환 스케줄은 금융기관 약정 조건을 확인해야 합니다."
  },
  "severance-pay": {
    checks: ["평균임금 기준 예상 퇴직금", "근속기간 월 단위 반영액", "예상 세금 차감 후 금액", "월 적립 환산액"],
    basisNote: "평균임금과 근속기간을 입력값 기준으로 단순화해 계산합니다. 평균임금 산정 제외 항목과 퇴직연금 방식은 별도 확인이 필요합니다.",
    shortDisclaimer: "퇴직금 계산은 참고용입니다. 실제 지급액은 근로계약, 임금 항목, 퇴직연금 운용 방식에 따라 달라질 수 있습니다."
  },
  "dividend-income": {
    checks: ["세전 연배당금", "세후 연배당금", "지급주기별 예상 배당금", "월 환산 배당금", "세후 배당수익률", "목표 월배당에 필요한 원금"],
    basisNote: "투자금, 연 배당수익률, 원천징수세율, 지급 횟수를 입력값 그대로 적용합니다. 배당정책 변경, 환율, 외국 세금, 감배당 위험은 별도입니다.",
    shortDisclaimer: "배당금은 확정 수익이 아닙니다. 종목·ETF의 배당정책, 원천징수, 환율, 감배당 가능성을 함께 확인해야 합니다.",
    calculationBasisDate: checkedAt,
    sourceCheckedAt: checkedAt,
    officialSources: [
      {
        title: "국세청 원천징수 세율 안내",
        url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7703&mi=2390",
        note: "배당소득 원천징수 기본 세율 확인용"
      }
    ]
  },
  "exchange-rate": {
    checks: ["원화 기준 외화 수령액", "환전 수수료 차감액", "환율 변경 시 역환산 금액", "왕복 환전 손익 차이"],
    basisNote: "실시간 환율을 자동 조회하지 않고 사용자가 입력한 환율과 수수료율을 기준으로 계산합니다.",
    shortDisclaimer: "환산 결과는 입력 환율 기준 참고값입니다. 실제 환전에는 은행 고시환율, 우대율, 카드 수수료가 적용될 수 있습니다."
  },
  "overseas-stock-tax": {
    checks: ["원화 기준 매수금액", "원화 기준 매도금액", "250만 원 기본공제 후 과세표준", "예상 양도소득세"],
    basisNote: "매수·매도 단가, 수량, 환율, 수수료를 입력값 기준으로 원화 환산합니다. 실제 신고는 연간 손익 합산과 증권사 자료를 확인해야 합니다.",
    shortDisclaimer: "해외주식 세금은 참고용 추정치입니다. 신고 연도, 환율 기준, 필요경비, 손실 상계에 따라 실제 세액이 달라질 수 있습니다."
  },
  "electricity-bill": {
    checks: ["현재 누진 구간", "구간별 사용량", "기본요금", "전력량요금", "부가 항목", "예상 총요금", "사용량 50kWh 증가 시 차이", "사용량 50kWh 감소 시 차이"],
    basisNote: "주택용 전기요금의 기본요금, 구간별 전력량요금, 기후환경요금, 연료비조정액을 입력 사용량에 적용해 추정합니다.",
    shortDisclaimer: "전기요금은 주택용 저압 간편 추정치입니다. 실제 고지서는 계약종별, 복지할인, 필수사용량 공제, 검침일에 따라 달라질 수 있습니다.",
    calculationBasisDate: checkedAt,
    sourceCheckedAt: checkedAt,
    officialSources: [
      {
        title: "한국전력공사 주요 전기요금제도",
        url: "https://home.kepco.co.kr/kepco/front/html/CY/H/C/CYHCHP00209.html",
        note: "주택용 누진제와 요금제도 확인용"
      }
    ]
  },
  "air-conditioner-electricity-cost": {
    checks: ["월 예상 전력 사용량", "하루 사용시간 기준 전기 사용량", "kWh 단가별 예상 비용", "시간당 전기요금"],
    basisNote: "소비전력, 하루 사용시간, 사용일수, kWh 단가를 곱해 월 전기 사용량과 요금을 단순 추정합니다.",
    shortDisclaimer: "에어컨 전기세는 소비전력 입력값 기준입니다. 인버터 제어, 설정온도, 실외기 환경에 따라 실제 사용량이 달라질 수 있습니다."
  },
  "car-maintenance-cost": {
    checks: ["월 유류비", "보험료와 자동차세 월 환산액", "주차·통행·정비비 합산액", "월 총 유지비와 km당 비용"],
    basisNote: "월 주행거리, 연비, 유가, 고정비와 운영비를 월 기준으로 합산합니다. 감가상각과 할부 구조는 입력 여부에 따라 달라집니다.",
    shortDisclaimer: "자동차 유지비는 입력값 기준 추정치입니다. 차종, 운전습관, 정비 이력, 보험 조건에 따라 실제 비용이 달라질 수 있습니다."
  },
  "monthly-living-expense": {
    checks: ["월 생활비 총액", "실수령 소득 대비 지출률", "항목별 예산 비중", "월 잔여 현금흐름"],
    basisNote: "사용자가 입력한 생활비 항목을 월 기준으로 합산하고 실수령 소득 대비 비율을 계산합니다.",
    shortDisclaimer: "생활비 결과는 예산 점검용입니다. 가구 구성, 지역, 계절, 고정비 구조에 따라 적정 지출은 달라질 수 있습니다."
  },
  "jeonse-loan-interest": {
    checks: ["월이자", "계약기간 총이자", "보증료", "총 금융비용", "금리 0.5%p 상승 시 결과", "금리 1.0%p 상승 시 결과", "전세보증금 대비 대출 비율"],
    basisNote: "전세보증금, 대출금액, 금리, 기간, 상환방식과 보증료율을 입력값 기준으로 적용합니다.",
    shortDisclaimer: "전세대출 결과는 참고용입니다. 보증기관, 은행 심사, 우대금리, 보증료율, 중도상환 조건을 실제 상품에서 확인해야 합니다.",
    calculationBasisDate: "2026-06-03",
    sourceCheckedAt: checkedAt
  },
  "rent-vs-jeonse": {
    checks: ["전세대출 이자", "전세보증금 자기자본 기회비용", "월세 총액", "월세보증금 기회비용", "보증료", "중개보수", "이사비", "2년 총주거비", "월 환산 비용", "손익분기 월세"],
    basisNote: "전세와 월세를 같은 기간의 총주거비로 환산해 비교합니다. 선택의 유불리 판단에 필요한 항목만 다룹니다.",
    shortDisclaimer: "전세와 월세 비교는 입력값 기준입니다. 보증금 반환 위험, 보증보험 가능 여부, 재계약 조건은 별도로 확인해야 합니다.",
    calculationBasisDate: "2026-06-03",
    sourceCheckedAt: checkedAt
  },
  dsr: {
    checks: ["입력 조건 기준 예상 DSR", "스트레스 금리 적용 전후 DSR", "DSR 기준까지 남은 연간 상환 여력", "신규 주담대 예상 월 원리금", "기존대출이 DSR에 미치는 영향"],
    basisNote: "연소득 대비 모든 대출의 연간 원리금 상환액을 계산하고, 입력한 스트레스 금리를 신규 주담대에 더해 보수적으로 판정합니다.",
    shortDisclaimer: "DSR 결과는 상환능력 점검용입니다. 실제 대출 가능 여부는 금융회사 심사, 담보가치, 규제 적용 대상에 따라 달라집니다.",
    calculationBasisDate: "2026-07-01",
    sourceCheckedAt: checkedAt
  },
  "acquisition-tax": {
    checks: ["취득세 예상액", "지방교육세", "농어촌특별세", "감면 적용 전후 차이", "총 필요 세금", "매매가 대비 실효세율"],
    basisNote: "주택 유상매매 기준으로 가격, 주택 수, 조정대상지역, 면적, 생애최초 감면 유형을 입력값대로 반영합니다.",
    shortDisclaimer: "취득세는 지자체 신고 기준이 우선입니다. 일시적 2주택, 상속, 증여, 주택 수 판정, 조정대상지역, 생애최초 감면은 관할 지자체에서 확인해야 합니다.",
    calculationBasisDate: "2026-07-01",
    sourceCheckedAt: checkedAt
  },
  "brokerage-fee": {
    checks: ["거래금액", "적용 상한요율", "법정 상한액", "사용자 입력 협의요율", "협의 수수료", "부가세", "총 지급 예상액", "월세 환산 거래금액"],
    basisNote: "매매와 전세는 거래금액을 직접 적용하고, 월세는 보증금과 월세를 환산한 거래금액에 주택 중개보수 상한요율을 적용합니다.",
    shortDisclaimer: "중개보수는 상한 범위 안에서 협의하는 금액입니다. 시도 조례, 부가세 청구 여부, 주택 외 거래 여부를 계약 전 확인해야 합니다.",
    calculationBasisDate: "2026-01",
    sourceCheckedAt: checkedAt
  },
  "monthly-rent-conversion": {
    checks: ["기존 보증금", "변경 보증금", "보증금 차액", "적용 전환율", "예상 월세", "월세의 전세금 환산액"],
    basisNote: "전세금과 변경 보증금의 차액에 전월세 전환율을 적용해 월세를 산출하거나, 월세를 전세금으로 역산합니다.",
    shortDisclaimer: "전월세 전환 계산은 계약 조건 비교용입니다. 법정 상한, 시장 전환율, 신규계약 여부에 따라 실제 협상 결과가 달라질 수 있습니다.",
    calculationBasisDate: "2026-07-16",
    sourceCheckedAt: checkedAt
  },
  "housing-subscription-score": {
    checks: ["무주택기간 점수", "부양가족 점수", "청약통장 가입기간 점수", "총점", "다음 점수 증가 예상 시점", "입력값에서 확인해야 할 주의사항"],
    basisNote: "입주자모집공고일을 기준으로 무주택기간, 부양가족 수, 본인·배우자 청약통장 가입기간 점수를 합산합니다.",
    shortDisclaimer: "청약가점은 모집공고와 청약홈 기준이 우선입니다. 무주택기간, 부양가족 인정, 배우자 통장 가점은 실제 신청 전 다시 확인해야 합니다.",
    calculationBasisDate: "2026-06-15",
    sourceCheckedAt: checkedAt
  }
};

export function getCalculatorQualityContent(info: CalculatorInfo): CalculatorQualityContent {
  const content = calculatorQualityContentBySlug[info.slug] ?? {
    checks: [`${info.shortTitle} 핵심 결과`, "입력값별 결과 변화", "계산 공식과 예시", "결과 해석 시 주의사항"],
    basisNote: `${info.title}는 사용자가 입력한 조건을 기준으로 계산합니다. 실제 계약, 신고, 납부, 투자 판단에는 각 기관의 최신 기준을 함께 확인해야 합니다.`,
    shortDisclaimer: "계산 결과는 입력값 기준 참고용입니다. 실제 조건은 기관, 계약, 상품, 신고 기준에 따라 달라질 수 있습니다."
  };

  return {
    contentModifiedDate: checkedAt,
    ...content
  };
}
