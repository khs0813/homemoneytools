import { permanentRedirect } from "next/navigation";

export default function LegacyGuideRedirectPage() {
  permanentRedirect("/guides/brokerage-fee-negotiation");
}
