import { permanentRedirect } from "next/navigation";

export default function LegacyGuideRedirectPage() {
  permanentRedirect("/guides/acquisition-tax-checklist");
}
