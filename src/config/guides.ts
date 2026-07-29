import type { FAQ } from "@/config/calculators";
import type { OfficialSource } from "@/config/housing-content";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  path: string;
  h1: string;
  category: string;
  officialSources: OfficialSource[];
  policySummary: string[];
  body: Array<{
    heading: string;
    paragraphs: string[];
    subheadings?: Array<{ heading: string; paragraphs: string[] }>;
  }>;
  faqs: FAQ[];
  relatedCalculatorSlugs: string[];
};

const situationalGuides: Guide[] = [
  {
    slug: "100-million-jeonse-loan-interest",
    path: "/guides/100-million-jeonse-loan-interest",
    title: "전세대출 1억 이자 계산: 월 부담은 얼마일까",
    h1: "전세대출 1억 이자 계산: 월 부담은 얼마일까",
    category: "전세대출 상황별 가이드",
    description: "전세대출 1억 원을 금리별로 빌렸을 때 월 이자와 총이자가 어떻게 달라지는지 계산 전 확인할 기준을 정리했습니다.",
    officialSources: [
      { title: "주택도시기금 버팀목전세자금 FAQ", url: "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020103.jsp?gotoPage=1", note: "전세자금대출 상품 조건 확인용" },
      { title: "한국주택금융공사 전세자금보증", url: "https://www.hf.go.kr/ko/sub02/sub02_01_01.do", note: "보증 구조와 한도 확인용" }
    ],
    policySummary: ["1억 전세대출은 금리 1%p 차이만으로 월 이자가 약 8만 3천 원 달라집니다.", "월 이자 외 보증료와 만기 원금 상환 계획을 함께 봐야 합니다."],
    body: [
      { heading: "1억 전세대출 월 이자 계산법", paragraphs: ["만기일시상환 기준 월 이자는 대출금액에 연이율을 곱한 뒤 12로 나눕니다. 예를 들어 1억 원을 연 4.8%로 빌리면 월 이자는 약 40만 원입니다.", "금리가 3.5%라면 월 약 29만 원, 5.5%라면 월 약 45만 8천 원 수준으로 올라갑니다. 전세대출 1억은 작아 보일 수 있지만 금리 변동에 따른 현금흐름 차이는 분명합니다."] },
      { heading: "총이자와 보증료를 같이 봐야 하는 이유", paragraphs: ["2년 계약이라면 월 이자에 24개월을 곱한 총이자를 봐야 합니다. 월 40만 원이면 2년 총이자는 960만 원입니다.", "보증료가 붙는 상품은 실제 총비용이 더 커질 수 있습니다. 전세대출 이자 계산기에서 보증료율과 금리 상승 시나리오를 같이 넣어 보는 편이 안전합니다."] },
      { heading: "월세와 비교할 때의 기준", paragraphs: ["전세대출 1억 월 이자가 40만 원이라면 단순히 월세 40만 원과 비교하면 안 됩니다. 자기자본으로 넣은 보증금의 기회비용도 함께 계산해야 합니다.", "월세와 전세 중 무엇이 유리한지는 전세보증금 전체, 대출비율, 예금금리, 실제 월세 조건을 같은 기간으로 맞춰 비교해야 판단할 수 있습니다."] }
    ],
    faqs: [
      { question: "전세대출 1억이면 월 이자가 얼마인가요?", answer: "만기일시상환 기준으로 연 4.8%라면 월 약 40만 원입니다. 금리별로 결과가 달라집니다." },
      { question: "전세대출 1억 총이자는 어떻게 보나요?", answer: "월 이자에 계약기간 개월 수를 곱해 봅니다. 2년이면 월 이자 × 24개월입니다." },
      { question: "보증료도 꼭 넣어야 하나요?", answer: "상품에 따라 보증료가 붙을 수 있으므로 총비용 관점에서는 함께 보는 것이 좋습니다." },
      { question: "월세 40만 원과 바로 비교해도 되나요?", answer: "아니요. 전세보증금 기회비용까지 포함해야 공정한 비교가 됩니다." },
      { question: "어떤 계산기를 같이 쓰면 좋나요?", answer: "전세대출 이자 계산기와 월세 vs 전세 비교 계산기를 함께 쓰는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["jeonse-loan-interest", "rent-vs-jeonse", "monthly-rent-conversion"]
  },
  {
    slug: "200-million-jeonse-loan-monthly-interest",
    path: "/guides/200-million-jeonse-loan-monthly-interest",
    title: "전세대출 2억 월이자: 금리별 부담 비교",
    h1: "전세대출 2억 월이자: 금리별 부담 비교",
    category: "전세대출 상황별 가이드",
    description: "전세대출 2억 원의 월이자를 금리별로 비교하고, 2년 총이자와 월세 대안 비교 시 주의할 점을 정리했습니다.",
    officialSources: [
      { title: "주택도시기금 버팀목전세자금 FAQ", url: "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020103.jsp?gotoPage=1", note: "전세자금대출 조건 확인용" },
      { title: "한국주택금융공사 전세자금보증", url: "https://www.hf.go.kr/ko/sub02/sub02_01_01.do", note: "보증 가능성 확인용" }
    ],
    policySummary: ["2억 전세대출은 금리 1%p 상승 시 월 이자가 약 16만 7천 원 늘어납니다.", "월이자만 낮게 보지 말고 2년 총이자와 보증료를 함께 봐야 합니다."],
    body: [
      { heading: "2억 전세대출 금리별 월이자", paragraphs: ["만기일시상환 기준으로 2억 원을 연 4%로 빌리면 월이자는 약 66만 7천 원입니다. 연 5%라면 약 83만 3천 원, 연 6%라면 100만 원입니다.", "같은 2억이라도 금리 1%p 차이가 월 16만 원 이상 차이를 만들기 때문에 전세 계약 전 여러 금리 시나리오를 보는 것이 필수입니다."] },
      { heading: "2년 총비용으로 다시 보기", paragraphs: ["월이자 83만 원은 2년 기준 약 2천만 원의 이자 부담이 됩니다. 여기에 보증료, 이사비, 중개보수까지 더하면 체감 비용은 더 커집니다.", "전세대출 2억은 월세 대안과 비교할 때 단순 월이자만 보면 전세가 과도하게 유리해 보일 수 있습니다."] },
      { heading: "위험 구간 체크", paragraphs: ["실수령 소득 대비 월이자가 높거나, 만기 원금 상환 계획이 없다면 금리 상승기에 부담이 커질 수 있습니다.", "전세보증금 반환 위험과 보증보험 가능 여부도 숫자와 별도로 점검해야 합니다."] }
    ],
    faqs: [
      { question: "전세대출 2억 5% 월이자는 얼마인가요?", answer: "만기일시상환 기준 월 약 83만 3천 원입니다." },
      { question: "전세대출 2억 6% 월이자는 얼마인가요?", answer: "만기일시상환 기준 월 약 100만 원입니다." },
      { question: "2년 총이자는 어떻게 계산하나요?", answer: "월이자에 24개월을 곱하면 대략적인 2년 총이자를 볼 수 있습니다." },
      { question: "전세대출 2억이면 월세보다 유리한가요?", answer: "금리, 자기자본 기회비용, 월세 조건에 따라 다르므로 같은 기간 총비용으로 비교해야 합니다." },
      { question: "관련 계산기는 무엇인가요?", answer: "전세대출 이자 계산기와 월세 vs 전세 비교 계산기를 같이 확인하세요." }
    ],
    relatedCalculatorSlugs: ["jeonse-loan-interest", "rent-vs-jeonse", "brokerage-fee"]
  },
  {
    slug: "salary-50-million-dsr",
    path: "/guides/salary-50-million-dsr",
    title: "연봉 5000 DSR 계산: 주담대 한도 점검 순서",
    h1: "연봉 5000 DSR 계산: 주담대 한도 점검 순서",
    category: "DSR 상황별 가이드",
    description: "연봉 5000만 원 기준 DSR 40% 한도에서 연간 원리금 상환 가능액과 주담대 계산 시 확인할 항목을 정리했습니다.",
    officialSources: [
      { title: "금융위원회 스트레스 DSR 제도 설명", url: "https://www.fsc.go.kr/po010101/81343?curPage=&srchBeginDt=&srchCtgry=1&srchEndDt=&srchKey=&srchText=", note: "스트레스 DSR 설명 확인용" },
      { title: "기획재정부 DSR 규제 설명", url: "https://whatsnew.moef.go.kr/mec/ots/dif/view.do?comBaseCd=DIFTYPCD&difField1=DIFFIELD05&difSer=db7e3d8b-ba55-463d-89d2-047f5fd3a50d&temp=2022&temp2=HALF002", note: "차주단위 DSR 개요 확인용" }
    ],
    policySummary: ["연봉 5000만 원의 DSR 40%는 연간 원리금 2000만 원 수준입니다.", "기존 신용대출이 있으면 신규 주담대 여력은 그만큼 줄어듭니다."],
    body: [
      { heading: "연봉 5000 DSR 40%의 의미", paragraphs: ["연봉 5000만 원에서 DSR 40%를 적용하면 모든 대출의 연간 원리금 상환액 합계가 2000만 원 이내인지 확인하게 됩니다. 월평균으로는 약 166만 원 수준입니다.", "이 금액에는 신규 주담대뿐 아니라 기존 신용대출, 자동차 할부, 기타 대출 상환액이 함께 들어갈 수 있습니다."] },
      { heading: "주담대 한도 계산 전 확인할 것", paragraphs: ["먼저 기존대출의 연간 상환액을 정리해야 합니다. 이미 연 400만 원을 갚고 있다면 신규 주담대가 사용할 수 있는 DSR 여력은 1600만 원 수준으로 줄어듭니다.", "그다음 주담대 금리, 기간, 스트레스 금리를 넣어 예상 연상환액을 계산합니다. 기간을 길게 잡으면 월 부담은 낮아지지만 총이자는 커질 수 있습니다."] },
      { heading: "승인 가능성과 생활 가능성은 다르다", paragraphs: ["DSR 기준에 들어와도 실제 실수령액 기준 생활비가 빠듯하면 위험할 수 있습니다. 연봉 5000만 원은 세후 월 현금흐름과 주거비, 관리비, 생활비를 함께 봐야 합니다.", "따라서 DSR 계산 결과는 대출 가능성 점검용이고, 최종 결정은 월 현금흐름 기준으로 다시 검토해야 합니다."] }
    ],
    faqs: [
      { question: "연봉 5000 DSR 40%는 얼마인가요?", answer: "연간 원리금 상환액 약 2000만 원, 월평균 약 166만 원 수준입니다." },
      { question: "기존 신용대출도 포함되나요?", answer: "네. 기존대출 상환액이 있으면 신규 주담대 여력이 줄어들 수 있습니다." },
      { question: "스트레스 금리는 왜 넣나요?", answer: "향후 금리 상승을 반영해 더 보수적으로 상환능력을 보기 위해서입니다." },
      { question: "DSR 40% 이하면 대출이 확정되나요?", answer: "아니요. 담보가치, 신용도, 금융기관 기준도 함께 적용됩니다." },
      { question: "같이 볼 계산기는 무엇인가요?", answer: "DSR 계산기와 실수령액 계산기, 취득세 계산기를 함께 확인하는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["dsr", "take-home-pay", "acquisition-tax"]
  },
  {
    slug: "salary-70-million-dsr-40",
    path: "/guides/salary-70-million-dsr-40",
    title: "연봉 7000 DSR 40% 계산: 주담대 여력 보기",
    h1: "연봉 7000 DSR 40% 계산: 주담대 여력 보기",
    category: "DSR 상황별 가이드",
    description: "연봉 7000만 원에서 DSR 40% 기준 연간 원리금 한도와 기존대출, 스트레스 금리 반영 시 달라지는 주담대 여력을 설명합니다.",
    officialSources: [
      { title: "금융위원회 스트레스 DSR 제도 설명", url: "https://www.fsc.go.kr/po010101/81343?curPage=&srchBeginDt=&srchCtgry=1&srchEndDt=&srchKey=&srchText=", note: "스트레스 DSR 설명 확인용" },
      { title: "기획재정부 DSR 규제 설명", url: "https://whatsnew.moef.go.kr/mec/ots/dif/view.do?comBaseCd=DIFTYPCD&difField1=DIFFIELD05&difSer=db7e3d8b-ba55-463d-89d2-047f5fd3a50d&temp=2022&temp2=HALF002", note: "차주단위 DSR 개요 확인용" }
    ],
    policySummary: ["연봉 7000만 원의 DSR 40%는 연간 원리금 2800만 원 수준입니다.", "스트레스 금리와 기존대출이 있으면 체감 한도는 줄어들 수 있습니다."],
    body: [
      { heading: "연봉 7000 DSR 40% 기준", paragraphs: ["연봉 7000만 원에 DSR 40%를 적용하면 연간 원리금 상환 가능액은 약 2800만 원입니다. 월평균으로는 약 233만 원입니다.", "이 숫자는 신규 주담대 하나만을 위한 한도가 아니라 모든 대출 상환액의 합계 기준입니다."] },
      { heading: "스트레스 금리 반영 시 달라지는 점", paragraphs: ["스트레스 금리를 적용하면 같은 대출금액이라도 계산상 연상환액이 커질 수 있습니다. 그래서 현재 금리 기준으로는 여유가 있어 보여도 보수적 기준에서는 한도에 가까워질 수 있습니다.", "연봉 7000만 원이라도 신용대출이나 자동차 할부가 있으면 DSR 여력이 줄어드는 구조는 동일합니다."] },
      { heading: "매수 예산과 같이 보는 방법", paragraphs: ["DSR이 통과 가능해도 취득세, 중개보수, 이사비, 관리비까지 포함하면 실제 자기자본이 부족할 수 있습니다.", "주담대 한도를 먼저 보고 집값을 정하기보다, 취득세와 월 현금흐름까지 같이 놓고 매수 가능한 가격대를 역산하는 편이 안전합니다."] }
    ],
    faqs: [
      { question: "연봉 7000 DSR 40%는 얼마인가요?", answer: "연간 원리금 약 2800만 원, 월평균 약 233만 원 수준입니다." },
      { question: "기존대출이 없으면 모두 주담대에 쓸 수 있나요?", answer: "계산상 여력은 커지지만 담보인정비율, 신용도, 금융기관 기준도 따로 적용됩니다." },
      { question: "스트레스 금리를 넣으면 한도가 줄어드나요?", answer: "보통 계산상 상환액이 커져 DSR 여력이 줄어드는 방향으로 작용합니다." },
      { question: "DSR만 보면 매수 가능성을 알 수 있나요?", answer: "아니요. 취득세와 자기자본, 생활비를 함께 봐야 합니다." },
      { question: "관련 계산기는 무엇인가요?", answer: "DSR 계산기, 취득세 계산기, 중개수수료 계산기를 함께 확인하세요." }
    ],
    relatedCalculatorSlugs: ["dsr", "acquisition-tax", "brokerage-fee"]
  },
  {
    slug: "600-million-apartment-acquisition-tax",
    path: "/guides/600-million-apartment-acquisition-tax",
    title: "6억 아파트 취득세 계산: 잔금 전 준비금",
    h1: "6억 아파트 취득세 계산: 잔금 전 준비금",
    category: "취득세 상황별 가이드",
    description: "6억 아파트 매수 시 취득세, 지방교육세 등 초기 세금 준비금을 어떻게 추정해야 하는지 정리했습니다.",
    officialSources: [
      { title: "정부24 취득세 안내", url: "https://www.gov.kr/portal/service/serviceInfo/536000000011", note: "취득세 개요 확인용" },
      { title: "위택스", url: "https://www.wetax.go.kr/", note: "지방세 신고 전 확인용" }
    ],
    policySummary: ["6억 아파트 취득세는 주택 수, 지역, 감면 여부에 따라 달라질 수 있습니다.", "취득세는 잔금 시점에 필요한 현금성 비용으로 별도 준비해야 합니다."],
    body: [
      { heading: "6억 아파트 취득세를 볼 때의 출발점", paragraphs: ["6억 아파트 취득세는 단순히 매매가에 하나의 세율을 곱해 끝나는 문제가 아닙니다. 1주택인지 다주택인지, 조정대상지역인지, 생애최초 감면 대상인지에 따라 결과가 달라질 수 있습니다.", "계산기에는 주택 가격 6억 원과 주택 수, 지역 조건, 감면 여부를 함께 입력해야 현실적인 추정이 가능합니다."] },
      { heading: "잔금 전 준비금으로 봐야 한다", paragraphs: ["취득세는 매달 나눠 내는 비용이 아니라 취득 후 신고·납부해야 하는 초기 비용입니다. 잔금 자금만 맞춰 놓고 취득세를 빠뜨리면 자금계획이 흔들릴 수 있습니다.", "취득세 외에도 중개보수, 법무비, 이사비를 함께 준비해야 실제 매수 자금이 맞습니다."] },
      { heading: "감면과 중과는 별도 확인", paragraphs: ["생애최초 감면이나 일시적 2주택 같은 예외는 요건이 중요합니다. 계산기는 방향을 잡는 도구이고, 실제 신고 전에는 최신 지자체 안내를 확인해야 합니다.", "특히 가족 명의 주택, 분양권, 상속주택 등은 주택 수 판단에 영향을 줄 수 있습니다."] }
    ],
    faqs: [
      { question: "6억 아파트 취득세는 얼마인가요?", answer: "주택 수, 지역, 감면 여부에 따라 달라지므로 취득세 계산기에 조건을 함께 입력해야 합니다." },
      { question: "취득세만 준비하면 되나요?", answer: "아니요. 지방교육세, 농특세, 중개보수, 법무비도 함께 봐야 합니다." },
      { question: "생애최초 감면은 자동 적용되나요?", answer: "아니요. 소득, 주택가액, 과거 보유 이력 등 요건을 확인해야 합니다." },
      { question: "잔금 전에 왜 취득세를 계산해야 하나요?", answer: "취득세는 초기 현금 지출이므로 미리 준비하지 않으면 자금계획이 부족해질 수 있습니다." },
      { question: "관련 계산기는 무엇인가요?", answer: "취득세 계산기와 중개수수료 계산기를 같이 쓰면 초기비용을 보기 좋습니다." }
    ],
    relatedCalculatorSlugs: ["acquisition-tax", "brokerage-fee", "dsr"]
  },
  {
    slug: "900-million-apartment-acquisition-tax",
    path: "/guides/900-million-apartment-acquisition-tax",
    title: "9억 아파트 취득세 계산: 주택 수별 체크",
    h1: "9억 아파트 취득세 계산: 주택 수별 체크",
    category: "취득세 상황별 가이드",
    description: "9억 아파트 매수 전 취득세와 부가 세목, 주택 수·조정대상지역 판단을 어떻게 점검해야 하는지 설명합니다.",
    officialSources: [
      { title: "정부24 취득세 안내", url: "https://www.gov.kr/portal/service/serviceInfo/536000000011", note: "취득세 개요 확인용" },
      { title: "위택스", url: "https://www.wetax.go.kr/", note: "지방세 신고 전 확인용" }
    ],
    policySummary: ["9억 아파트는 취득세 절대 금액이 커져 작은 조건 차이도 체감 부담이 큽니다.", "주택 수와 조정대상지역 여부를 먼저 정리해야 합니다."],
    body: [
      { heading: "9억 아파트는 세금 절대액을 먼저 본다", paragraphs: ["9억 아파트는 세율이 조금만 달라져도 세금 차이가 수백만 원 이상 벌어질 수 있습니다. 따라서 매매가와 대출 가능액만 보고 판단하면 초기비용을 과소평가하기 쉽습니다.", "취득세 계산기에서 9억 원을 기준으로 주택 수, 지역, 감면 여부를 바꿔 여러 시나리오를 확인해야 합니다."] },
      { heading: "주택 수 판단이 핵심", paragraphs: ["무주택자의 첫 주택인지, 기존 주택이 있는지, 일시적 2주택에 해당하는지에 따라 세 부담이 달라질 수 있습니다.", "분양권, 입주권, 상속주택처럼 애매한 자산은 실제 주택 수 판단에 영향을 줄 수 있으므로 단순히 본인 체감으로만 판단하면 위험합니다."] },
      { heading: "대출과 초기비용을 함께 본다", paragraphs: ["9억 아파트 매수는 DSR, 취득세, 중개보수, 이사비가 동시에 움직입니다. 주담대 월 납입액이 가능해 보여도 초기 세금 준비금이 부족하면 실행이 어렵습니다.", "매수 전에는 DSR 계산기와 취득세 계산기를 함께 사용해 월 상환 가능성과 잔금 전 현금 필요액을 동시에 점검하는 것이 좋습니다."] }
    ],
    faqs: [
      { question: "9억 아파트 취득세는 왜 조건별로 다른가요?", answer: "주택 수, 조정대상지역, 취득 유형, 감면 여부가 세율과 부가 세목에 영향을 줄 수 있기 때문입니다." },
      { question: "1주택이면 단순하게 계산해도 되나요?", answer: "기본 방향은 단순하지만 생애최초, 면적, 부가 세목 등은 별도 확인이 필요합니다." },
      { question: "다주택이면 취득세가 크게 오를 수 있나요?", answer: "중과 대상 여부에 따라 크게 달라질 수 있어 최신 기준 확인이 필요합니다." },
      { question: "DSR도 같이 봐야 하나요?", answer: "네. 취득세는 초기자금, DSR은 월 상환능력을 보여주므로 함께 봐야 합니다." },
      { question: "관련 계산기는 무엇인가요?", answer: "취득세, DSR, 중개수수료 계산기를 같이 확인하세요." }
    ],
    relatedCalculatorSlugs: ["acquisition-tax", "dsr", "brokerage-fee"]
  },
  {
    slug: "monthly-rent-500k-to-jeonse",
    path: "/guides/monthly-rent-500k-to-jeonse",
    title: "월세 50 전세 환산: 전월세 전환율로 보기",
    h1: "월세 50 전세 환산: 전월세 전환율로 보기",
    category: "전월세 전환 상황별 가이드",
    description: "월세 50만 원을 전세금으로 환산할 때 전월세 전환율과 보증금 조건을 어떻게 적용해야 하는지 설명합니다.",
    officialSources: [
      { title: "주택임대차보호법", url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=93190", note: "월차임 전환 근거 확인용" },
      { title: "국토교통부 전월세 전환 정책 안내", url: "https://www.molit.go.kr/policy/rent/rent_c_05.jsp", note: "전월세 전환 설명 확인용" }
    ],
    policySummary: ["월세 50만 원은 전환율에 따라 전세 환산액이 크게 달라집니다.", "보증금이 이미 있는 월세라면 보증금에 월세 환산분을 더해 봐야 합니다."],
    body: [
      { heading: "월세 50 전세 환산 공식", paragraphs: ["월세를 전세로 환산할 때는 월세 × 12 ÷ 전환율을 사용합니다. 예를 들어 월세 50만 원, 전환율 5%라면 월세 환산분은 1억 2000만 원입니다.", "이미 보증금이 5000만 원이라면 전세 환산 금액은 보증금 5000만 원에 1억 2000만 원을 더한 1억 7000만 원 수준으로 볼 수 있습니다."] },
      { heading: "전환율에 따라 결과가 달라진다", paragraphs: ["전환율 4%라면 월세 50만 원의 환산분은 1억 5000만 원이고, 전환율 6%라면 1억 원입니다. 같은 월세라도 전환율 가정에 따라 전세 환산액이 크게 달라집니다.", "그래서 주변 시세와 법정 상한, 실제 협상 전환율을 함께 비교해야 합니다."] },
      { heading: "협상 기준으로 활용하기", paragraphs: ["월세 50만 원을 전세로 바꾸는 계산은 임대인 제안이 합리적인지 확인하는 데 유용합니다. 다만 실제 전세가와 시장 수요가 반영되므로 계산값이 곧 확정 시세는 아닙니다.", "전세대출을 쓰는 경우에는 환산 전세금뿐 아니라 대출 이자까지 같이 봐야 실제 월 부담을 판단할 수 있습니다."] }
    ],
    faqs: [
      { question: "월세 50만 원은 전세로 얼마인가요?", answer: "전환율 5% 기준 월세 환산분은 약 1억 2000만 원입니다. 기존 보증금이 있으면 더해야 합니다." },
      { question: "전환율 4%면 어떻게 되나요?", answer: "월세 50만 원의 환산분은 약 1억 5000만 원입니다." },
      { question: "보증금도 포함하나요?", answer: "네. 월세 환산분에 기존 보증금을 더해 전세 환산 금액을 봅니다." },
      { question: "계산값이 실제 시세와 같나요?", answer: "아니요. 입지, 수요, 옵션, 계약 조건에 따라 실제 시세는 달라질 수 있습니다." },
      { question: "관련 계산기는 무엇인가요?", answer: "월세 환산 계산기와 월세 vs 전세 비교 계산기를 함께 확인하세요." }
    ],
    relatedCalculatorSlugs: ["monthly-rent-conversion", "rent-vs-jeonse", "jeonse-loan-interest"]
  }
];

export const guides: Guide[] = [
  {
    slug: "jeonse-loan-interest-mistakes",
    path: "/guides/jeonse-loan-interest-mistakes",
    title: "전세대출 이자 계산 실수 7가지",
    h1: "전세대출 이자 계산 실수 7가지",
    category: "전세대출 가이드",
    description: "전세대출 이자를 계산할 때 자주 놓치는 보증료, 금리 상승, 만기 상환 리스크를 실제 사례 중심으로 정리했습니다.",
    officialSources: [
      { title: "주택도시기금 버팀목전세자금 FAQ", url: "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020103.jsp?gotoPage=1", note: "전세자금대출 기본 요건 확인용" },
      { title: "한국주택금융공사 전세자금보증 찾기", url: "https://www.hf.go.kr/ko/sub02/sub02_01_01.do", note: "보증 구조와 보증한도 확인용" }
    ],
    policySummary: [
      "전세대출은 상품별 한도, 소득 기준, 대상 주택 기준이 다릅니다.",
      "보증기관 기준과 은행 심사 기준을 함께 확인해야 실제 가능 금액을 알 수 있습니다."
    ],
    body: [
      {
        heading: "실수 1. 월 이자만 보고 전세가 싸다고 판단하는 경우",
        paragraphs: [
          "전세대출을 비교할 때 가장 흔한 실수는 월 이자만 보고 결론을 내리는 것입니다. 전세는 월세처럼 매달 나가는 임대료가 없어 보이기 때문에 월 이자 40만 원, 50만 원 수준이면 버틸 만하다고 느끼기 쉽습니다. 하지만 실제로는 대출이자 외에도 보증금 기회비용, 보증료, 이사비, 만기 상환 부담이 동시에 존재합니다.",
          "특히 만기일시상환 구조에서는 매달 이자만 내다가 만기에 원금을 한꺼번에 갚아야 하므로, 월 이자가 낮다는 사실이 곧 부담이 낮다는 뜻은 아닙니다. 월세와 비교할 때는 전세대출 이자를 월세처럼 보고, 자기자본이 전세보증금에 묶이는 기회비용까지 함께 계산해야 합니다."
        ],
        subheadings: [
          {
            heading: "왜 총주거비 관점이 중요한가",
            paragraphs: [
              "같은 전세대출 2억 원이라도 보증료율, 금리, 대출기간, 상환방식이 다르면 총비용이 크게 달라집니다. 월 이자가 비슷해 보여도 2년 전체로 보면 수십만 원에서 수백만 원 차이가 벌어질 수 있습니다.",
              "따라서 전세대출 이자 계산은 월 납입액 확인용으로 끝내지 말고, 비교 기간 전체 기준 총비용과 금리 변동 시나리오까지 같이 봐야 합니다."
            ]
          }
        ]
      },
      {
        heading: "실수 2. 금리 상승 가능성을 빼고 현재 금리만 넣는 경우",
        paragraphs: [
          "전세대출은 계약 시점의 금리만 보고 판단하면 위험합니다. 금리가 0.5%p만 올라도 월 이자와 총 이자가 동시에 커지는데, 실수령 소득이 빠듯한 가구는 이 차이를 체감적으로 크게 느끼게 됩니다. 특히 대출 비중이 높은 반전세 대안과 비교할 때는 금리 1%p 상승 시나리오까지 같이 봐야 합니다.",
          "금리 인상기는 전세가 무조건 유리하다는 직관이 깨지는 구간이 자주 나옵니다. 월세가 비싸 보여도 전세대출 이자와 기회비용을 더하면 오히려 월세가 안전한 선택이 되는 경우도 있습니다."
        ]
      },
      {
        heading: "실수 3. 보증료와 상환 구조를 누락하는 경우",
        paragraphs: [
          "전세대출은 단순 금리 외에 보증료가 붙는 경우가 많습니다. 사용자는 대출금리에만 집중하고 보증료를 빠뜨리기 쉬운데, 계약 전체 비용에서는 결코 무시할 수 없는 항목입니다. 또한 원리금균등인지 만기일시상환인지에 따라 매달 부담과 만기 리스크가 다르게 나타납니다.",
          "실전에서는 대출금액, 금리, 보증료, 상환방식, 만기 상환 재원 계획을 한 세트로 보고 판단하는 것이 안전합니다."
        ]
      }
    ],
    faqs: [
      { question: "전세대출 이자는 월세와 직접 비교해도 되나요?", answer: "가능하지만 전세보증금 기회비용과 보증료까지 함께 반영해야 공정한 비교가 됩니다." },
      { question: "금리를 몇 개 시나리오로 넣어보는 것이 좋나요?", answer: "현재 금리, 0.5%p 상승, 1%p 상승 정도는 최소한 비교해 보는 편이 좋습니다." },
      { question: "보증료는 항상 포함해야 하나요?", answer: "보증기관과 상품 구조에 따라 달라지므로 실제 대출 조건을 확인해야 합니다." },
      { question: "만기일시상환이 무조건 나쁜가요?", answer: "월 부담은 낮지만 만기 원금 상환 계획이 명확해야 합니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "월세 vs 전세 비교 계산기와 월세 환산 계산기를 같이 보면 판단이 더 쉬워집니다." }
    ],
    relatedCalculatorSlugs: ["jeonse-loan-interest", "rent-vs-jeonse", "monthly-rent-conversion"]
  },
  {
    slug: "rent-vs-jeonse-decision-guide",
    path: "/guides/rent-vs-jeonse-decision-guide",
    title: "월세 vs 전세 판단법: 숫자로 비교하는 순서",
    h1: "월세 vs 전세 판단법: 숫자로 비교하는 순서",
    category: "전월세 비교 가이드",
    description: "월세와 전세 중 무엇이 유리한지 판단할 때 기회비용, 전세대출 이자, 총주거비를 어떤 순서로 비교해야 하는지 정리했습니다.",
    officialSources: [
      { title: "주택임대차보호법", url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=93190", note: "전월세 계약 제도와 전환 근거 확인용" },
      { title: "국토교통부 정책풀이집", url: "https://www.molit.go.kr/policy/rent/rent_f_02.jsp", note: "전월세 전환 관련 정책 설명 확인용" }
    ],
    policySummary: [
      "전세와 월세 비교는 계약 형태 비교가 아니라 총주거비 비교입니다.",
      "전세사기 위험과 보증보험 가능 여부는 숫자 외 별도 판단 요소입니다."
    ],
    body: [
      {
        heading: "1단계: 월세와 전세를 같은 단위로 맞춘다",
        paragraphs: [
          "월세와 전세를 비교할 때 가장 먼저 해야 할 일은 둘을 같은 단위로 맞추는 것입니다. 월세는 매달 얼마가 나가는지 바로 보이지만, 전세는 월세가 없기 때문에 순간적으로 더 싸 보입니다. 그러나 전세도 자기자본이 보증금에 묶여 기회비용이 생기고, 대출을 쓰면 이자 부담이 붙습니다.",
          "따라서 월세는 월세 총액과 월세보증금 기회비용, 전세는 전세보증금 자기자본 기회비용과 전세대출 이자를 함께 더해 월 기준 또는 2년 총비용 기준으로 맞춰야 합니다. 그래야 두 선택지의 체감 비용이 공정하게 비교됩니다."
        ]
      },
      {
        heading: "2단계: 금리와 보증금 비율을 같이 본다",
        paragraphs: [
          "고금리기에는 전세가 항상 유리하지 않습니다. 자기자본이 많이 들어가면 그 돈을 다른 곳에 둘 때 얻을 수 있는 이자를 포기하는 셈이고, 전세대출을 많이 쓰면 월 이자 부담도 커집니다. 반대로 월세가 지나치게 비싼 지역에서는 대출이자를 감안해도 전세가 더 유리할 수 있습니다.",
          "즉 전세 vs 월세 판단의 핵심은 집값이나 보증금 절대액이 아니라, 내 자기자본 비중과 대출비중이 무엇인지, 그리고 금리 환경이 어떤지입니다."
        ]
      },
      {
        heading: "3단계: 숫자 외 위험도 같이 본다",
        paragraphs: [
          "전세가 숫자상 저렴하더라도 보증금 반환 위험, 보증보험 가입 가능 여부, 지역 리스크가 크다면 최종 선택은 달라질 수 있습니다. 월세는 총비용이 조금 더 높아도 현금흐름이 예측 가능하고 보증금 리스크가 상대적으로 작을 수 있습니다.",
          "그래서 의사결정은 항상 숫자와 위험을 동시에 봐야 합니다. 숫자상 1등과 실제로 안전한 선택이 다를 수 있다는 점을 염두에 두는 것이 중요합니다."
        ]
      }
    ],
    faqs: [
      { question: "전세보증금 기회비용은 꼭 넣어야 하나요?", answer: "네. 넣지 않으면 전세가 과도하게 유리하게 보입니다." },
      { question: "월세가 무조건 현금흐름에 불리한가요?", answer: "아닙니다. 고금리기나 대출비중이 큰 경우 월세가 더 안정적인 선택일 수 있습니다." },
      { question: "비교기간은 몇 년으로 보는 게 좋나요?", answer: "보통 실제 예상 거주기간이나 계약기간인 2년 기준이 실용적입니다." },
      { question: "전세사기 위험은 계산기에 반영되나요?", answer: "아니요. 별도 체크가 필요한 비정량 리스크입니다." },
      { question: "관련해서 무엇을 같이 계산해야 하나요?", answer: "전세대출 이자와 월세 환산 계산기를 함께 보면 더 정확합니다." }
    ],
    relatedCalculatorSlugs: ["rent-vs-jeonse", "jeonse-loan-interest", "monthly-rent-conversion"]
  },
  {
    slug: "what-dsr-40-means",
    path: "/guides/what-dsr-40-means",
    title: "DSR 40% 의미를 실제 대출 관점에서 설명하면",
    h1: "DSR 40% 의미를 실제 대출 관점에서 설명하면",
    category: "대출 규제 가이드",
    description: "DSR 40%가 실무에서 어떤 의미인지, 소득과 기존대출이 주담대 한도에 어떤 영향을 주는지 설명합니다.",
    officialSources: [
      { title: "금융위원회 스트레스 DSR 제도 설명", url: "https://www.fsc.go.kr/po010101/81343?curPage=&srchBeginDt=&srchCtgry=1&srchEndDt=&srchKey=&srchText=", note: "스트레스 DSR 설명 확인용" },
      { title: "기획재정부 이렇게 달라집니다 - DSR", url: "https://whatsnew.moef.go.kr/mec/ots/dif/view.do?comBaseCd=DIFTYPCD&difField1=DIFFIELD05&difSer=db7e3d8b-ba55-463d-89d2-047f5fd3a50d&temp=2022&temp2=HALF002", note: "차주단위 DSR 40% 개요 확인용" }
    ],
    policySummary: [
      "DSR은 연소득 대비 모든 대출의 연간 원리금 상환액 비율입니다.",
      "차주단위 DSR 규제는 금융회사, 상품, 정책 시기에 따라 적용 범위가 달라질 수 있습니다."
    ],
    body: [
      {
        heading: "DSR 40%는 무엇을 뜻하나",
        paragraphs: [
          "DSR 40%는 연소득의 40% 이내에서 모든 대출의 연간 원리금 상환액을 관리하겠다는 의미로 이해하면 됩니다. 예를 들어 연소득 7천만 원인 차주라면 연간 원리금 상환 총액이 2,800만 원 수준을 넘지 않는지를 보는 식입니다.",
          "핵심은 주택담보대출 하나만 보는 것이 아니라 기존 신용대출, 자동차 할부, 기타 대출 상환액까지 함께 본다는 점입니다. 그래서 신규 주담대만 계산해서는 실제 승인 가능성을 정확히 가늠하기 어렵습니다."
        ]
      },
      {
        heading: "왜 내 체감과 한도가 다르게 느껴질까",
        paragraphs: [
          "많은 사용자는 월 납입액만 보고 '이 정도면 낼 수 있다'고 생각하지만, 금융기관은 연간 상환액 기준으로 더 보수적으로 봅니다. 게다가 스트레스 금리나 만기 산정 방식이 적용되면 사용자가 직접 계산한 값보다 DSR이 더 높게 나올 수 있습니다.",
          "즉 체감상 괜찮은 월 납입액이라도 제도상 한도를 넘길 수 있습니다. 반대로 예상보다 한도가 적게 나오는 이유도 대부분 기존대출과 스트레스 금리 반영에 있습니다."
        ]
      },
      {
        heading: "실전에서는 무엇을 먼저 확인해야 하나",
        paragraphs: [
          "첫째, 기존대출 상환액을 정확히 정리해야 합니다. 둘째, 주담대 금리와 기간을 보수적으로 넣어봐야 합니다. 셋째, 승인 가능 여부와 별개로 실수령액 대비 월 부담이 감당 가능한지 다시 봐야 합니다.",
          "DSR은 규제 통과 여부를 확인하는 장치일 뿐, 내 생활이 가능한지를 대신 판단해주지 않습니다. 그래서 DSR 계산기와 함께 전세대출 이자나 전체 주거비 계산을 같이 보는 편이 낫습니다."
        ]
      }
    ],
    faqs: [
      { question: "DSR 40% 이하면 무조건 대출이 나오나요?", answer: "아니요. 심사 기준, 담보가치, 신용도, 상품 규정이 함께 작용합니다." },
      { question: "기존 신용대출도 포함되나요?", answer: "네. 차주단위 DSR은 기존대출을 함께 반영하는 구조입니다." },
      { question: "스트레스 DSR은 왜 보나요?", answer: "미래 금리 상승을 반영해 상환능력을 더 보수적으로 보기 위해서입니다." },
      { question: "소득이 늘면 DSR이 바로 좋아지나요?", answer: "연소득이 늘면 분모가 커져 유리해질 수 있지만 기존대출 구조도 함께 봐야 합니다." },
      { question: "실무적으로 가장 많이 놓치는 것은 무엇인가요?", answer: "기존대출 연상환액과 스트레스 금리 반영입니다." }
    ],
    relatedCalculatorSlugs: ["dsr", "jeonse-loan-interest", "acquisition-tax"]
  },
  {
    slug: "acquisition-tax-checklist",
    path: "/guides/acquisition-tax-checklist",
    title: "취득세 계산 전 반드시 확인할 6가지",
    h1: "취득세 계산 전 반드시 확인할 6가지",
    category: "취득세 가이드",
    description: "주택 수, 조정대상지역, 생애최초 감면 여부 등 취득세 계산 전에 확인해야 할 핵심 체크포인트를 정리했습니다.",
    officialSources: [
      { title: "정부24 취득세 안내", url: "https://www.gov.kr/portal/service/serviceInfo/536000000011", note: "취득세 개요와 세율 구조 확인용" },
      { title: "위택스", url: "https://www.wetax.go.kr/", note: "실제 신고 전 지방세 신고 절차 확인용" }
    ],
    policySummary: [
      "취득세는 지방세이며 지자체 실무 안내를 함께 확인해야 합니다.",
      "생애최초 감면과 다주택 중과 여부는 조건을 정확히 따져야 합니다."
    ],
    body: [
      {
        heading: "주택 수 판단이 가장 중요하다",
        paragraphs: [
          "취득세를 계산할 때 가장 먼저 확인해야 할 것은 집값이 아니라 주택 수입니다. 같은 5억 원 주택이라도 1주택인지, 2주택인지, 중과 대상인지에 따라 세율 차이가 크게 벌어질 수 있습니다.",
          "특히 일시적 2주택처럼 사용자 입장에서는 예외로 생각하는 경우도 실무 판단은 세법과 지자체 기준을 따라야 하므로, 계산기 입력 전 내 보유주택 상태를 먼저 정리해야 합니다."
        ]
      },
      {
        heading: "생애최초 감면과 지역 기준을 따로 봐야 한다",
        paragraphs: [
          "생애최초 감면은 많은 사용자가 기대하는 항목이지만, 자동으로 적용된다고 보면 안 됩니다. 소득, 주택가액, 과거 주택 보유 이력 등 여러 요건을 함께 보게 되므로 계산기는 참고값으로만 활용하는 것이 안전합니다.",
          "또한 조정대상지역 여부와 취득 유형이 다르면 세율 구조가 달라질 수 있습니다. 그래서 단순히 인터넷에 떠도는 예시 세율을 그대로 적용하면 오차가 크게 생길 수 있습니다."
        ]
      },
      {
        heading: "잔금일 자금계획과 같이 봐야 한다",
        paragraphs: [
          "취득세는 월 납입금이 아니라 잔금 시점에 바로 준비해야 하는 현금입니다. 그래서 집값만 맞추고 취득세를 별도 준비하지 않으면 자금계획이 흔들릴 수 있습니다.",
          "실무적으로는 취득세, 중개보수, 법무비, 이사비까지 합쳐 총 취득비용을 보는 편이 훨씬 현실적입니다."
        ]
      }
    ],
    faqs: [
      { question: "취득세는 계약 직후 바로 내나요?", answer: "일반적으로 취득 후 법정 신고·납부기한 안에 신고하고 납부합니다." },
      { question: "생애최초 감면은 계산기로 확정 가능한가요?", answer: "아니요. 실제 요건 확인이 필요합니다." },
      { question: "지방교육세도 같이 보나요?", answer: "네. 취득세만 보면 실제 준비자금이 부족할 수 있습니다." },
      { question: "조정대상지역은 왜 중요하죠?", answer: "일부 중과 여부 판단에 영향을 줍니다." },
      { question: "관련해서 같이 볼 계산기는 무엇인가요?", answer: "중개수수료 계산기와 DSR 계산기를 함께 보는 것이 실무적입니다." }
    ],
    relatedCalculatorSlugs: ["acquisition-tax", "brokerage-fee", "dsr"]
  },
  {
    slug: "brokerage-fee-negotiation",
    path: "/guides/brokerage-fee-negotiation",
    title: "중개수수료 협의 방법: 상한요율만 믿으면 안 되는 이유",
    h1: "중개수수료 협의 방법: 상한요율만 믿으면 안 되는 이유",
    category: "중개보수 가이드",
    description: "중개보수 상한요율, 협의 가능 범위, 월세 환산거래금액까지 실제 협의 때 필요한 포인트를 정리했습니다.",
    officialSources: [
      { title: "서울부동산정보광장 부동산 중개보수 안내", url: "https://land.seoul.go.kr/land/broker/brokerageCommission.do", note: "거래유형별 상한요율 확인용" },
      { title: "공인중개사법 시행규칙", url: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=260406", note: "요율 게시·설명 관련 규정 확인용" }
    ],
    policySummary: [
      "상한요율은 최대 범위이지 자동 확정요율이 아닙니다.",
      "월세는 환산거래금액 기준으로 계산하므로 보증금만 봐서는 안 됩니다."
    ],
    body: [
      {
        heading: "상한요율은 협상 출발점이지 결론이 아니다",
        paragraphs: [
          "중개보수는 상한요율이 정해져 있다고 해서 반드시 그 수준으로 내야 하는 것은 아닙니다. 상한요율은 법적으로 허용되는 최대 범위에 가깝고, 실제 지급요율은 중개사와 협의할 수 있습니다.",
          "따라서 큰 거래금액일수록 0.1%p 차이도 절대 금액으로는 상당할 수 있습니다. 계약 직전 급하게 계산하지 말고, 예상 중개보수 상한과 협의 희망 수준을 미리 알고 가는 편이 유리합니다."
        ]
      },
      {
        heading: "월세 거래는 환산거래금액을 이해해야 한다",
        paragraphs: [
          "월세는 보증금만으로 중개보수를 계산하지 않습니다. 보증금과 월세를 일정 방식으로 환산한 거래금액 기준으로 요율을 적용하는 경우가 많습니다. 그래서 체감보다 중개보수가 높아 보일 수 있습니다.",
          "이 구조를 모르고 있다가 계약 직전에 놀라는 경우가 많기 때문에, 월세나 반전세는 반드시 환산거래금액 기준으로 미리 계산해 보는 것이 좋습니다."
        ]
      },
      {
        heading: "협의할 때 확인해야 할 질문",
        paragraphs: [
          "첫째, 상한요율 기준인지 실제 적용 요율인지 확인해야 합니다. 둘째, 부가세 포함인지 별도인지 확인해야 합니다. 셋째, 현금영수증이나 세금계산서 처리 여부도 함께 묻는 편이 좋습니다.",
          "중개보수는 거래 막바지에 말하기보다 집을 보여줄 때부터 기준을 확인하는 쪽이 협상상 유리합니다."
        ]
      }
    ],
    faqs: [
      { question: "상한요율이면 무조건 그만큼 내야 하나요?", answer: "아니요. 상한 범위 안에서 협의할 수 있습니다." },
      { question: "월세는 왜 보증금만으로 계산하지 않나요?", answer: "월세를 환산한 거래금액 기준이 적용되기 때문입니다." },
      { question: "부가세는 항상 따로 내나요?", answer: "중개업소 과세 유형에 따라 달라질 수 있어 사전 확인이 필요합니다." },
      { question: "협상은 언제 하는 게 좋나요?", answer: "계약 직전보다 중개 초기 단계에서 기준을 확인하는 편이 좋습니다." },
      { question: "관련해서 같이 볼 계산기는 무엇인가요?", answer: "취득세, 월세 환산, 전세 vs 월세 비교 계산기를 같이 보면 총이사비용을 보기 좋습니다." }
    ],
    relatedCalculatorSlugs: ["brokerage-fee", "monthly-rent-conversion", "rent-vs-jeonse"]
  },
  {
    slug: "subscription-score-interpretation",
    path: "/guides/subscription-score-interpretation",
    title: "청약가점 해석: 점수만 보지 말아야 하는 이유",
    h1: "청약가점 해석: 점수만 보지 말아야 하는 이유",
    category: "청약 가이드",
    description: "청약가점이 높고 낮다는 말이 실제로 무엇을 뜻하는지, 무주택기간·부양가족·가입기간을 어떻게 해석해야 하는지 설명합니다.",
    officialSources: [
      { title: "주택도시기금 청약가점빠른계산기", url: "https://nhuf.molit.go.kr/FP/FP07/FP0702/FP070210.jsp", note: "기본 점수 구조 확인용" },
      { title: "주택공급에 관한 규칙 별표1", url: "https://www.law.go.kr/flDownload.do?flSeq=102470549&gubun=", note: "가점제 세부 기준 확인용" }
    ],
    policySummary: [
      "가점제는 무주택기간, 부양가족 수, 통장 가입기간을 합산해 평가합니다.",
      "최종 점수는 모집공고일 기준과 공고문 해석이 우선입니다."
    ],
    body: [
      {
        heading: "총점보다 항목별 점수 구조를 먼저 봐야 한다",
        paragraphs: [
          "청약가점을 볼 때 많은 사용자가 총점만 확인하고 끝냅니다. 하지만 실제 전략을 세우려면 무주택기간, 부양가족 수, 청약통장 가입기간 중 어디에서 점수가 형성되는지를 따로 봐야 합니다.",
          "예를 들어 통장 가입기간이 충분해도 무주택기간이 짧으면 기대보다 낮은 점수가 나올 수 있습니다. 반대로 부양가족 점수가 높으면 총점이 빠르게 올라갑니다."
        ]
      },
      {
        heading: "점수가 낮다고 바로 포기할 필요는 없다",
        paragraphs: [
          "청약가점은 지역, 평형, 공급유형, 경쟁률에 따라 체감 의미가 다릅니다. 같은 50점이라도 어떤 단지에서는 도전 가능한 점수일 수 있고, 어떤 인기 단지에서는 낮을 수 있습니다.",
          "따라서 가점은 절대평가가 아니라 상대적 참고치로 봐야 합니다. 현재 점수를 기준으로 당장 도전할지, 점수를 더 쌓을지, 다른 주거 대안을 병행할지 판단하는 도구로 쓰는 편이 맞습니다."
        ]
      },
      {
        heading: "실제 신청 전에는 공고문이 우선이다",
        paragraphs: [
          "가점 계산기는 빠른 점검용으로 유용하지만, 최종 신청에서는 반드시 입주자모집공고일 기준으로 다시 계산해야 합니다. 부양가족 인정 여부, 세대구성, 주민등록 요건 등은 공고문 확인이 필수입니다.",
          "점수 1~2점 차이로 결과가 바뀌는 경우가 많으므로, 계산기 결과를 바로 확정값처럼 보는 것은 위험합니다."
        ]
      }
    ],
    faqs: [
      { question: "청약가점이 높으면 무조건 당첨되나요?", answer: "아니요. 단지별 경쟁률과 공급유형에 따라 체감은 달라집니다." },
      { question: "무주택기간이 가장 중요한가요?", answer: "중요하지만 부양가족 점수의 영향도 매우 큽니다." },
      { question: "점수가 애매하면 어떻게 해야 하나요?", answer: "현재 공급 시장과 다른 주거 대안을 함께 보며 전략을 세우는 편이 좋습니다." },
      { question: "공고문 전 점수와 공고문 기준 점수가 다를 수 있나요?", answer: "네. 최종 산정은 모집공고일과 공고문 기준이 우선입니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "취득세, DSR, 중개수수료 계산기까지 연결해 실제 당첨 후 자금계획을 같이 보는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["housing-subscription-score", "acquisition-tax", "dsr"]
  },
  {
    slug: "monthly-rent-conversion-basics",
    path: "/guides/monthly-rent-conversion-basics",
    title: "전월세 전환율 쉽게 이해하기",
    h1: "전월세 전환율 쉽게 이해하기",
    category: "전월세 전환 가이드",
    description: "전세를 월세로, 월세를 전세로 바꿔 볼 때 전월세 전환율을 어떻게 해석해야 하는지 설명합니다.",
    officialSources: [
      { title: "주택임대차보호법", url: "https://law.go.kr/LSW/lsInfoP.do?lsiSeq=93190", note: "월차임 전환의 법적 근거 확인용" },
      { title: "국토교통부 정책풀이집", url: "https://www.molit.go.kr/policy/rent/rent_c_05.jsp", note: "전월세 전환 정책 설명 확인용" }
    ],
    policySummary: [
      "전월세 전환율은 보증금과 월세의 교환비율을 연 기준으로 표현한 값입니다.",
      "법정 상한과 실제 시장 전환율은 다를 수 있습니다."
    ],
    body: [
      {
        heading: "전환율은 보증금의 시간가치를 숫자로 바꾼 것이다",
        paragraphs: [
          "전월세 전환율은 쉽게 말해 보증금 일부를 월세로 바꿀 때 적용하는 비율입니다. 보증금을 덜 내는 대신 월세를 얼마나 더 낼지를 정하는 계산 기준이라고 보면 됩니다.",
          "이 비율이 높으면 같은 보증금 차액에 대해 월세가 더 많이 붙고, 낮으면 월세가 덜 붙습니다. 따라서 전환율은 단순한 계산 도구가 아니라 내 자금과 월 현금흐름 사이의 교환비율을 보여주는 지표입니다."
        ]
      },
      {
        heading: "왜 법정 상한과 실제 시장가가 다를까",
        paragraphs: [
          "법정 상한은 임차인을 보호하기 위한 기준이지만, 실제 계약은 입지, 옵션, 수요, 계약시점에 따라 달라집니다. 그래서 계산기 값이 시세와 꼭 같지는 않을 수 있습니다.",
          "결국 계산기는 기준선 역할을 하고, 실제 협상에서는 주변 시세와 유사 매물 조건까지 같이 봐야 적정성을 판단할 수 있습니다."
        ]
      },
      {
        heading: "실전에서 가장 중요한 질문",
        paragraphs: [
          "보증금을 더 넣어서 줄어드는 월세가 내 자금 기회비용보다 큰가, 반대로 보증금을 줄여서 확보한 현금이 다른 곳에서 더 유용한가를 따져야 합니다. 이 질문이 전월세 전환 판단의 핵심입니다.",
          "그래서 월세 환산 계산기는 단독으로 쓰기보다 월세 vs 전세 비교 계산기와 함께 쓰는 편이 더 실전적입니다."
        ]
      }
    ],
    faqs: [
      { question: "전환율은 연 기준인가요?", answer: "네. 일반적으로 연 기준으로 해석합니다." },
      { question: "법정 상한이면 항상 그 비율로 계약하나요?", answer: "아니요. 실제 시장 계약은 별도로 형성될 수 있습니다." },
      { question: "보증금을 올리면 무조건 이득인가요?", answer: "월세 절감액과 자금 기회비용을 같이 봐야 합니다." },
      { question: "전세를 월세로 바꾸는 데만 쓰나요?", answer: "월세를 전세금 기준으로 환산하는 데도 쓸 수 있습니다." },
      { question: "관련해서 같이 볼 계산기는 무엇인가요?", answer: "월세 vs 전세 비교와 전세대출 이자 계산기를 같이 보는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["monthly-rent-conversion", "rent-vs-jeonse", "jeonse-loan-interest"]
  },
  {
    slug: "jeonse-total-housing-cost",
    path: "/guides/jeonse-total-housing-cost",
    title: "전세 계약할 때 총주거비로 봐야 하는 이유",
    h1: "전세 계약할 때 총주거비로 봐야 하는 이유",
    category: "전세 비용 가이드",
    description: "전세보증금, 대출이자, 기회비용, 보증료, 이사비까지 합친 총주거비 관점으로 전세를 보는 방법을 정리했습니다.",
    officialSources: [
      { title: "주택도시기금 버팀목전세자금 FAQ", url: "https://nhuf.molit.go.kr/FP/FP05/FP0502/FP05020103.jsp?gotoPage=1", note: "전세대출 조건 확인용" },
      { title: "한국주택금융공사 전세자금보증", url: "https://www.hf.go.kr/ko/sub02/sub02_01_01.do", note: "보증 구조 확인용" }
    ],
    policySummary: [
      "전세는 월세가 없더라도 금융비용과 기회비용이 존재합니다.",
      "총주거비 비교는 전세와 월세를 같은 기준으로 맞추는 핵심 과정입니다."
    ],
    body: [
      {
        heading: "전세가 싸 보이는 이유와 실제 비용의 차이",
        paragraphs: [
          "전세는 매달 월세를 내지 않기 때문에 체감상 매우 경제적으로 보일 수 있습니다. 하지만 보증금을 마련하기 위해 자기자본을 묶거나 대출을 이용하면 그 자체가 비용이 됩니다.",
          "즉 전세를 볼 때는 '월세가 없다'가 아니라 '보증금과 이자를 어떤 구조로 부담하는가'를 봐야 합니다. 이 관점이 총주거비 비교의 출발점입니다."
        ]
      },
      {
        heading: "총주거비에 포함해야 할 항목",
        paragraphs: [
          "전세보증금 자기자본의 기회비용, 전세대출 이자, 보증료, 중개보수, 이사비를 기본으로 넣는 것이 좋습니다. 여기에 보증보험 여부와 만기 자금 재조달 가능성도 같이 봐야 현실적입니다.",
          "사용자는 보통 대출이자만 넣고 계산을 끝내지만, 실제 의사결정에서는 묶이는 현금의 가치가 매우 중요합니다."
        ]
      },
      {
        heading: "왜 월세와의 비교가 필수인가",
        paragraphs: [
          "전세의 총주거비를 계산하면 월세와의 차이가 생각보다 작게 나올 때가 있습니다. 특히 대출비중이 높고 금리가 높은 시기에는 전세의 장점이 빠르게 줄어듭니다.",
          "그래서 전세 자체를 볼 때도 항상 월세 대안과 함께 계산해야 합니다. 총주거비 관점이 바로 그 연결고리입니다."
        ]
      }
    ],
    faqs: [
      { question: "전세도 월세처럼 월 비용으로 바꿔 볼 수 있나요?", answer: "네. 기회비용과 대출이자를 월 기준으로 환산해 볼 수 있습니다." },
      { question: "보증금 기회비용은 왜 중요하죠?", answer: "그 돈을 다른 곳에 둘 때 얻을 수 있었던 수익을 포기하는 비용이기 때문입니다." },
      { question: "보증보험료도 총주거비에 넣어야 하나요?", answer: "실무적으로는 넣는 편이 더 현실적입니다." },
      { question: "전세가 숫자상 유리하면 무조건 좋은가요?", answer: "아니요. 보증금 반환 리스크도 반드시 같이 봐야 합니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "전세대출 이자와 월세 vs 전세 비교 계산기를 같이 보는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["jeonse-loan-interest", "rent-vs-jeonse", "brokerage-fee"]
  },
  {
    slug: "subscription-account-period",
    path: "/guides/subscription-account-period",
    title: "청약통장 가입기간이 점수에 미치는 영향",
    h1: "청약통장 가입기간이 점수에 미치는 영향",
    category: "청약통장 가이드",
    description: "청약통장 가입기간 점수는 얼마나 큰 의미가 있는지, 무주택기간·부양가족 점수와 어떻게 같이 봐야 하는지 설명합니다.",
    officialSources: [
      { title: "주택도시기금 청약가점빠른계산기", url: "https://nhuf.molit.go.kr/FP/FP07/FP0702/FP070210.jsp", note: "가입기간 점수 구조 확인용" },
      { title: "주택공급에 관한 규칙 별표1", url: "https://www.law.go.kr/flDownload.do?flSeq=102470549&gubun=", note: "가점제 세부 기준 확인용" }
    ],
    policySummary: [
      "청약통장 가입기간 점수는 총 17점 범위입니다.",
      "가입기간만 길다고 당첨 가능성이 자동으로 높아지는 것은 아닙니다."
    ],
    body: [
      {
        heading: "가입기간 점수는 중요하지만 단독으로는 부족하다",
        paragraphs: [
          "청약통장 가입기간은 꾸준히 관리하기 쉬운 항목이라 사용자가 가장 잘 알고 있는 점수 요소입니다. 하지만 총점 구조에서는 무주택기간과 부양가족 점수의 영향이 더 크게 작용하는 경우가 많습니다.",
          "그래서 통장 가입기간이 길다고 해서 점수가 충분하다고 생각하면 오판할 수 있습니다. 가입기간은 기본 체력을 만드는 요소로 보고, 다른 항목과 합쳐 총점으로 해석해야 합니다."
        ]
      },
      {
        heading: "언제 기다리고 언제 도전해야 할까",
        paragraphs: [
          "가입기간 점수는 시간이 지나면 자연스럽게 쌓이므로, 다음 구간까지 얼마 남지 않았다면 청약 시기를 조정하는 전략이 유효할 수 있습니다. 반대로 통장 점수는 충분한데 무주택기간이나 부양가족 점수가 약하면 기다려도 큰 차이가 없을 수 있습니다.",
          "즉 가입기간 점수는 '기다릴 가치가 있는지'를 판단하는 요소 중 하나이지, 단독으로 전략을 정하는 기준은 아닙니다."
        ]
      },
      {
        heading: "실제 해석은 공고문과 함께 해야 한다",
        paragraphs: [
          "청약통장 가입기간은 계산기에서 쉽게 확인할 수 있지만, 실제 신청은 모집공고문 기준으로 다시 따져야 합니다. 공급유형, 지역, 특별공급 여부에 따라 체감 전략이 달라질 수 있기 때문입니다.",
          "따라서 통장 점수는 청약가점 계산기의 한 항목으로 보고, 최종 전략은 전체 가점 구조와 자금계획을 함께 봐야 합니다."
        ]
      }
    ],
    faqs: [
      { question: "청약통장 가입기간 점수는 만점이 몇 점인가요?", answer: "일반적인 가점제 구조에서는 17점 범위로 봅니다." },
      { question: "가입기간이 길면 무조건 유리한가요?", answer: "유리하지만 다른 항목 점수와 함께 봐야 합니다." },
      { question: "다음 점수 구간까지 얼마나 남았는지 보는 게 중요하나요?", answer: "네. 청약 시점 조정에 도움이 됩니다." },
      { question: "특별공급에도 같은 방식으로 보나요?", answer: "공급유형에 따라 다르게 봐야 합니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "청약가점 계산기와 DSR 계산기를 함께 보며 실제 당첨 후 자금계획까지 점검하는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["housing-subscription-score", "dsr", "acquisition-tax"]
  },
  {
    slug: "regulated-area-acquisition-tax",
    path: "/guides/regulated-area-acquisition-tax",
    title: "조정대상지역과 취득세 중과 체크포인트",
    h1: "조정대상지역과 취득세 중과 체크포인트",
    category: "취득세 심화 가이드",
    description: "조정대상지역 여부와 주택 수 판단이 취득세 계산에 왜 중요한지 실제 체크포인트 중심으로 설명합니다.",
    officialSources: [
      { title: "정부24 취득세 안내", url: "https://www.gov.kr/portal/service/serviceInfo/536000000011", note: "취득세 기본 안내" },
      { title: "위택스", url: "https://www.wetax.go.kr/", note: "지방세 신고 전 확인용" }
    ],
    policySummary: [
      "주택 수와 조정대상지역 여부는 취득세 중과 판단에 영향을 줄 수 있습니다.",
      "예외 규정과 경과 규정은 개별 사안에 따라 다르게 적용될 수 있습니다."
    ],
    body: [
      {
        heading: "조정대상지역이라는 말만 보고 단순 판단하면 안 된다",
        paragraphs: [
          "사용자는 조정대상지역이면 무조건 세금이 많이 나온다고 생각하기 쉽지만, 실제로는 취득 원인과 주택 수, 보유 상황에 따라 판단이 달라집니다. 조정대상지역 여부는 중요한 요소이지만, 그것만으로 세액이 확정되지는 않습니다.",
          "그래서 취득세 계산 전에는 반드시 내 보유주택 수, 취득 시점, 취득 방식, 감면 가능 여부를 함께 정리해야 합니다."
        ]
      },
      {
        heading: "다주택 여부 판단이 왜 어려운가",
        paragraphs: [
          "분양권, 입주권, 상속주택, 일시적 2주택 같은 변수 때문에 사용자가 생각하는 주택 수와 세법상 판단이 다를 수 있습니다. 이 차이를 놓치면 취득세 예산을 크게 잘못 잡을 수 있습니다.",
          "따라서 취득세 계산기는 방향을 잡는 도구로 보고, 복잡한 사례는 지방세 실무 안내와 전문가 확인을 거치는 편이 안전합니다."
        ]
      },
      {
        heading: "실제 계약 전 체크리스트",
        paragraphs: [
          "첫째, 조정대상지역 여부를 최신 기준으로 확인합니다. 둘째, 주택 수 판단에 애매한 자산이 있는지 점검합니다. 셋째, 생애최초 감면이나 예외 규정이 있는지 확인합니다.",
          "이 세 단계만 해도 취득세 오차를 크게 줄일 수 있습니다."
        ]
      }
    ],
    faqs: [
      { question: "조정대상지역이면 무조건 취득세 중과인가요?", answer: "아니요. 주택 수와 취득 상황을 함께 봐야 합니다." },
      { question: "분양권도 주택 수에 들어가나요?", answer: "시기와 제도에 따라 판단이 달라질 수 있어 별도 확인이 필요합니다." },
      { question: "일시적 2주택은 예외가 있나요?", answer: "예외 판단이 가능할 수 있으나 개별 사안 검토가 필요합니다." },
      { question: "취득세 계산기만으로 충분한가요?", answer: "복잡한 사례는 지방세 실무 안내나 전문가 확인이 필요합니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "취득세, 중개수수료, DSR 계산기를 같이 보면 실제 매수 예산을 더 잘 볼 수 있습니다." }
    ],
    relatedCalculatorSlugs: ["acquisition-tax", "brokerage-fee", "dsr"]
  },
  {
    slug: "subscription-score-vs-buy-or-rent",
    path: "/guides/subscription-score-vs-buy-or-rent",
    title: "청약을 기다릴지 매수·전세로 갈지 판단하는 방법",
    h1: "청약을 기다릴지 매수·전세로 갈지 판단하는 방법",
    category: "주거 전략 가이드",
    description: "청약가점만 보고 기다리는 것이 유리한지, 전세나 매수와 병행해서 판단해야 하는지 주거비 전략 관점에서 설명합니다.",
    officialSources: [
      { title: "주택도시기금 청약가점빠른계산기", url: "https://nhuf.molit.go.kr/FP/FP07/FP0702/FP070210.jsp", note: "현재 가점 확인용" },
      { title: "주택공급에 관한 규칙 별표1", url: "https://www.law.go.kr/flDownload.do?flSeq=102470549&gubun=", note: "가점제 구조 확인용" }
    ],
    policySummary: [
      "청약은 점수 경쟁이므로 기회비용과 기다리는 시간의 비용을 함께 봐야 합니다.",
      "가점이 높아도 자금계획이 준비되지 않으면 실제 실행이 어렵습니다."
    ],
    body: [
      {
        heading: "청약은 비용이 없는 선택이 아니다",
        paragraphs: [
          "청약을 기다리는 것은 돈이 들지 않는 선택처럼 보이지만, 실제로는 기다리는 동안의 전세비용, 월세비용, 기회비용이 계속 발생합니다. 그래서 청약가점이 조금 더 오른다는 이유만으로 무조건 기다리는 전략이 항상 유리한 것은 아닙니다.",
          "특히 당첨 후 취득세, 중도금, 잔금대출, 실거주 비용까지 감당해야 하므로 현재 가점만이 아니라 전체 자금계획을 같이 봐야 합니다."
        ]
      },
      {
        heading: "점수와 자금계획을 동시에 본다",
        paragraphs: [
          "가점이 충분히 높아도 당첨 후 DSR이나 자기자본이 부족하면 실제 실행은 어렵습니다. 반대로 점수가 애매하면 무리하게 기다리기보다 전세·매매 대안을 함께 보는 것이 더 합리적일 수 있습니다.",
          "즉 청약은 가점게임이 아니라 주거 전략의 한 축으로 보는 편이 맞습니다."
        ]
      },
      {
        heading: "실무적으로 같이 계산해야 할 것",
        paragraphs: [
          "청약가점 계산기, 취득세 계산기, DSR 계산기, 전세 vs 월세 비교 계산기를 함께 보면 기다림의 비용과 당첨 후 실행 가능성을 동시에 볼 수 있습니다.",
          "이 네 가지를 함께 보지 않으면 '당첨 가능성'과 '실행 가능성' 사이에 큰 간극이 생깁니다."
        ]
      }
    ],
    faqs: [
      { question: "가점이 높으면 그냥 기다리는 게 좋나요?", answer: "가점뿐 아니라 현재 주거비와 자금계획을 함께 봐야 합니다." },
      { question: "당첨 후 가장 먼저 보는 자금 항목은 무엇인가요?", answer: "취득세와 자기자본, 대출 가능 여부입니다." },
      { question: "기다리는 동안 전세를 유지해도 되나요?", answer: "가능하지만 그 비용도 기회비용으로 함께 봐야 합니다." },
      { question: "청약가점이 낮으면 바로 매수를 봐야 하나요?", answer: "지역과 공급 상황에 따라 다르므로 전세·매매·청약을 함께 비교하는 편이 낫습니다." },
      { question: "관련 계산기는 무엇을 같이 봐야 하나요?", answer: "청약가점, 취득세, DSR, 전세 vs 월세 계산기를 같이 보는 것이 좋습니다." }
    ],
    relatedCalculatorSlugs: ["housing-subscription-score", "acquisition-tax", "dsr"]
  },
  ...situationalGuides
];

export function getGuideBySlug(slug: string): Guide {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Guide not found: ${slug}`);
  return guide;
}

const primaryGuideSlugByCalculatorSlug: Record<string, string> = {
  "jeonse-loan-interest": "jeonse-loan-interest-mistakes",
  "rent-vs-jeonse": "rent-vs-jeonse-decision-guide",
  dsr: "what-dsr-40-means",
  "acquisition-tax": "acquisition-tax-checklist",
  "brokerage-fee": "brokerage-fee-negotiation",
  "monthly-rent-conversion": "monthly-rent-conversion-basics",
  "housing-subscription-score": "subscription-score-interpretation"
};

export function getPrimaryGuideForCalculator(calculatorSlug: string): Guide | undefined {
  const guideSlug = primaryGuideSlugByCalculatorSlug[calculatorSlug];
  return guideSlug ? guides.find((item) => item.slug === guideSlug) : undefined;
}
