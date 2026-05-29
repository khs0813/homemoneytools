export type FAQ = {
  question: string;
  answer: string;
};

export type CalculatorInfo = {
  slug: string;
  path: string;
  guidePath: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  formula: string;
  example: string;
  caution: string;
  faqs: FAQ[];
  relatedSlugs: string[];
};

export const calculators: CalculatorInfo[] = [
  {
    slug: "jeonse-loan-interest",
    path: "/jeonse-loan-interest-calculator",
    guidePath: "/guides/jeonse-loan-interest",
    title: "전세대출 이자 계산기",
    shortTitle: "전세대출 이자",
    description: "전세보증금, 대출금액, 금리, 기간, 상환방식을 입력하면 월 이자와 총 이자를 계산할 수 있습니다.",
    keywords: ["전세대출 이자 계산기", "전세대출 월 이자", "전세자금대출 이자 계산"],
    formula: "만기일시상환은 대출금액 × 연이율 ÷ 12로 월 이자를 계산합니다. 원리금균등상환은 월이율과 총 상환개월을 이용해 매월 같은 금액을 납부하도록 계산합니다.",
    example: "대출금액 1억 원, 연 4.8%, 만기일시상환이면 월 이자는 1억 × 4.8% ÷ 12 = 40만 원입니다.",
    caution: "전세대출 금리는 금융기관, 보증기관, 우대금리, 개인 신용 조건에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "전세대출 이자는 어떻게 계산하나요?", answer: "만기일시상환 기준으로는 대출금액에 연이율을 곱한 뒤 12로 나누어 월 이자를 계산합니다." },
      { question: "원리금균등과 만기일시상환의 차이는 무엇인가요?", answer: "만기일시상환은 매월 이자만 내고 만기에 원금을 갚는 방식이며, 원리금균등은 매월 원금과 이자를 함께 갚는 방식입니다." },
      { question: "보증료도 계산에 포함되나요?", answer: "선택 입력한 보증료율이 있으면 예상 보증료를 별도로 표시합니다." }
    ],
    relatedSlugs: ["rent-vs-jeonse", "monthly-rent-conversion", "dsr"]
  },
  {
    slug: "rent-vs-jeonse",
    path: "/rent-vs-jeonse-calculator",
    guidePath: "/guides/rent-vs-jeonse",
    title: "월세 vs 전세 비교 계산기",
    shortTitle: "월세 vs 전세",
    description: "월세와 전세의 총 주거비를 비교해 어떤 선택이 더 유리한지 계산합니다.",
    keywords: ["월세 전세 비교", "월세 vs 전세 계산기", "전세 월세 뭐가 유리"],
    formula: "월세 총비용은 월세 납부액과 보증금 기회비용을 더하고, 전세 총비용은 자기자본 기회비용과 전세대출 이자를 더해 비교합니다.",
    example: "전세가 5억 원, 월세 조건이 보증금 1억 원과 월세 120만 원이라면 2년 총비용과 기회비용을 합산해 비교합니다.",
    caution: "예금금리, 전세대출금리, 월세 상승률, 보증금 변동에 따라 실제 유불리가 달라질 수 있습니다.",
    faqs: [
      { question: "월세와 전세 비교에서 기회비용은 무엇인가요?", answer: "전세보증금이나 월세보증금으로 묶이는 돈을 예금하거나 투자했을 때 얻을 수 있었던 이자 수익을 의미합니다." },
      { question: "전세대출을 쓰면 어떻게 계산하나요?", answer: "전세보증금 중 자기자본에는 기회비용을, 대출금액에는 전세대출 이자를 적용해 전세 총비용을 계산합니다." },
      { question: "월세 상승률도 반영되나요?", answer: "입력하면 연 단위 상승률을 단순 반영해 비교 기간 동안의 월세 총액을 추정합니다." }
    ],
    relatedSlugs: ["jeonse-loan-interest", "monthly-rent-conversion", "brokerage-fee"]
  },
  {
    slug: "dsr",
    path: "/dsr-calculator",
    guidePath: "/guides/dsr",
    title: "주택담보대출 DSR 계산기",
    shortTitle: "DSR",
    description: "연소득과 대출 정보를 입력해 DSR과 기준 대비 여유 금액을 계산합니다.",
    keywords: ["DSR 계산기", "주담대 DSR 계산", "주택담보대출 한도 계산"],
    formula: "DSR = 모든 대출의 연간 원리금 상환액 ÷ 연소득 × 100입니다.",
    example: "연소득 7천만 원이고 모든 대출의 연간 상환액이 2천1백만 원이면 DSR은 30%입니다.",
    caution: "DSR은 금융기관별 심사 기준, 스트레스 금리, 대출 종류, 대출 만기, 개인 조건에 따라 다르게 산정될 수 있습니다.",
    faqs: [
      { question: "DSR은 무엇인가요?", answer: "총부채원리금상환비율로, 연소득 대비 모든 대출의 연간 원리금 상환액 비율을 의미합니다." },
      { question: "DSR 40%는 무슨 뜻인가요?", answer: "연소득의 40% 이내에서 대출 원리금을 상환해야 한다는 기준으로 이해할 수 있습니다." },
      { question: "신용대출도 포함되나요?", answer: "네. 이 계산기는 기존 신용대출과 기타대출 연상환액을 함께 반영할 수 있습니다." }
    ],
    relatedSlugs: ["jeonse-loan-interest", "acquisition-tax", "rent-vs-jeonse"]
  },
  {
    slug: "acquisition-tax",
    path: "/acquisition-tax-calculator",
    guidePath: "/guides/acquisition-tax",
    title: "취득세 계산기",
    shortTitle: "취득세",
    description: "주택 가격, 주택 수, 조정대상지역 여부, 취득 유형을 입력해 취득세와 부가 세목을 추정합니다.",
    keywords: ["취득세 계산기", "아파트 취득세 계산", "주택 취득세 계산"],
    formula: "취득세는 과세표준에 취득세율을 곱해 계산하고, 조건에 따라 지방교육세와 농어촌특별세를 별도 합산합니다.",
    example: "매매가 5억 원, 1주택 기본세율 1%로 단순 계산하면 취득세는 약 500만 원입니다.",
    caution: "주택 수, 지역, 취득 원인, 생애최초 감면, 일시적 2주택 여부, 법령 개정에 따라 실제 세액은 달라질 수 있습니다.",
    faqs: [
      { question: "취득세는 언제 내나요?", answer: "일반적으로 부동산을 취득한 뒤 법정 신고·납부 기한 내 신고하고 납부합니다." },
      { question: "생애최초 감면이 자동 적용되나요?", answer: "이 계산기는 단순 감면 한도만 반영합니다. 실제 감면 요건은 반드시 최신 법령과 지자체 기준을 확인해야 합니다." },
      { question: "지방교육세와 농어촌특별세도 포함되나요?", answer: "입력 옵션에 따라 별도 세목을 함께 추정해 총액을 표시합니다." }
    ],
    relatedSlugs: ["brokerage-fee", "dsr", "housing-subscription-score"]
  },
  {
    slug: "brokerage-fee",
    path: "/real-estate-brokerage-fee-calculator",
    guidePath: "/guides/brokerage-fee",
    title: "부동산 중개수수료 계산기",
    shortTitle: "중개수수료",
    description: "매매, 전세, 월세 계약 시 예상 부동산 중개보수와 부가세 포함 금액을 계산합니다.",
    keywords: ["부동산 중개수수료 계산기", "부동산 복비 계산", "전세 복비 계산"],
    formula: "중개보수는 거래금액 × 상한요율로 계산하며, 한도액이 있는 구간은 한도액을 초과하지 않도록 계산합니다.",
    example: "매매가 5억 원이고 상한요율이 0.4%이면 중개보수 상한은 200만 원, 부가세 10% 포함 시 220만 원입니다.",
    caution: "중개보수는 상한요율 내에서 협의할 수 있으며 지역, 거래 유형, 주택 여부에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "중개수수료와 중개보수는 같은 말인가요?", answer: "일상적으로는 복비, 중개수수료라고 부르지만 공식적으로는 중개보수라는 표현을 사용합니다." },
      { question: "월세 거래금액은 어떻게 계산하나요?", answer: "기본적으로 보증금 + 월세 × 100으로 환산하며, 일정 금액 미만에서는 별도 환산 배수를 적용합니다." },
      { question: "부가세도 내야 하나요?", answer: "중개업소의 과세 유형에 따라 부가세가 별도로 청구될 수 있어 부가세 포함 금액을 함께 보여줍니다." }
    ],
    relatedSlugs: ["acquisition-tax", "rent-vs-jeonse", "monthly-rent-conversion"]
  },
  {
    slug: "monthly-rent-conversion",
    path: "/monthly-rent-conversion-calculator",
    guidePath: "/guides/monthly-rent-conversion",
    title: "월세 환산 계산기",
    shortTitle: "월세 환산",
    description: "전세를 월세로 전환하거나 월세를 전세금으로 환산할 때 예상 금액을 계산합니다.",
    keywords: ["월세 환산 계산기", "전세 월세 전환 계산", "전월세 전환율 계산"],
    formula: "전세→월세는 (전세금 - 보증금) × 전월세전환율 ÷ 12로 계산합니다. 월세→전세는 보증금 + 월세 × 12 ÷ 전환율로 계산합니다.",
    example: "전세금 5억 원, 보증금 1억 원, 전환율 5%이면 월세는 약 166만 6,667원입니다.",
    caution: "실제 전월세 전환은 법정 상한, 시장 임대료, 계약 조건에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "전월세 전환율은 무엇인가요?", answer: "전세보증금 일부를 월세로 바꿀 때 적용하는 연 환산 비율입니다." },
      { question: "보증금을 높이면 월세가 줄어드나요?", answer: "네. 같은 전세금과 전환율이라면 보증금이 높아질수록 월세로 전환되는 금액이 줄어듭니다." },
      { question: "월세를 전세로도 환산할 수 있나요?", answer: "월세와 보증금, 전환율을 입력하면 전세 환산 금액을 계산할 수 있습니다." }
    ],
    relatedSlugs: ["rent-vs-jeonse", "jeonse-loan-interest", "brokerage-fee"]
  },
  {
    slug: "housing-subscription-score",
    path: "/housing-subscription-score-calculator",
    guidePath: "/guides/subscription-score",
    title: "청약 가점 계산기",
    shortTitle: "청약 가점",
    description: "무주택기간, 부양가족수, 청약통장 가입기간을 기준으로 청약 가점을 계산합니다.",
    keywords: ["청약 가점 계산기", "청약 점수 계산", "무주택기간 계산"],
    formula: "청약가점 총점은 무주택기간 점수, 부양가족수 점수, 청약통장 가입기간 점수를 합산해 계산합니다.",
    example: "무주택기간 8년, 부양가족 2명, 청약통장 가입기간 10년이면 각 항목 점수를 합산해 총점을 계산합니다.",
    caution: "무주택기간 산정, 부양가족 인정, 청약통장 가입기간은 모집공고와 제도 기준에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "청약가점 만점은 몇 점인가요?", answer: "일반적인 가점제 총점은 무주택기간 32점, 부양가족 35점, 청약통장 가입기간 17점으로 총 84점입니다." },
      { question: "무주택기간은 언제부터 계산하나요?", answer: "일반적으로 만 30세 이후부터 산정하며, 만 30세 이전에 혼인한 경우 혼인신고일부터 산정할 수 있습니다." },
      { question: "부양가족 수에 본인은 포함하나요?", answer: "일반적으로 부양가족 수는 본인을 제외하고 계산합니다." }
    ],
    relatedSlugs: ["acquisition-tax", "dsr", "brokerage-fee"]
  }
];

export function getCalculatorBySlug(slug: string): CalculatorInfo {
  const found = calculators.find((calculator) => calculator.slug === slug);
  if (!found) {
    throw new Error(`Calculator not found: ${slug}`);
  }
  return found;
}

export function getCalculatorByPath(path: string): CalculatorInfo | undefined {
  return calculators.find((calculator) => calculator.path === path);
}

export function getRelatedCalculators(slugs: string[]): CalculatorInfo[] {
  return slugs.map(getCalculatorBySlug);
}
