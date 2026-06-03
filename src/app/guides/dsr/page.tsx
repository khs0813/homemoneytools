import { permanentRedirect } from "next/navigation";

export default function LegacyGuideRedirectPage() {
  permanentRedirect("/guides/what-dsr-40-means");
}
