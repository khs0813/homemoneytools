import contentMetadataJson from "@/config/content-metadata.json";

export type ContentDateMetadata = {
  datePublished: string;
  basisDate: string;
  dateModified: string;
  sourceCheckedAt: string;
};

type ContentMetadata = {
  calculators: Record<string, ContentDateMetadata>;
  guides: Record<string, ContentDateMetadata>;
};

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const contentMetadata = contentMetadataJson as ContentMetadata;

function assertDate(value: string, field: keyof ContentDateMetadata, slug: string) {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`Invalid ${field} for ${slug}: ${value}`);
  }
}

function assertDateOrder(metadata: ContentDateMetadata, slug: string) {
  assertDate(metadata.datePublished, "datePublished", slug);
  assertDate(metadata.basisDate, "basisDate", slug);
  assertDate(metadata.dateModified, "dateModified", slug);
  assertDate(metadata.sourceCheckedAt, "sourceCheckedAt", slug);

  if (metadata.dateModified < metadata.datePublished) {
    throw new Error(`dateModified must be >= datePublished for ${slug}`);
  }
  if (metadata.dateModified < metadata.basisDate) {
    throw new Error(`dateModified must be >= basisDate for ${slug}`);
  }
}

function getMetadata(record: Record<string, ContentDateMetadata>, slug: string, type: string): ContentDateMetadata {
  const metadata = record[slug];
  if (!metadata) {
    throw new Error(`Missing ${type} date metadata: ${slug}`);
  }
  assertDateOrder(metadata, `${type}:${slug}`);
  return metadata;
}

export function getCalculatorDateMetadata(slug: string): ContentDateMetadata {
  return getMetadata(contentMetadata.calculators, slug, "calculator");
}

export function getGuideDateMetadata(slug: string): ContentDateMetadata {
  return getMetadata(contentMetadata.guides, slug, "guide");
}

export function getAllContentDateMetadata(): ContentMetadata {
  return contentMetadata;
}
