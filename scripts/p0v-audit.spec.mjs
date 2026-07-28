import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function moneyInput(page, name) {
  return page.getByRole("textbox", { name, exact: true });
}

test.describe("P0-V calculator audit", () => {
  test("acquisition tax shows heavy-rate local education tax as a separate policy amount", async ({ page }) => {
    await page.goto(`${baseUrl}/acquisition-tax-calculator`);
    await moneyInput(page, "주택 가격").fill("50,000");
    await page.getByLabel("취득 후 세대 주택 수").selectOption("fourOrMore");
    await page.getByLabel("전용면적 85㎡ 초과").selectOption("false");
    await page.getByRole("button", { name: "취득세 계산하기" }).click();

    await expect(page.getByText("예상 총 납부액")).toBeVisible();
    await expect(page.getByText("62,000,000원").first()).toBeVisible();
    await expect(page.getByText("지방교육세", { exact: true })).toBeVisible();
    await expect(page.getByText("2,000,000원").first()).toBeVisible();
  });

  test("DSR keeps actual repayment separate from stress assessment amounts", async ({ page }) => {
    await page.goto(`${baseUrl}/dsr-calculator`);
    await moneyInput(page, "연소득").fill("7,000");
    await moneyInput(page, "주택담보대출 금액").fill("30,000");
    await page.getByLabel("주담대 금리").fill("4");
    await page.getByLabel("주담대 기간").fill("30");
    await moneyInput(page, "기존 신용대출 잔액").fill("0");
    await page.getByLabel("기존 신용대출 금리").fill("0");
    await moneyInput(page, "기타대출 연상환액").fill("0");
    await page.getByLabel("스트레스 금리").fill("3");
    await page.getByRole("button", { name: "DSR 계산하기" }).click();

    await expect(page.getByText("일반 DSR", { exact: true })).toBeVisible();
    await expect(page.getByText("스트레스 DSR", { exact: true })).toBeVisible();
    await expect(page.getByText("실제 기준 월환산 원리금")).toBeVisible();
    await expect(page.getByText("심사용 월환산 원리금")).toBeVisible();
    await expect(page.getByText("1,432,246원").first()).toBeVisible();
    await expect(page.getByText("1,995,907원").first()).toBeVisible();
  });
});
