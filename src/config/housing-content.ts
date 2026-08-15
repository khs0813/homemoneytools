export type OfficialSource = {
  title: string;
  url: string;
  note: string;
};

export type DecisionCard = {
  title: string;
  description: string;
};

export type ScenarioRow = {
  scenario: string;
  focus: string;
  meaning: string;
};

export type HousingReferenceContent = {
  referenceDate: string;
  decisionCards: DecisionCard[];
  riskChecks: string[];
  caseStudies: string[];
  scenarioTable: ScenarioRow[];
  policyNotes: string[];
  officialSources: OfficialSource[];
};

export const housingCalculatorSlugs = [
  "jeonse-loan-interest",
  "rent-vs-jeonse",
  "dsr",
  "acquisition-tax",
  "brokerage-fee",
  "monthly-rent-conversion",
  "home-purchase-total-cost",
  "housing-subscription-score"
] as const;

export const housingReferenceBySlug: Record<string, HousingReferenceContent> = {
  "jeonse-loan-interest": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "월 부담액 확인",
        description: "월 이자만 낮다고 안심하면 안 됩니다. 전세대출은 만기일시상환이 많아 월 부담은 낮아 보여도 만기 원금 상환 계획이 없다면 실제 위험은 더 큽니다."
      },
      {
        title: "총비용 비교",
        description: "같은 대출금액이라도 상환방식에 따라 총이자가 달라집니다. 원리금균등, 원금균등, 만기일시상환을 한 번에 비교해 총 주거비를 판단해야 합니다."
      },
      {
        title: "금리 변동 영향",
        description: "금리가 0.5%p만 올라가도 월 이자와 총 이자가 동시에 커집니다. 현재 금리뿐 아니라 0.5%p, 1%p 상승 시나리오를 함께 보는 것이 안전합니다."
      },
      {
        title: "위험 구간",
        description: "전세보증금 대비 대출비율이 높고 실수령 소득 대비 월 이자 비중이 커질수록 계약 유지 위험이 올라갑니다. 월세 대안과 반드시 같이 비교해야 합니다."
      }
    ],
    riskChecks: [
      "대출금액이 전세보증금의 큰 비중을 차지하면 금리 상승에 매우 민감합니다.",
      "보증료와 중도상환수수료를 빼면 실제 체감비용을 과소평가하게 됩니다.",
      "전세 만기 시 보증금 반환 일정과 대출 상환 일정을 함께 점검해야 합니다."
    ],
    caseStudies: [
      "전세보증금 4억 원, 대출 2억 원, 금리 4.2%라면 월 이자는 약 70만 원 수준이지만 보증료와 이사비를 합치면 체감 주거비는 더 커집니다.",
      "같은 조건에서 금리가 5.2%로 오르면 월 이자가 약 16만 원 이상 늘어 실수령액 대비 부담이 빠르게 커질 수 있습니다."
    ],
    scenarioTable: [
      {
        scenario: "대출 2억 원 · 연 4.2%",
        focus: "현재 월 이자와 보증료",
        meaning: "월 이자만 보는 대신 보증료와 만기상환 부담까지 합쳐야 실제 전세 유지비가 보입니다."
      },
      {
        scenario: "금리 0.5%p 상승",
        focus: "월 현금흐름 악화폭",
        meaning: "소득 대비 여유가 적은 가구는 작은 금리 상승도 곧바로 계약 유지 위험으로 이어질 수 있습니다."
      },
      {
        scenario: "만기일시상환 선택",
        focus: "만기 원금 상환 재원",
        meaning: "월 부담은 낮아도 만기 재계약이나 상환 계획이 없다면 가장 위험한 구조가 될 수 있습니다."
      }
    ],
    policyNotes: [
      "버팀목·보증부 전세대출은 상품별 한도, 소득 기준, 임차보증금 기준이 다릅니다.",
      "전세자금보증은 주택금융공사, HUG 등 보증기관 기준과 금융기관 심사 기준을 함께 확인해야 합니다."
    ],
    officialSources: [
      {
        title: "주택도시기금 버팀목전세자금 FAQ",
        url: "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020103.jsp?gotoPage=1",
        note: "전세자금대출 대상 주택, 취급 제한 사유, 제출서류 확인용"
      },
      {
        title: "한국주택금융공사 전세자금보증 찾기",
        url: "https://www.hf.go.kr/ko/sub02/sub02_01_01.do",
        note: "보증 대상, 보증한도, 이용 가능한 보증 유형 확인용"
      }
    ]
  },
  "rent-vs-jeonse": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "월 부담액 확인",
        description: "월세는 월 임대료가 바로 보이지만, 전세는 보증금 기회비용과 전세대출 이자가 숨어 있습니다. 둘 다 월 기준 현금흐름으로 바꿔 보는 것이 핵심입니다."
      },
      {
        title: "총비용 비교",
        description: "2년 계약이라면 2년 전체 비용을 기준으로 봐야 합니다. 월세 총액, 전세대출 이자, 보증금 기회비용, 이사비용까지 합치면 직감과 다른 결론이 나올 수 있습니다."
      },
      {
        title: "금리 변동 영향",
        description: "예금금리와 전세대출금리가 모두 바뀌면 전세와 월세의 유불리가 달라집니다. 저금리기에는 전세가, 고금리기에는 월세가 상대적으로 유리해질 수 있습니다."
      },
      {
        title: "위험 구간",
        description: "전세대출 의존도가 높고 보증금 반환 위험이 있는 지역이라면 숫자상 유리해 보여도 전세 선택 리스크가 커질 수 있습니다."
      }
    ],
    riskChecks: [
      "전세보증금 기회비용을 0원처럼 보면 전세가 과도하게 유리해 보입니다.",
      "월세보증금이 큰 반전세는 단순 월세만으로 비교하면 왜곡됩니다.",
      "계약기간 중 월세 상승이나 재계약 조건이 있다면 별도 보수적 가정이 필요합니다."
    ],
    caseStudies: [
      "전세 5억 원, 월세 보증금 1억 원·월세 120만 원 조건은 2년 총주거비로 환산했을 때 생각보다 차이가 작을 수 있습니다.",
      "전세대출 3억 원 이상을 쓰는 경우 금리 1%p 상승만으로 월세보다 전세가 불리해지는 구간이 생길 수 있습니다."
    ],
    scenarioTable: [
      {
        scenario: "전세 5억 원 vs 보증금 1억 원·월세 120만 원",
        focus: "2년 총주거비 비교",
        meaning: "겉보기 월세 부담보다 전세 기회비용과 대출이자를 합친 총비용이 더 중요합니다."
      },
      {
        scenario: "고금리 구간",
        focus: "전세대출 이자 민감도",
        meaning: "대출 비중이 높을수록 전세의 장점이 약해지고 월세가 더 안전한 선택이 될 수 있습니다."
      },
      {
        scenario: "반전세",
        focus: "큰 보증금 + 월세 동시 부담",
        meaning: "보증금 기회비용을 빼면 반전세가 실제보다 저렴하게 보일 수 있습니다."
      }
    ],
    policyNotes: [
      "월세와 전세 비교는 단순 가격이 아니라 기회비용과 금융비용을 함께 보는 의사결정입니다.",
      "전세사기 위험, 보증보험 가능 여부, 거주 안정성은 숫자로 환산하기 어려운 별도 판단 요소입니다."
    ],
    officialSources: [
      {
        title: "주택임대차보호법",
        url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=93190",
        note: "주택 임대차의 기본 제도와 계약갱신·월차임 전환의 법적 근거 확인용"
      },
      {
        title: "국토교통부 부동산대책 정보사이트 정책풀이집",
        url: "https://www.molit.go.kr/policy/rent/rent_f_02.jsp",
        note: "전월세 전환과 계약갱신 관련 정책 설명 확인용"
      }
    ]
  },
  dsr: {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "예상 DSR 확인",
        description: "월 납입액이 버틸 만해 보여도 기존 신용대출, 자동차 할부, 기타 대출이 함께 있으면 DSR은 빠르게 높아질 수 있습니다."
      },
      {
        title: "상환 여력 확인",
        description: "대출기간을 늘리면 월 부담은 낮아지지만 총이자는 커질 수 있습니다. DSR을 맞추기 위해 기간을 늘릴 때 총비용을 같이 봐야 합니다."
      },
      {
        title: "금리 변동 영향",
        description: "스트레스 DSR은 미래 금리 상승을 반영해 보는 장치입니다. 현재 DSR만 안전해도 스트레스 금리를 적용하면 위험 구간으로 들어갈 수 있습니다."
      },
      {
        title: "기준 초과 구간",
        description: "차주단위 DSR 한도 근처에서는 금리 0.5%p 상승, 기존대출 증가, 소득변동만으로도 승인 가능성이 달라질 수 있습니다."
      }
    ],
    riskChecks: [
      "주담대만 보고 기존 신용대출 상환액을 누락하면 실제 심사와 차이가 커집니다.",
      "실수령액이 아니라 연소득 기준이라는 점을 구분해야 합니다.",
      "규제 기준은 금융권, 상품, 정책 변경에 따라 달라질 수 있습니다."
    ],
    caseStudies: [
      "연소득 7천만 원, 총 연 상환액 2,100만 원이면 DSR은 30% 수준이지만 기존대출이 조금만 늘어도 기준선에 가까워질 수 있습니다.",
      "주담대 금리가 상승하면 월 납입액뿐 아니라 연간 원리금 상환액이 커져 추가대출 여력이 줄어듭니다."
    ],
    scenarioTable: [
      {
        scenario: "연소득 7천만 원 · 연 상환액 2,100만 원",
        focus: "현재 DSR 30%",
        meaning: "수치상 여유가 있어 보여도 기존대출 증가와 스트레스 금리를 같이 봐야 실제 승인 감각이 맞습니다."
      },
      {
        scenario: "신용대출 추가 보유",
        focus: "분모는 같고 분자만 증가",
        meaning: "신규 주담대가 아닌 기존 부채 때문에 한도가 예상보다 빨리 줄어드는 구간입니다."
      },
      {
        scenario: "주담대 금리 상승",
        focus: "연간 원리금 상환액 증가",
        meaning: "승인 가능 여부와 별개로 추가대출 여력과 생활비 압박이 동시에 커질 수 있습니다."
      }
    ],
    policyNotes: [
      "DSR은 차주의 상환능력을 보기 위한 지표이지, 집값 적정성을 직접 판단하는 수치는 아닙니다.",
      "스트레스 DSR 제도는 시기별 단계 적용과 가산 방식이 달라질 수 있습니다."
    ],
    officialSources: [
      {
        title: "금융위원회 2026년도 스트레스 DSR 운영방향",
        url: "https://www.fsc.go.kr/no010101/85824?curPage=&srchBeginDt=&srchCtgry=&srchEndDt=&srchKey=&srchText=DSR",
        note: "수도권·규제지역 주담대와 지방 주담대의 스트레스 금리 적용 방향 확인용"
      },
      {
        title: "기획재정부 이렇게 달라집니다 - DSR 규제 설명",
        url: "https://whatsnew.moef.go.kr/mec/ots/dif/view.do?comBaseCd=DIFTYPCD&difField1=DIFFIELD05&difSer=db7e3d8b-ba55-463d-89d2-047f5fd3a50d&temp=2022&temp2=HALF002",
        note: "차주단위 DSR 40% 적용 설명 확인용"
      }
    ]
  },
  "acquisition-tax": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "잔금 현금 준비",
        description: "취득세는 월 납입금이 아니라 잔금 시점에 한 번에 필요한 현금입니다. 대출과 별개로 준비해야 하는 초기 자금으로 봐야 합니다."
      },
      {
        title: "부가 세목 확인",
        description: "매매가만 볼 것이 아니라 취득세, 법무비, 중개보수까지 합쳐 총 취득비용을 봐야 실제 필요한 자기자본이 나옵니다."
      },
      {
        title: "감면 전후 차이",
        description: "생애최초 감면이 적용되면 취득세 본세가 줄어들 수 있지만, 요건을 충족하지 못하면 감면 전 세액을 준비해야 합니다."
      },
      {
        title: "예외 조건 확인",
        description: "주택 수 판단, 조정대상지역 여부, 생애최초 감면 요건을 잘못 이해하면 세액 오차가 크게 발생할 수 있습니다."
      }
    ],
    riskChecks: [
      "취득세만 보고 지방교육세와 농어촌특별세를 누락하기 쉽습니다.",
      "일시적 2주택, 상속, 증여는 단순 매매와 다르게 봐야 합니다.",
      "감면 요건은 자동 적용이 아니라 충족 여부 확인이 필요합니다."
    ],
    caseStudies: [
      "5억 원 주택이라도 1주택 기본세율과 중과 대상 여부에 따라 실제 세금 차이가 매우 커질 수 있습니다.",
      "생애최초 감면을 기대하고 예산을 짰다가 요건 미충족이면 잔금 자금계획이 흔들릴 수 있습니다."
    ],
    scenarioTable: [
      {
        scenario: "5억 원 주택 · 1주택 기본세율",
        focus: "기본 취득세와 부가세목",
        meaning: "매매가만 맞춰도 취득세와 지방교육세까지 합치면 초기 현금 필요액이 커집니다."
      },
      {
        scenario: "다주택 또는 중과 가능성",
        focus: "주택 수 판정",
        meaning: "주택 수 해석이 달라지면 세율 자체가 바뀌므로 예산 오차가 크게 벌어집니다."
      },
      {
        scenario: "생애최초 감면 기대",
        focus: "요건 충족 여부",
        meaning: "감면 전제 자금계획은 위험하므로 요건 확인 전에는 보수적으로 계산해야 합니다."
      }
    ],
    policyNotes: [
      "취득세는 지방세이므로 지자체 실무 안내와 위택스·정부24 계산 안내를 함께 확인하는 것이 안전합니다.",
      "법령 개정 시 세율, 감면 한도, 적용요건이 변할 수 있습니다."
    ],
    officialSources: [
      {
        title: "국가법령정보센터 지방세법",
        url: "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1031175465",
        note: "주택 취득세 세율, 세율 특례, 조례에 따른 가감 가능성 확인용"
      },
      {
        title: "국가법령정보센터 지방세특례제한법 제36조의3",
        url: "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029506977",
        note: "생애최초 주택 구입 취득세 감면 요건과 한도 확인용"
      }
    ]
  },
  "brokerage-fee": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "계약 시 지급액",
        description: "중개보수는 계약 시점 비용이라 월 부담으로 보이지 않지만, 이사 총비용에서는 무시하기 어려운 일회성 지출입니다."
      },
      {
        title: "상한요율과 협의요율",
        description: "거래금액이 커질수록 작은 요율 차이도 수십만 원 이상 차이를 만듭니다. 상한요율과 실제 협의요율을 함께 비교해야 합니다."
      },
      {
        title: "부가세 포함 여부",
        description: "협의한 중개보수에 부가세를 더해 청구하는지 확인해야 실제 지급 예상액을 정확히 준비할 수 있습니다."
      },
      {
        title: "월세 환산 거래금액",
        description: "월세 거래는 보증금과 월세를 환산한 거래금액 기준이어서 보증금만 보고 계산하면 오차가 큽니다."
      }
    ],
    riskChecks: [
      "상한요율을 고정요율로 오해하는 경우가 많습니다.",
      "부가세 포함 여부를 확인하지 않으면 현금 준비가 부족해질 수 있습니다.",
      "주택 외 부동산은 다른 기준이 적용될 수 있습니다."
    ],
    caseStudies: [
      "매매가 5억 원에서는 0.1%p만 차이나도 중개보수 금액이 크게 달라질 수 있습니다.",
      "월세 보증금이 크고 월세가 높은 반전세는 환산거래금액 기준으로 체감보다 중개보수가 커질 수 있습니다."
    ],
    scenarioTable: [
      {
        scenario: "매매가 5억 원",
        focus: "상한요율 vs 실제 협의요율",
        meaning: "요율 차이가 작아 보여도 절대 금액은 수십만 원 이상 벌어질 수 있습니다."
      },
      {
        scenario: "반전세 계약",
        focus: "환산거래금액 계산",
        meaning: "보증금만 보고 판단하면 중개보수를 과소평가하기 쉽습니다."
      },
      {
        scenario: "부가세 별도 청구",
        focus: "최종 현금 준비액",
        meaning: "협의요율이 낮아도 부가세 포함 여부에 따라 최종 지출은 달라질 수 있습니다."
      }
    ],
    policyNotes: [
      "중개보수는 상한 범위 안에서 협의가 가능합니다.",
      "개업공인중개사는 관련 요율표를 게시해야 하며, 실제 적용 요율과 부가세 여부를 계약 전 확인하는 것이 좋습니다."
    ],
    officialSources: [
      {
        title: "서울부동산정보광장 부동산 중개보수 안내",
        url: "https://land.seoul.go.kr/land/broker/brokerageCommission.do",
        note: "주택 거래금액별 상한요율과 한도액 확인용"
      },
      {
        title: "공인중개사법 시행규칙 제20조 안내 참고",
        url: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=260406",
        note: "중개보수 요율 게시·설명 의무 관련 법령 확인용"
      }
    ]
  },
  "monthly-rent-conversion": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "월 부담액 확인",
        description: "보증금을 줄일수록 월세가 늘고, 보증금을 늘릴수록 월세가 줄어듭니다. 결국 내 현금 보유력과 월 지출 여력 사이 균형을 잡는 계산입니다."
      },
      {
        title: "총비용 비교",
        description: "월세를 줄였다고 유리한 것이 아니라 추가 보증금의 기회비용까지 포함해 총 주거비를 비교해야 합니다."
      },
      {
        title: "금리 변동 영향",
        description: "전환율 판단은 금리 환경과 밀접합니다. 금리가 높아질수록 추가 보증금을 묶는 비용도 커집니다."
      },
      {
        title: "위험 구간",
        description: "법정 전환율 상한과 시장 전환율이 다를 수 있으므로 계산값을 바로 계약 적정가로 받아들이면 안 됩니다."
      }
    ],
    riskChecks: [
      "전환율을 연 기준이 아니라 월 기준으로 잘못 넣는 경우가 많습니다.",
      "보증금 차액이 아닌 전체 전세금에 단순 적용하면 계산이 왜곡됩니다.",
      "시장 시세와 옵션 가치를 함께 보지 않으면 계약 판단이 엇갈릴 수 있습니다."
    ],
    caseStudies: [
      "전세금 5억 원, 보증금 1억 원, 전환율 5%라면 월세는 약 166만 원 수준으로 계산됩니다.",
      "보증금을 5천만 원 더 넣고 월세가 20만 원 줄어든다면, 그 절감이 자금 기회비용보다 큰지 비교해야 합니다."
    ],
    scenarioTable: [
      {
        scenario: "전세금 5억 원 · 보증금 1억 원 · 전환율 5%",
        focus: "월세 환산액",
        meaning: "전환율 기준 월세가 주변 시세와 크게 다르면 협상 여지가 있는지 확인할 수 있습니다."
      },
      {
        scenario: "보증금 5천만 원 추가",
        focus: "월세 절감액 vs 기회비용",
        meaning: "줄어든 월세가 묶이는 자금의 기대수익보다 커야 보증금 증액이 합리적입니다."
      },
      {
        scenario: "시장금리 상승기",
        focus: "전환율 체감 변화",
        meaning: "같은 월세 절감이라도 보증금을 더 넣는 선택이 이전보다 덜 유리해질 수 있습니다."
      }
    ],
    policyNotes: [
      "법정 월차임 전환율 상한은 임차인 보호 장치이지만 실제 시장 전환은 지역·주택 상태·수요에 따라 달라집니다.",
      "계약갱신과 신규계약은 협상 구조가 다를 수 있습니다."
    ],
    officialSources: [
      {
        title: "주택임대차보호법",
        url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=93190",
        note: "월차임 전환 관련 법적 근거 확인용"
      },
      {
        title: "한국은행 기준금리 추이",
        url: "https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=2006",
        note: "월차임 전환율 상한 산정에 필요한 기준금리 확인용"
      }
    ]
  },
  "housing-subscription-score": {
    referenceDate: "2026-06-03",
    decisionCards: [
      {
        title: "항목별 점수 확인",
        description: "무주택기간, 부양가족 수, 청약통장 가입기간을 분리해 봐야 총점이 어디에서 부족한지 확인할 수 있습니다."
      },
      {
        title: "청약 전략 판단",
        description: "점수가 낮으면 무리하게 청약을 기다리기보다 전세·매매·월세 대안을 함께 비교해야 합니다. 점수 해석은 다른 주거비 결정과 연결됩니다."
      },
      {
        title: "당첨 이후 자금 계획",
        description: "청약가점은 당첨 가능성을 보는 입력값입니다. 당첨 이후 필요한 계약금, 중도금, 잔금 계획은 별도 계산으로 확인해야 합니다."
      },
      {
        title: "입력값 검증",
        description: "무주택기간 산정, 부양가족 인정 여부, 통장 가입기간 계산을 잘못 이해하면 예상 점수와 실제 점수 차이가 크게 납니다."
      }
    ],
    riskChecks: [
      "만 30세 이전 무주택기간 산정 기준을 잘못 적용하기 쉽습니다.",
      "부양가족 수에 본인을 포함하면 오차가 생깁니다.",
      "입주자모집공고일 기준으로 다시 계산하지 않으면 실제 신청 점수와 차이가 납니다."
    ],
    caseStudies: [
      "무주택기간이 길어도 부양가족 점수가 낮으면 기대보다 총점이 높지 않을 수 있습니다.",
      "통장 가입기간은 충분하지만 무주택기간이 짧은 경우 청약 시점을 늦추는 전략이 더 유리할 수 있습니다."
    ],
    scenarioTable: [
      {
        scenario: "무주택기간 길고 부양가족 적음",
        focus: "항목별 점수 불균형",
        meaning: "총점만 보지 말고 어떤 항목이 약한지 봐야 당첨 가능성을 현실적으로 해석할 수 있습니다."
      },
      {
        scenario: "가입기간 충분 · 무주택기간 짧음",
        focus: "대기 전략 여부",
        meaning: "지금 청약할지, 전세나 매수와 병행할지 판단할 때 점수 성장 여지를 같이 봐야 합니다."
      },
      {
        scenario: "공고일 직전 가족 구성 변화",
        focus: "부양가족 인정 여부",
        meaning: "실제 모집공고 기준일에 따라 예상 점수와 신청 가능 점수가 달라질 수 있습니다."
      }
    ],
    policyNotes: [
      "민영주택 일반공급 가점제는 무주택기간 32점, 부양가족수 35점, 청약통장 가입기간 17점 구조를 기본으로 봅니다.",
      "최종 적용은 모집공고문과 주택공급에 관한 규칙 기준을 우선해야 합니다."
    ],
    officialSources: [
      {
        title: "주택도시기금 청약가점빠른계산기",
        url: "https://nhuf.molit.go.kr/FP/FP07/FP0702/FP070210.jsp",
        note: "무주택기간·부양가족수·가입기간 기본 구조 확인용"
      },
      {
        title: "국가법령정보센터 - 주택공급에 관한 규칙 [별표1] 가점제 적용기준",
        url: "https://www.law.go.kr/flDownload.do?flSeq=102470549&gubun=",
        note: "가점제 세부 산정기준 확인용"
      }
    ]
  }
};

export function isHousingCalculator(slug: string): boolean {
  return housingCalculatorSlugs.includes(slug as (typeof housingCalculatorSlugs)[number]);
}
