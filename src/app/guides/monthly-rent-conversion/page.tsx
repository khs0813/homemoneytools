import { permanentRedirect } from "next/navigation";

export default function LegacyGuideRedirectPage() {
  permanentRedirect("/guides/monthly-rent-conversion-basics");
}
