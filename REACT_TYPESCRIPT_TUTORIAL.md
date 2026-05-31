# React와 TypeScript 학습 노트

이 문서는 이 프로젝트의 실제 코드를 기준으로 React와 TypeScript가 어떻게 쓰였는지 설명합니다.

## 1. React는 화면을 컴포넌트로 쪼개는 도구

`src/components/calculator/MoneyInput.tsx`는 금액 입력창 하나만 담당합니다.

```tsx
export function MoneyInput({ label, value, onChange, helper, required }: MoneyInputProps) {
  return (
    <label className="block">
      <input value={displayValue} onChange={...} />
      <select value={unit} onChange={...}>
        <option value="manwon">만원</option>
        <option value="won">원</option>
      </select>
    </label>
  );
}
```

React의 핵심은 화면을 의미 있는 조각으로 나누는 것입니다.

이 프로젝트의 주요 컴포넌트는 다음과 같습니다.

```text
MoneyInput        금액 입력
PercentInput      퍼센트 입력
NumberInput       일반 숫자 입력
ResultCard        계산 결과 박스
ResultRow         결과 한 줄
DsrCalculator     DSR 계산기 전체
Footer/Header     공통 레이아웃
```

즉 React에서는 화면을 컴포넌트들의 조합으로 만듭니다.

## 2. Props는 부모가 자식에게 넘기는 값

`MoneyInput`은 자기 혼자 연소득 입력인지 대출금액 입력인지 모릅니다. 부모 컴포넌트가 props로 알려줍니다.

`src/components/calculators/DsrCalculator.tsx`에는 이런 코드가 있습니다.

```tsx
<MoneyInput
  label="연소득"
  required
  value={field.value}
  onChange={field.onChange}
/>
```

여기서 `label`, `required`, `value`, `onChange`가 props입니다.

흐름은 이렇게 볼 수 있습니다.

```text
부모: 이 입력창은 "연소득"이야. 현재 값은 이거고, 바뀌면 이 함수를 실행해.
자식 MoneyInput: 알겠어. 그 값으로 화면을 그리고, 입력이 바뀌면 onChange를 호출할게.
```

## 3. TypeScript는 props 모양을 미리 정해준다

`MoneyInput.tsx`에는 다음 타입이 있습니다.

```ts
export type MoneyInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helper?: string;
  required?: boolean;
};
```

뜻은 다음과 같습니다.

```text
label은 문자열이어야 한다.
value는 숫자여야 한다.
onChange는 숫자를 받아서 아무것도 반환하지 않는 함수다.
helper는 있어도 되고 없어도 된다.
required도 있어도 되고 없어도 된다.
```

`?`가 붙으면 선택값입니다.

```ts
helper?: string;
required?: boolean;
```

그래서 아래 코드는 가능합니다.

```tsx
<MoneyInput label="연소득" value={1000} onChange={...} />
```

하지만 아래처럼 `value`에 문자열을 넣으면 TypeScript가 막습니다.

```tsx
<MoneyInput label="연소득" value="1000" onChange={...} />
```

`value`는 `number`라고 정해져 있기 때문입니다.

## 4. useState는 컴포넌트 안의 기억장치

`MoneyInput`에는 이런 코드가 있습니다.

```ts
const [unit, setUnit] = useState<"won" | "manwon">("manwon");
```

이 코드는 현재 단위가 원인지 만원인지 기억합니다.

```text
unit: 현재 값
setUnit: 값을 바꾸는 함수
초기값: "manwon"
```

TypeScript 부분도 중요합니다.

```ts
useState<"won" | "manwon">
```

이 타입은 `unit`이 아무 문자열이나 될 수 없고, 오직 둘 중 하나만 가능하다는 뜻입니다.

```text
"won"
"manwon"
```

그래서 실수로 이런 값을 넣으면 TypeScript가 잡아줍니다.

```ts
setUnit("dollar");
```

## 5. 조건부 렌더링

`MoneyInput`에는 helper 문구가 있을 때만 보여주는 코드가 있습니다.

```tsx
{helper ? <span>{helper}</span> : null}
```

뜻은 다음과 같습니다.

```text
helper가 있으면 span을 보여줘.
없으면 아무것도 보여주지 마.
```

`DsrCalculator.tsx`에서도 계산 결과가 있을 때만 결과 카드를 보여줍니다.

```tsx
{result ? (
  <ResultCard ...>
    ...
  </ResultCard>
) : null}
```

처음에는 `result`가 `null`입니다.

```ts
const [result, setResult] = useState<Result>(null);
```

사용자가 계산 버튼을 누르면 `setResult(calculated)`가 실행되고, 그때부터 결과 카드가 화면에 나타납니다.

## 6. 입력값 흐름

`MoneyInput`의 핵심 흐름은 다음 코드에 있습니다.

```tsx
<input
  value={displayValue}
  onChange={(event) =>
    onChange(
      clamp(
        parseDigits(event.target.value, Math.floor(MAX_SAFE_MONEY_AMOUNT / factor)) * factor,
        0,
        MAX_SAFE_MONEY_AMOUNT
      )
    )
  }
/>
```

풀어서 보면 다음 순서입니다.

```text
1. 사용자가 입력한다.
2. event.target.value로 입력 문자열을 읽는다.
3. parseDigits로 숫자만 뽑는다.
4. 단위가 만원이면 10,000을 곱한다.
5. clamp로 최소/최대 범위를 제한한다.
6. 부모에게 onChange(...)로 새 값을 넘긴다.
7. 부모 폼 상태가 바뀐다.
8. React가 화면을 다시 그린다.
```

React에서 이런 입력창을 controlled input이라고 부릅니다.

## 7. Zod와 TypeScript가 폼 타입을 만든다

`DsrCalculator.tsx`에는 다음 schema가 있습니다.

```ts
const schema = z.object({
  annualIncome: z.number().finite().min(1),
  mortgageAmount: z.number().finite().min(0),
  mortgageRate: z.number().finite().min(0),
  mortgageYears: z.number().finite().min(1),
  dsrLimit: z.number().finite().min(1),
  creditLoanMode: z.enum(["interest-only", "amortized"])
});
```

이 schema는 폼에 어떤 값이 있고, 각 값이 어떤 규칙을 만족해야 하는지 정의합니다.

그리고 바로 아래에 이런 코드가 있습니다.

```ts
type FormValues = z.infer<typeof schema>;
```

`z.infer`는 Zod schema를 보고 TypeScript 타입을 자동으로 만듭니다.

즉 직접 아래 타입을 중복 작성하지 않아도 됩니다.

```ts
type FormValues = {
  annualIncome: number;
  mortgageAmount: number;
  mortgageRate: number;
  ...
}
```

schema가 바뀌면 `FormValues`도 같이 바뀝니다. 실무에서 좋은 패턴입니다.

## 8. ReturnType으로 계산 결과 타입을 자동 추론한다

`DsrCalculator.tsx`에는 이런 코드가 있습니다.

```ts
type Result = ReturnType<typeof calculateDsr> | null;
```

뜻은 다음과 같습니다.

```text
calculateDsr 함수가 반환하는 타입을 Result 타입으로 쓰겠다.
단, 아직 계산 전에는 null일 수도 있다.
```

이 방식의 장점은 `calculateDsr` 반환값 구조가 바뀌어도 `Result` 타입을 따로 고칠 필요가 적다는 것입니다.

`src/lib/calculators/dsr.ts`의 `calculateDsr`는 이런 객체를 반환합니다.

```ts
return {
  annualMortgagePayment: roundTo(annualMortgagePayment),
  annualCreditPayment: roundTo(annualCreditPayment),
  totalAnnualRepayment: roundTo(totalAnnualRepayment),
  monthlyAverageRepayment: roundTo(totalAnnualRepayment / 12),
  dsr: roundTo(dsr, 2),
  dsrLimit,
  remainingAnnualRepaymentCapacity: roundTo(remainingAnnualRepaymentCapacity),
  stressedDsr: roundTo(stressedDsr, 2),
  status
};
```

그러면 React 컴포넌트에서 안전하게 이렇게 쓸 수 있습니다.

```tsx
<ResultCard value={formatPercent(result.dsr)} />
<ResultRow value={formatKoreanMoney(result.totalAnnualRepayment)} />
```

TypeScript가 `result.dsr`가 있는지, 숫자인지 알고 있습니다.

## 9. 유니언 타입은 정해진 선택지만 허용한다

`src/lib/calculators/dsr.ts`에는 이런 타입이 있습니다.

```ts
creditLoanMode?: "interest-only" | "amortized";
```

뜻은 다음과 같습니다.

```text
creditLoanMode는 없어도 된다.
있다면 "interest-only" 또는 "amortized"만 가능하다.
```

그래서 계산 로직에서 안전하게 분기할 수 있습니다.

```ts
if (mode === "amortized") {
  return calculateEqualPayment(...) * 12;
}

return safeAmount * safeRate / 100;
```

문자열을 아무거나 받으면 버그가 생기기 쉽습니다. TypeScript 유니언 타입은 그런 실수를 줄입니다.

## 10. 배열 타입과 데이터 기반 렌더링

`src/config/calculators.ts`에는 이런 타입이 있습니다.

```ts
export type CalculatorInfo = {
  slug: string;
  path: string;
  guidePath: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  faqs: FAQ[];
  relatedSlugs: string[];
};
```

그리고 다음처럼 계산기 정보를 배열로 관리합니다.

```ts
export const calculators: CalculatorInfo[] = [
  {
    slug: "jeonse-loan-interest",
    path: "/jeonse-loan-interest-calculator",
    ...
  },
  ...
];
```

`CalculatorInfo[]`는 CalculatorInfo 객체들의 배열이라는 뜻입니다.

이 데이터는 여러 곳에서 재사용됩니다. 예를 들어 Footer에서는 다음처럼 목록을 만듭니다.

```tsx
{calculators.map((calculator) => (
  <Link key={calculator.slug} href={calculator.path}>
    {calculator.shortTitle}
  </Link>
))}
```

React에서 자주 쓰는 패턴입니다.

```text
데이터 배열이 있다.
map으로 반복한다.
각 항목을 JSX로 바꾼다.
화면에 목록으로 출력한다.
```

## 11. 순수 계산 함수와 React 컴포넌트를 분리했다

이 프로젝트 구조에서 좋은 점은 계산 로직이 UI 안에 박혀 있지 않다는 것입니다.

UI는 여기에 있습니다.

```text
src/components/calculators/DsrCalculator.tsx
```

계산은 여기에 있습니다.

```text
src/lib/calculators/dsr.ts
```

`DsrCalculator`는 사용자의 입력을 받고 결과를 보여줍니다.

```ts
function onSubmit(values: FormValues) {
  const calculated = calculateDsr(values);
  setResult(calculated);
  writeQueryState(values);
}
```

반면 `calculateDsr`는 화면을 모릅니다. 그냥 숫자를 받아서 숫자를 반환합니다.

이렇게 분리하면 장점이 큽니다.

```text
계산 로직 테스트가 쉬움
UI를 바꿔도 계산이 안 흔들림
다른 화면에서도 같은 계산 함수를 재사용 가능
버그 위치를 찾기 쉬움
```

## 12. 이 프로젝트에서 React와 TypeScript를 한 문장으로 정리

React는 다음 역할을 합니다.

```text
데이터 상태에 따라 화면을 다시 그리는 도구
```

TypeScript는 다음 역할을 합니다.

```text
그 데이터의 모양과 규칙을 코드 작성 시점에 검사하는 도구
```

이 프로젝트에서 둘은 이렇게 함께 움직입니다.

```text
사용자가 입력한다
→ React Hook Form이 값을 관리한다
→ Zod가 값이 유효한지 검사한다
→ TypeScript가 값의 타입을 보장한다
→ calculateDsr 같은 순수 함수가 계산한다
→ React state에 결과를 저장한다
→ result가 생기면 결과 UI가 렌더링된다
```

처음 공부할 때는 아래 순서로 보면 좋습니다.

```text
1. src/components/calculator/MoneyInput.tsx
   props, state, input 이벤트

2. src/components/calculators/DsrCalculator.tsx
   폼, submit, conditional rendering

3. src/lib/calculators/dsr.ts
   TypeScript 타입과 순수 함수

4. src/config/calculators.ts
   데이터 타입과 배열 렌더링 구조
```
