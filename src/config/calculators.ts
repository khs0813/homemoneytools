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
  category: string;
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
    slug: "take-home-pay",
    path: "/take-home-pay-calculator",
    guidePath: "/guides/annual-salary-50-million-take-home-pay",
    title: "실수령액 계산기",
    shortTitle: "실수령액",
    category: "급여·세금",
    description: "연봉, 상여금, 비과세 수당, 부양가족 수를 바탕으로 4대 보험과 세금을 반영한 월 예상 실수령액을 계산합니다.",
    keywords: ["실수령액 계산기", "연봉 실수령액", "월급 실수령액 계산"],
    formula: "세전 총보수에서 국민연금, 건강보험, 장기요양보험, 고용보험을 차감하고, 근로소득공제와 인적공제를 반영한 추정 소득세와 지방소득세를 빼서 실수령액을 계산합니다.",
    example: "연봉 5,000만 원, 비과세 수당 월 20만 원, 부양가족 1명이라면 월 세전 약 416만 7천 원에서 4대 보험과 세금을 차감해 월 실수령액을 추정할 수 있습니다.",
    caution: "회사별 식대 비과세 처리, 선택적 복지, 상여 지급 방식, 연말정산 결과에 따라 실제 급여명세서와 차이가 날 수 있습니다.",
    faqs: [
      { question: "실수령액 계산기는 세전 금액 기준인가요?", answer: "네. 연봉과 상여금 같은 세전 보수를 기준으로 4대 보험과 세금을 차감해 예상 실수령액을 보여줍니다." },
      { question: "연말정산 결과도 바로 반영되나요?", answer: "아니요. 이 계산기는 월 급여 기준의 추정치이며, 실제 연말정산 환급 또는 추가 납부 결과는 별도로 달라질 수 있습니다." },
      { question: "비과세 수당은 왜 따로 입력하나요?", answer: "비과세 식대나 일부 수당은 과세표준과 4대 보험 기준에 차이가 있어 실수령액에 영향을 주기 때문입니다." },
      { question: "부양가족 수를 늘리면 실수령액이 올라가나요?", answer: "일반적으로 인적공제 반영으로 세금이 줄어들 수 있어 예상 실수령액이 소폭 증가할 수 있습니다." },
      { question: "정확한 급여명세서와 다르면 어떻게 봐야 하나요?", answer: "회사 급여 시스템, 보험료 정산, 비과세 항목, 소득세 원천징수 방식 차이가 있으므로 참고용으로 활용하고 실제 명세서를 우선 확인해야 합니다." }
    ],
    relatedSlugs: ["loan-interest", "monthly-living-expense", "car-maintenance-cost"]
  },
  {
    slug: "loan-interest",
    path: "/loan-interest-calculator",
    guidePath: "/guides/100-million-loan-monthly-interest",
    title: "대출이자 계산기",
    shortTitle: "대출이자",
    category: "대출·상환",
    description: "대출원금, 금리, 기간, 상환방식을 입력해 월 납입액과 총 이자를 계산합니다.",
    keywords: ["대출이자 계산기", "월 이자 계산", "원리금균등 계산기"],
    formula: "만기일시상환은 원금 × 연이율 ÷ 12, 원리금균등은 월이율과 상환개월을 이용한 연금 공식, 원금균등은 매달 같은 원금에 잔액 이자를 더하는 방식으로 계산합니다.",
    example: "대출 1억 원, 연 5%, 만기일시상환이면 월 이자는 약 41만 7천 원입니다. 같은 조건에서 원리금균등 10년 상환이면 매달 비슷한 금액을 납부하지만 총 이자는 달라집니다.",
    caution: "중도상환수수료, 인지세, 우대금리 조건, 변동금리 인상 가능성은 별도로 확인해야 합니다.",
    faqs: [
      { question: "월 이자만 알고 싶으면 어떤 방식을 봐야 하나요?", answer: "만기일시상환 결과를 보면 월 이자만 따로 확인하기 쉽습니다." },
      { question: "원리금균등과 원금균등은 무엇이 다른가요?", answer: "원리금균등은 매달 같은 금액을 내고, 원금균등은 초반 납입액이 크지만 시간이 지날수록 줄어듭니다." },
      { question: "금리를 0.1%만 바꿔도 차이가 큰가요?", answer: "대출원금과 기간이 길수록 총 이자 차이가 크게 벌어질 수 있습니다." },
      { question: "변동금리 대출에도 사용할 수 있나요?", answer: "가능하지만 현재 금리를 기준으로 한 단순 추정치이므로 향후 금리 변동은 별도 시나리오로 계산하는 것이 좋습니다." },
      { question: "실제 은행 상환 스케줄과 왜 다를 수 있나요?", answer: "은행은 일수 계산, 거치기간, 실행일, 원 단위 절사 등 세부 규칙을 적용하므로 일부 차이가 날 수 있습니다." }
    ],
    relatedSlugs: ["take-home-pay", "jeonse-loan-interest", "dsr"]
  },
  {
    slug: "severance-pay",
    path: "/severance-pay-calculator",
    guidePath: "/guides/why-average-wage-matters-for-severance",
    title: "퇴직금 계산기",
    shortTitle: "퇴직금",
    category: "급여·세금",
    description: "평균임금과 근속기간을 기준으로 예상 퇴직금을 계산하고 월 단위 적립 감각을 확인합니다.",
    keywords: ["퇴직금 계산기", "평균임금 퇴직금", "퇴직금 예상액"],
    formula: "통상적으로 평균임금 30일분 × 재직일수 ÷ 365 방식으로 법정 퇴직금을 추정합니다.",
    example: "평균임금이 월 350만 원 수준이고 5년 근속했다면 대략 350만 원 × 5년으로 예상 퇴직금을 가늠할 수 있습니다.",
    caution: "평균임금 산정 기간, 제외 수당, 퇴직연금 적립 방식, 중간정산 여부에 따라 실제 금액은 달라집니다.",
    faqs: [
      { question: "퇴직금은 누구나 받을 수 있나요?", answer: "원칙적으로 1년 이상 계속 근로하고 4주 평균 주 15시간 이상 근무한 경우 법정 퇴직금 대상이 됩니다." },
      { question: "평균임금은 어떻게 계산하나요?", answer: "보통 퇴직 직전 3개월 동안 지급된 임금 총액을 해당 기간 총일수로 나눠 계산합니다." },
      { question: "연차수당도 평균임금에 들어가나요?", answer: "지급 시기와 법적 성격에 따라 반영 여부가 달라질 수 있어 급여 담당자나 노무 전문가 확인이 필요합니다." },
      { question: "퇴직연금 DB형과 DC형도 같은가요?", answer: "법정 퇴직금 산식은 참고가 되지만 적립 방식과 운용 결과에 따라 실제 수령 구조는 달라질 수 있습니다." },
      { question: "중간정산 이력이 있으면 어떻게 되나요?", answer: "이미 중간정산된 기간과 금액을 제외하고 남은 기간 기준으로 다시 계산해야 합니다." }
    ],
    relatedSlugs: ["take-home-pay", "monthly-living-expense", "dividend-income"]
  },
  {
    slug: "dividend-income",
    path: "/dividend-income-calculator",
    guidePath: "/guides/how-much-needed-for-1-million-won-dividends",
    title: "배당금 계산기",
    shortTitle: "배당금",
    category: "투자·세금",
    description: "투자금, 배당수익률, 세율, 지급 주기를 입력해 세전·세후 배당금과 월 환산 현금흐름을 계산합니다.",
    keywords: ["배당금 계산기", "배당수익률 계산", "월 배당 목표 계산"],
    formula: "연간 배당금은 투자금 × 배당수익률, 세후 배당금은 연간 배당금 × (1 - 원천징수세율)로 계산합니다.",
    example: "1억 원을 연 4% 배당수익률 자산에 투자하면 세전 연 400만 원 배당이 발생하며 세율을 반영해 세후 금액을 확인할 수 있습니다.",
    caution: "배당수익률은 미래 확정 수익이 아니며 감배당, 환율 변동, 세금 조약, 종목별 지급 시기 차이가 있습니다.",
    faqs: [
      { question: "배당수익률 5%면 매달 5%를 받는 뜻인가요?", answer: "아니요. 일반적으로 연 기준 수익률이며 이를 월 기준으로 나눠서 체감하면 됩니다." },
      { question: "세후 배당금은 왜 줄어드나요?", answer: "국내외 배당은 원천징수세가 적용될 수 있어 실제 입금액은 세전보다 적습니다." },
      { question: "월 배당 ETF도 계산할 수 있나요?", answer: "지급 주기를 월로 바꿔 월 평균 현금흐름을 확인할 수 있습니다." },
      { question: "배당금만으로 생활비를 만들 수 있나요?", answer: "가능성은 있지만 목표 생활비, 세후 수익률, 감배당 위험까지 함께 봐야 합니다." },
      { question: "해외 배당도 같은 방식인가요?", answer: "기본 구조는 비슷하지만 환율과 외국납부세액공제 여부에 따라 실수령액이 달라질 수 있습니다." }
    ],
    relatedSlugs: ["exchange-rate", "overseas-stock-tax", "monthly-living-expense"]
  },
  {
    slug: "exchange-rate",
    path: "/exchange-rate-calculator",
    guidePath: "/guides/exchange-rate-basics-and-fees",
    title: "환율 계산기",
    shortTitle: "환율",
    category: "환율·해외투자",
    description: "원화 금액과 환율, 환전 수수료를 기준으로 외화 수령액과 역환산 금액을 계산합니다.",
    keywords: ["환율 계산기", "달러 환율 계산", "환전 수수료 계산"],
    formula: "외화 수령액은 원화 금액 ÷ 적용 환율, 수수료 반영 외화는 외화 수령액에서 환전 비용을 차감해 계산합니다.",
    example: "130만 원을 1달러당 1,350원 환율로 환전하면 약 963달러 수준이며 수수료율에 따라 실제 수령액은 더 줄어듭니다.",
    caution: "은행 우대율, 현찰 매매 스프레드, 카드 해외 결제 수수료는 기관별로 다를 수 있습니다.",
    faqs: [
      { question: "환율 계산기는 실시간 환율을 가져오나요?", answer: "아니요. 사용자가 입력한 환율을 기준으로 계산하므로 원하는 기준환율을 직접 넣어야 합니다." },
      { question: "매매기준율과 살 때 환율은 다른가요?", answer: "네. 실제 환전 시에는 현찰 매도/매수 스프레드와 우대율이 반영됩니다." },
      { question: "해외주식 투자에도 활용할 수 있나요?", answer: "매수·매도 시점 환율을 가정해 원화 기준 손익을 가늠하는 데 활용할 수 있습니다." },
      { question: "수수료는 언제 차감되나요?", answer: "일반적으로 환전 과정에서 우대율을 반영한 환율 또는 별도 수수료로 비용이 반영됩니다." },
      { question: "카드 결제 환산과 은행 환전은 왜 다를까요?", answer: "카드사는 국제 브랜드 수수료와 해외서비스 수수료를 별도로 더할 수 있기 때문입니다." }
    ],
    relatedSlugs: ["dividend-income", "overseas-stock-tax", "loan-interest"]
  },
  {
    slug: "overseas-stock-tax",
    path: "/overseas-stock-capital-gains-tax-calculator",
    guidePath: "/guides/overseas-stock-tax-2-5-million-deduction",
    title: "해외주식 양도세 계산기",
    shortTitle: "해외주식 양도세",
    category: "투자·세금",
    description: "매수·매도 단가, 수량, 환율을 기준으로 해외주식 양도차익과 250만 원 기본공제 후 예상 세금을 계산합니다.",
    keywords: ["해외주식 양도세 계산기", "해외주식 세금", "250만원 공제 계산"],
    formula: "원화 기준 양도차익은 매도금액 - 취득금액 - 비용이며, 과세표준은 연간 순이익 - 250만 원 기본공제, 세액은 과세표준 × 22%로 계산합니다.",
    example: "미국주식을 원화 기준 1,000만 원 이익에 매도했다면 기본공제 250만 원을 뺀 750만 원에 대해 22% 세율을 적용해 예상 세금을 계산할 수 있습니다.",
    caution: "여러 종목 손익 합산, 환율 적용일, 수수료, 신고 연도 손실 이월, 세법 개정 여부에 따라 실제 신고세액은 달라질 수 있습니다.",
    faqs: [
      { question: "250만 원 공제는 종목마다 적용되나요?", answer: "아니요. 일반적으로 해당 연도 해외주식 양도손익 전체를 합산한 뒤 1인당 기본공제를 적용합니다." },
      { question: "손실 난 종목도 같이 반영해야 하나요?", answer: "네. 이익과 손실을 합산한 연간 순손익 기준으로 계산하는 것이 일반적입니다." },
      { question: "환율은 언제 기준인가요?", answer: "실무상 취득 및 양도 시점의 환율 적용 기준이 중요하므로 증권사 자료와 신고 안내를 확인해야 합니다." },
      { question: "배당세와 양도세는 같은가요?", answer: "아니요. 배당소득세와 양도소득세는 과세 방식과 신고 구조가 다릅니다." },
      { question: "실제 신고 전 무엇을 확인해야 하나요?", answer: "증권사 거래내역, 환율자료, 필요경비, 손실상계 여부를 정리한 뒤 세무 전문가나 공식 안내를 확인해야 합니다." }
    ],
    relatedSlugs: ["exchange-rate", "dividend-income", "take-home-pay"]
  },
  {
    slug: "electricity-bill",
    path: "/electricity-bill-calculator",
    guidePath: "/guides/electricity-progressive-rates-explained",
    title: "전기요금 계산기",
    shortTitle: "전기요금",
    category: "공과금·생활비",
    description: "월 사용량과 계절 구분을 입력해 주택용 저압 기준 예상 전기요금과 누진 단계 영향을 계산합니다.",
    keywords: ["전기요금 계산기", "누진세 계산", "가정용 전기요금"],
    formula: "기본요금과 구간별 전력량요금을 합산하고, 기후환경요금과 연료비조정액을 더해 예상 청구액을 계산합니다.",
    example: "월 사용량 350kWh라면 1단계와 2단계 구간 사용량을 나눠 전력량요금을 계산하고 기본요금을 더해 총 요금을 추정합니다.",
    caution: "실제 청구서는 주택용 저압/고압, 복지할인, 필수사용량 공제, 계절별 단가 개편 여부에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "누진세는 어떤 식으로 계산되나요?", answer: "전체 사용량에 하나의 단가를 곱하는 것이 아니라 구간별 사용량에 해당 단가를 나눠 적용합니다." },
      { question: "여름철 전기요금이 더 비싼 이유는 무엇인가요?", answer: "사용량이 늘어나 누진 단계가 올라가고, 계절별 단가가 다르게 적용될 수 있기 때문입니다." },
      { question: "부가세와 전력산업기반기금도 포함되나요?", answer: "이 계산기는 핵심 청구 구조를 중심으로 추정하며 실제 고지서의 부가 항목은 별도 확인이 필요합니다." },
      { question: "아파트 관리비 전기료와 같은가요?", answer: "공동주택은 공용부 전기료, 계약 방식, 검침 주기에 따라 체감 금액이 다를 수 있습니다." },
      { question: "정확한 요금 확인은 어디서 하나요?", answer: "최종 청구액은 한전 고지서나 공식 전기요금 안내를 통해 확인해야 합니다." }
    ],
    relatedSlugs: ["air-conditioner-electricity-cost", "monthly-living-expense", "car-maintenance-cost"]
  },
  {
    slug: "air-conditioner-electricity-cost",
    path: "/air-conditioner-electricity-cost-calculator",
    guidePath: "/guides/air-conditioner-8-hours-cost",
    title: "에어컨 전기세 계산기",
    shortTitle: "에어컨 전기세",
    category: "공과금·생활비",
    description: "에어컨 소비전력, 사용시간, 사용일수, kWh 단가를 바탕으로 월 예상 전기 사용량과 전기세를 계산합니다.",
    keywords: ["에어컨 전기세 계산기", "에어컨 전기요금", "여름 전기세 계산"],
    formula: "월 사용전력량은 소비전력(kW) × 하루 사용시간 × 사용일수이며, 예상 요금은 사용전력량 × kWh당 단가로 계산합니다.",
    example: "소비전력 1.2kW 에어컨을 하루 8시간, 30일 사용하면 월 사용량은 288kWh로 추정할 수 있습니다.",
    caution: "인버터 제어, 희망온도, 실외기 환경, 단열 상태에 따라 실제 소비전력은 크게 달라집니다.",
    faqs: [
      { question: "에어컨 정격 소비전력대로 계속 전기를 쓰나요?", answer: "아니요. 인버터 제품은 설정 온도 도달 후 소비전력이 낮아질 수 있습니다." },
      { question: "kWh 단가는 어떻게 넣어야 하나요?", answer: "가정용 평균 단가나 전기요금 계산기에서 추정한 체감 단가를 입력하면 됩니다." },
      { question: "선풍기와 함께 쓰면 전기세가 줄어드나요?", answer: "실내 순환이 좋아져 설정 온도를 높일 수 있으면 전체 사용량을 줄이는 데 도움이 될 수 있습니다." },
      { question: "하루 8시간 사용 예시는 왜 자주 보이나요?", answer: "재택근무나 야간 냉방처럼 현실적인 사용 패턴을 가정하기 쉬워 비교 기준으로 자주 쓰입니다." },
      { question: "실제 전기요금은 왜 더 많이 나올 수 있나요?", answer: "에어컨 외 다른 가전 사용량이 함께 누진구간을 올리면 전체 청구액이 더 커질 수 있습니다." }
    ],
    relatedSlugs: ["electricity-bill", "monthly-living-expense", "exchange-rate"]
  },
  {
    slug: "car-maintenance-cost",
    path: "/car-maintenance-cost-calculator",
    guidePath: "/guides/monthly-car-maintenance-cost-breakdown",
    title: "자동차 유지비 계산기",
    shortTitle: "자동차 유지비",
    category: "생활비·이동비",
    description: "주행거리, 연비, 유가, 보험료, 세금, 정비비를 반영해 월 자동차 유지비를 계산합니다.",
    keywords: ["자동차 유지비 계산기", "월 자동차 비용", "차 유지비"],
    formula: "월 유류비는 월 주행거리 ÷ 연비 × 리터당 유가, 총 유지비는 유류비 + 보험료 월환산 + 자동차세 월환산 + 정비·주차·통행료 등을 합산해 계산합니다.",
    example: "월 1,200km 주행, 연비 12km/L, 유가 1,700원이라면 유류비만 월 약 17만 원 수준이 됩니다.",
    caution: "차종, 운전습관, 계절, 사고이력, 주차 환경, 할부 여부에 따라 실제 유지비 편차가 큽니다.",
    faqs: [
      { question: "유류비 외에 꼭 넣어야 할 항목은 무엇인가요?", answer: "보험료, 자동차세, 정비비, 타이어·소모품, 주차비, 통행료를 함께 보는 것이 현실적입니다." },
      { question: "하이브리드나 전기차도 계산할 수 있나요?", answer: "가능합니다. 연비 대신 전비나 충전 단가로 바꿔 입력하면 유사한 방식으로 비교할 수 있습니다." },
      { question: "차량 감가상각도 넣어야 하나요?", answer: "실제 총소유비용을 보려면 감가상각까지 포함하는 것이 더 정확합니다." },
      { question: "주행거리가 적으면 차를 유지하는 게 유리한가요?", answer: "주행거리가 적어도 고정비가 계속 발생하므로 대중교통·렌트와 비교해보는 것이 좋습니다." },
      { question: "할부금도 유지비에 포함하나요?", answer: "현금흐름 관점에서는 포함하는 경우가 많지만, 자산 구매비용과 운영비를 구분해 보는 방식도 가능합니다." }
    ],
    relatedSlugs: ["monthly-living-expense", "electricity-bill", "take-home-pay"]
  },
  {
    slug: "monthly-living-expense",
    path: "/monthly-living-expense-calculator",
    guidePath: "/guides/monthly-living-expense-budget-items",
    title: "월 생활비 계산기",
    shortTitle: "월 생활비",
    category: "생활비·예산",
    description: "주거비, 식비, 교통비, 통신비, 보험료, 여가비 등을 합산해 월 생활비 예산과 권장 비중을 계산합니다.",
    keywords: ["생활비 계산기", "월 생활비 예산", "가계부 예산 계산"],
    formula: "각 지출 항목을 월 기준으로 합산해 총생활비를 계산하고, 실수령 소득 대비 항목별 비중을 함께 표시합니다.",
    example: "월 실수령 320만 원 가구가 주거비 90만 원, 식비 60만 원, 교통비 20만 원 등으로 입력하면 항목별 비중을 한 번에 볼 수 있습니다.",
    caution: "가구 구성, 지역, 주거 형태, 부채 수준에 따라 적정 생활비 구조는 크게 다를 수 있습니다.",
    faqs: [
      { question: "생활비 계산기는 1인 가구만 위한 건가요?", answer: "아니요. 부부, 자녀가 있는 가구, 부모 부양 가구도 항목값만 바꿔 동일하게 사용할 수 있습니다." },
      { question: "저축도 생활비에 넣어야 하나요?", answer: "예산 관리 목적이라면 저축과 투자도 월 자금배분 항목으로 함께 보는 것이 좋습니다." },
      { question: "식비가 적정한지 어떻게 판단하나요?", answer: "총 실수령액 대비 비중과 최근 3개월 실제 카드 사용액을 함께 비교하면 판단하기 쉽습니다." },
      { question: "고정비와 변동비를 나눠야 하나요?", answer: "네. 고정비를 먼저 파악해야 절감 가능한 항목과 협상 가능한 항목이 보입니다." },
      { question: "예산과 실제 지출이 다르면 어떻게 해야 하나요?", answer: "월 1회 이상 예산 대비 실적을 점검해 반복적으로 초과되는 항목을 조정하는 것이 좋습니다." }
    ],
    relatedSlugs: ["take-home-pay", "car-maintenance-cost", "electricity-bill"]
  },
  {
    slug: "jeonse-loan-interest",
    path: "/jeonse-loan-interest-calculator",
    guidePath: "/guides/jeonse-loan-interest-mistakes",
    title: "전세대출 이자 계산기",
    shortTitle: "전세대출 이자",
    category: "주거·대출",
    description: "전세보증금, 대출금액, 금리, 기간, 상환방식을 입력하면 월 이자와 총 이자를 계산할 수 있습니다.",
    keywords: ["전세대출 이자 계산기", "전세대출 월 이자", "전세자금대출 이자 계산"],
    formula: "만기일시상환은 대출금액 × 연이율 ÷ 12로 월 이자를 계산합니다. 원리금균등상환은 월이율과 총 상환개월을 이용해 매월 같은 금액을 납부하도록 계산합니다.",
    example: "대출금액 1억 원, 연 4.8%, 만기일시상환이면 월 이자는 1억 × 4.8% ÷ 12 = 40만 원입니다.",
    caution: "전세대출 금리는 금융기관, 보증기관, 우대금리, 개인 신용 조건에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "전세대출 이자는 어떻게 계산하나요?", answer: "만기일시상환 기준으로는 대출금액에 연이율을 곱한 뒤 12로 나누어 월 이자를 계산합니다." },
      { question: "원리금균등과 만기일시상환의 차이는 무엇인가요?", answer: "만기일시상환은 매월 이자만 내고 만기에 원금을 갚는 방식이며, 원리금균등은 매월 원금과 이자를 함께 갚는 방식입니다." },
      { question: "보증료도 계산에 포함되나요?", answer: "선택 입력한 보증료율이 있으면 예상 보증료를 별도로 표시합니다." },
      { question: "전세대출 한도는 여기서 알 수 있나요?", answer: "이 페이지는 이자와 상환 부담 계산에 집중하며 실제 한도는 금융기관 심사 기준을 확인해야 합니다." },
      { question: "계약 전 어떤 금리 시나리오를 봐야 하나요?", answer: "현재 금리뿐 아니라 0.5%p, 1%p 높은 금리도 함께 넣어 월 부담 변화를 확인하는 것이 좋습니다." }
    ],
    relatedSlugs: ["rent-vs-jeonse", "monthly-rent-conversion", "dsr"]
  },
  {
    slug: "rent-vs-jeonse",
    path: "/rent-vs-jeonse-calculator",
    guidePath: "/guides/rent-vs-jeonse-decision-guide",
    title: "월세 vs 전세 비교 계산기",
    shortTitle: "월세 vs 전세",
    category: "주거·비교",
    description: "월세와 전세의 총 주거비를 비교해 어떤 선택이 더 유리한지 계산합니다.",
    keywords: ["월세 전세 비교", "월세 vs 전세 계산기", "전세 월세 뭐가 유리"],
    formula: "월세 총비용은 월세 납부액과 보증금 기회비용을 더하고, 전세 총비용은 자기자본 기회비용과 전세대출 이자를 더해 비교합니다.",
    example: "전세가 5억 원, 월세 조건이 보증금 1억 원과 월세 120만 원이라면 2년 총비용과 기회비용을 합산해 비교합니다.",
    caution: "예금금리, 전세대출금리, 월세 상승률, 보증금 변동에 따라 실제 유불리가 달라질 수 있습니다.",
    faqs: [
      { question: "월세와 전세 비교에서 기회비용은 무엇인가요?", answer: "전세보증금이나 월세보증금으로 묶이는 돈을 예금하거나 투자했을 때 얻을 수 있었던 이자 수익을 의미합니다." },
      { question: "전세대출을 쓰면 어떻게 계산하나요?", answer: "전세보증금 중 자기자본에는 기회비용을, 대출금액에는 전세대출 이자를 적용해 전세 총비용을 계산합니다." },
      { question: "월세 상승률도 반영되나요?", answer: "입력하면 연 단위 상승률을 단순 반영해 비교 기간 동안의 월세 총액을 추정합니다." },
      { question: "보증금이 큰 월세는 어떻게 봐야 하나요?", answer: "월세만 보지 말고 보증금 기회비용까지 함께 반영해야 공정한 비교가 가능합니다." },
      { question: "계약기간이 2년보다 짧아도 쓸 수 있나요?", answer: "네. 예상 거주기간에 맞게 기간을 조정해 비교할 수 있습니다." }
    ],
    relatedSlugs: ["jeonse-loan-interest", "monthly-rent-conversion", "brokerage-fee"]
  },
  {
    slug: "dsr",
    path: "/dsr-calculator",
    guidePath: "/guides/what-dsr-40-means",
    title: "주택담보대출 DSR 계산기",
    shortTitle: "DSR",
    category: "주거·대출",
    description: "연소득과 대출 정보를 입력해 DSR과 기준 대비 여유 금액을 계산합니다.",
    keywords: ["DSR 계산기", "주담대 DSR 계산", "주택담보대출 한도 계산"],
    formula: "DSR = 모든 대출의 연간 원리금 상환액 ÷ 연소득 × 100입니다.",
    example: "연소득 7천만 원이고 모든 대출의 연간 상환액이 2천1백만 원이면 DSR은 30%입니다.",
    caution: "DSR은 금융기관별 심사 기준, 스트레스 금리, 대출 종류, 대출 만기, 개인 조건에 따라 다르게 산정될 수 있습니다.",
    faqs: [
      { question: "DSR은 무엇인가요?", answer: "총부채원리금상환비율로, 연소득 대비 모든 대출의 연간 원리금 상환액 비율을 의미합니다." },
      { question: "DSR 40%는 무슨 뜻인가요?", answer: "연소득의 40% 이내에서 대출 원리금을 상환해야 한다는 기준으로 이해할 수 있습니다." },
      { question: "신용대출도 포함되나요?", answer: "네. 이 계산기는 기존 신용대출과 기타대출 연상환액을 함께 반영할 수 있습니다." },
      { question: "스트레스 금리는 왜 보나요?", answer: "향후 금리 상승을 가정해 보수적으로 상환능력을 보는 지표이기 때문입니다." },
      { question: "승인 여부를 확정해주나요?", answer: "아니요. 이 계산기는 사전 점검용이며 실제 심사는 금융기관 정책에 따릅니다." }
    ],
    relatedSlugs: ["jeonse-loan-interest", "acquisition-tax", "rent-vs-jeonse"]
  },
  {
    slug: "acquisition-tax",
    path: "/acquisition-tax-calculator",
    guidePath: "/guides/acquisition-tax-checklist",
    title: "취득세 계산기",
    shortTitle: "취득세",
    category: "부동산·세금",
    description: "주택 가격, 주택 수, 조정대상지역 여부, 취득 유형을 입력해 취득세와 부가 세목을 추정합니다.",
    keywords: ["취득세 계산기", "아파트 취득세 계산", "주택 취득세 계산"],
    formula: "취득세는 과세표준에 취득세율을 곱해 계산하고, 조건에 따라 지방교육세와 농어촌특별세를 별도 합산합니다.",
    example: "매매가 5억 원, 1주택 기본세율 1%로 단순 계산하면 취득세는 약 500만 원입니다.",
    caution: "주택 수, 지역, 취득 원인, 생애최초 감면, 일시적 2주택 여부, 법령 개정에 따라 실제 세액은 달라질 수 있습니다.",
    faqs: [
      { question: "취득세는 언제 내나요?", answer: "일반적으로 부동산을 취득한 뒤 법정 신고·납부 기한 내 신고하고 납부합니다." },
      { question: "생애최초 감면이 자동 적용되나요?", answer: "이 계산기는 단순 감면 한도만 반영합니다. 실제 감면 요건은 반드시 최신 법령과 지자체 기준을 확인해야 합니다." },
      { question: "지방교육세와 농어촌특별세도 포함되나요?", answer: "입력 옵션에 따라 별도 세목을 함께 추정해 총액을 표시합니다." },
      { question: "분양권도 같은가요?", answer: "취득 형태와 시기에 따라 다를 수 있어 별도 확인이 필요합니다." },
      { question: "실거래가와 과세표준이 항상 같은가요?", answer: "원칙적으로 취득가액이 기준이지만 특수 거래에서는 세무 판단이 달라질 수 있습니다." }
    ],
    relatedSlugs: ["brokerage-fee", "dsr", "housing-subscription-score"]
  },
  {
    slug: "brokerage-fee",
    path: "/real-estate-brokerage-fee-calculator",
    guidePath: "/guides/brokerage-fee-negotiation",
    title: "부동산 중개수수료 계산기",
    shortTitle: "중개수수료",
    category: "부동산·거래비용",
    description: "매매, 전세, 월세 계약 시 예상 부동산 중개보수와 부가세 포함 금액을 계산합니다.",
    keywords: ["부동산 중개수수료 계산기", "부동산 복비 계산", "전세 복비 계산"],
    formula: "중개보수는 거래금액 × 상한요율로 계산하며, 한도액이 있는 구간은 한도액을 초과하지 않도록 계산합니다.",
    example: "매매가 5억 원이고 상한요율이 0.4%이면 중개보수 상한은 200만 원, 부가세 10% 포함 시 220만 원입니다.",
    caution: "중개보수는 상한요율 내에서 협의할 수 있으며 지역, 거래 유형, 주택 여부에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "중개수수료와 중개보수는 같은 말인가요?", answer: "일상적으로는 복비, 중개수수료라고 부르지만 공식적으로는 중개보수라는 표현을 사용합니다." },
      { question: "월세 거래금액은 어떻게 계산하나요?", answer: "기본적으로 보증금 + 월세 × 100으로 환산하며, 일정 금액 미만에서는 별도 환산 배수를 적용합니다." },
      { question: "부가세도 내야 하나요?", answer: "중개업소의 과세 유형에 따라 부가세가 별도로 청구될 수 있어 부가세 포함 금액을 함께 보여줍니다." },
      { question: "상한요율이면 반드시 그만큼 내야 하나요?", answer: "아니요. 상한요율은 최대 범위이며 실제 요율은 협의할 수 있습니다." },
      { question: "오피스텔과 주택은 같은가요?", answer: "용도와 거래 유형에 따라 적용 규정이 달라질 수 있습니다." }
    ],
    relatedSlugs: ["acquisition-tax", "rent-vs-jeonse", "monthly-rent-conversion"]
  },
  {
    slug: "monthly-rent-conversion",
    path: "/monthly-rent-conversion-calculator",
    guidePath: "/guides/monthly-rent-conversion-basics",
    title: "월세 환산 계산기",
    shortTitle: "월세 환산",
    category: "주거·비교",
    description: "전세를 월세로 전환하거나 월세를 전세금으로 환산할 때 예상 금액을 계산합니다.",
    keywords: ["월세 환산 계산기", "전세 월세 전환 계산", "전월세 전환율 계산"],
    formula: "전세→월세는 (전세금 - 보증금) × 전월세전환율 ÷ 12로 계산합니다. 월세→전세는 보증금 + 월세 × 12 ÷ 전환율로 계산합니다.",
    example: "전세금 5억 원, 보증금 1억 원, 전환율 5%이면 월세는 약 166만 6,667원입니다.",
    caution: "실제 전월세 전환은 법정 상한, 시장 임대료, 계약 조건에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "전월세 전환율은 무엇인가요?", answer: "전세보증금 일부를 월세로 바꿀 때 적용하는 연 환산 비율입니다." },
      { question: "보증금을 높이면 월세가 줄어드나요?", answer: "네. 같은 전세금과 전환율이라면 보증금이 높아질수록 월세로 전환되는 금액이 줄어듭니다." },
      { question: "월세를 전세로도 환산할 수 있나요?", answer: "월세와 보증금, 전환율을 입력하면 전세 환산 금액을 계산할 수 있습니다." },
      { question: "전환율은 어디서 정하나요?", answer: "법정 상한과 시장 관행이 있지만 실제 계약은 당사자 협의가 중요합니다." },
      { question: "계산값이 시세와 다른 이유는 무엇인가요?", answer: "입지, 옵션, 수요, 계약기간 같은 시장 요소가 반영되지 않기 때문입니다." }
    ],
    relatedSlugs: ["rent-vs-jeonse", "jeonse-loan-interest", "brokerage-fee"]
  },
  {
    slug: "housing-subscription-score",
    path: "/housing-subscription-score-calculator",
    guidePath: "/guides/subscription-score-interpretation",
    title: "청약 가점 계산기",
    shortTitle: "청약 가점",
    category: "부동산·청약",
    description: "무주택기간, 부양가족수, 청약통장 가입기간을 기준으로 청약 가점을 계산합니다.",
    keywords: ["청약 가점 계산기", "청약 점수 계산", "무주택기간 계산"],
    formula: "청약가점 총점은 무주택기간 점수, 부양가족수 점수, 청약통장 가입기간 점수를 합산해 계산합니다.",
    example: "무주택기간 8년, 부양가족 2명, 청약통장 가입기간 10년이면 각 항목 점수를 합산해 총점을 계산합니다.",
    caution: "무주택기간 산정, 부양가족 인정, 청약통장 가입기간은 모집공고와 제도 기준에 따라 달라질 수 있습니다.",
    faqs: [
      { question: "청약가점 만점은 몇 점인가요?", answer: "일반적인 가점제 총점은 무주택기간 32점, 부양가족 35점, 청약통장 가입기간 17점으로 총 84점입니다." },
      { question: "무주택기간은 언제부터 계산하나요?", answer: "일반적으로 만 30세 이후부터 산정하며, 만 30세 이전에 혼인한 경우 혼인신고일부터 산정할 수 있습니다." },
      { question: "부양가족 수에 본인은 포함하나요?", answer: "일반적으로 부양가족 수는 본인을 제외하고 계산합니다." },
      { question: "세대 분리 여부도 중요한가요?", answer: "네. 세대구성과 주민등록 상태에 따라 인정 여부가 달라질 수 있습니다." },
      { question: "최종 점수는 어디 기준으로 확정되나요?", answer: "반드시 모집공고일 기준과 관련 기관 안내를 확인해야 합니다." }
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
