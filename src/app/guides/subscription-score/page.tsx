import { permanentRedirect } from "next/navigation";

export default function LegacyGuideRedirectPage() {
  permanentRedirect("/guides/subscription-score-interpretation");
}
