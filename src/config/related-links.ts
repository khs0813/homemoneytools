export type SeoRelatedLink = {
  href: string;
  title: string;
  description: string;
};

const seoRelatedLinksBySlug: Record<string, SeoRelatedLink[]> = {
  "jeonse-loan-interest": [
    {
      href: "/guides/100-million-jeonse-loan-interest",
      title: "1억 전세대출 월이자 기준",
      description: "1억 원 대출에서 금리별 월 이자와 2년 총이자를 확인합니다."
    },
    {
      href: "/guides/200-million-jeonse-loan-monthly-interest",
      title: "2억 전세대출 금리별 부담",
      description: "2억 원을 4%, 5%, 6% 금리로 빌렸을 때 월 부담을 비교합니다."
    },
    {
      href: "/rent-vs-jeonse-calculator",
      title: "전세와 월세 총비용 비교",
      description: "대출 이자와 보증금 기회비용을 월세 조건과 같은 기간으로 비교합니다."
    },
    {
      href: "/guides/monthly-rent-conversion-basics",
      title: "전월세 전환율 이해",
      description: "월세와 전세보증금을 서로 환산할 때 쓰는 기본 공식을 정리했습니다."
    }
  ],
  "monthly-rent-conversion": [
    {
      href: "/guides/monthly-rent-500k-to-jeonse",
      title: "월세 50만 원 전세 환산 예시",
      description: "월세 50만 원을 전환율별 전세금으로 바꿔 보는 기준을 설명합니다."
    },
    {
      href: "/guides/monthly-rent-conversion-basics",
      title: "전월세 전환 계산 기본",
      description: "보증금과 월세를 서로 바꿀 때 적용하는 계산 구조를 먼저 확인합니다."
    },
    {
      href: "/rent-vs-jeonse-calculator",
      title: "전환 후 총주거비 비교",
      description: "환산 금액만 보지 않고 실제 전세·월세 총비용을 함께 계산합니다."
    }
  ],
  "brokerage-fee": [
    {
      href: "/guides/brokerage-fee-negotiation",
      title: "중개보수 협의 전 확인할 것",
      description: "상한요율과 협의요율을 구분해 실제 복비 협상 기준을 잡습니다."
    },
    {
      href: "/acquisition-tax-calculator",
      title: "매수 초기비용 함께 계산",
      description: "중개보수와 함께 잔금 전 준비해야 할 취득세를 확인합니다."
    },
    {
      href: "/rent-vs-jeonse-calculator",
      title: "임대차 비용 비교",
      description: "전세와 월세 조건을 중개보수까지 포함해 같은 기간으로 비교합니다."
    }
  ],
  dsr: [
    {
      href: "/guides/what-dsr-40-means",
      title: "DSR 40% 기준 해설",
      description: "연소득 대비 연간 원리금 상환액이 어떤 의미인지 확인합니다."
    },
    {
      href: "/guides/salary-50-million-dsr",
      title: "연봉 5000만 원 DSR 예시",
      description: "연봉 5000만 원에서 DSR 40% 기준 상환 여력을 계산합니다."
    },
    {
      href: "/guides/salary-70-million-dsr-40",
      title: "연봉 7000만 원 DSR 점검",
      description: "기존 대출과 스트레스 금리가 주담대 여력에 미치는 영향을 봅니다."
    },
    {
      href: "/acquisition-tax-calculator",
      title: "대출 전 매수 세금 확인",
      description: "DSR이 맞아도 취득세와 초기 현금 필요액은 따로 계산해야 합니다."
    }
  ],
  "rent-vs-jeonse": [
    {
      href: "/jeonse-loan-interest-calculator",
      title: "전세대출 이자 먼저 계산",
      description: "전세 선택 시 월 이자와 총 금융비용을 따로 확인합니다."
    },
    {
      href: "/guides/jeonse-total-housing-cost",
      title: "전세 총주거비 해석",
      description: "전세가 월세보다 유리해 보일 때 빠뜨리기 쉬운 비용을 점검합니다."
    },
    {
      href: "/guides/monthly-rent-conversion-basics",
      title: "월세와 전세 환산 기준",
      description: "월세 조건을 전세금으로 환산해 비교하는 기본 원리를 봅니다."
    }
  ],
  "acquisition-tax": [
    {
      href: "/real-estate-brokerage-fee-calculator",
      title: "중개보수까지 초기비용 계산",
      description: "취득세 외 잔금 전 준비해야 할 부동산 거래비용을 함께 확인합니다."
    },
    {
      href: "/guides/600-million-apartment-acquisition-tax",
      title: "6억 아파트 취득세 예시",
      description: "6억 원 매수 사례에서 주택 수와 감면 여부를 점검합니다."
    },
    {
      href: "/guides/900-million-apartment-acquisition-tax",
      title: "9억 아파트 세금 체크",
      description: "조건 차이가 세금 부담에 미치는 영향을 사례로 확인합니다."
    }
  ],
  "housing-subscription-score": [
    {
      href: "/guides/subscription-score-interpretation",
      title: "청약가점 결과 해석",
      description: "점수 자체보다 현재 점수로 선택지를 어떻게 볼지 정리합니다."
    },
    {
      href: "/guides/subscription-account-period",
      title: "청약통장 가입기간 점수",
      description: "가입기간과 배우자 통장 가점 계산에서 주의할 점을 확인합니다."
    },
    {
      href: "/guides/subscription-score-vs-buy-or-rent",
      title: "청약과 매수·전세 비교",
      description: "기다리는 전략과 현재 주거 선택을 자금계획과 함께 봅니다."
    }
  ]
};

export function getSeoRelatedLinks(slug: string): SeoRelatedLink[] {
  return seoRelatedLinksBySlug[slug] ?? [];
}
