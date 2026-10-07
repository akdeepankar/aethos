import ResearchDetailClient from "./research-detail";

export function generateStaticParams() {
  return [
    { slug: "logistics-stack" },
    { slug: "indias-transmission-opportunity" },
    { slug: "indian-affluent-consumer" },
    { slug: "spectraa-technology-solutions" },
    { slug: "racl-geartech" },
  ];
}

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ResearchDetailClient slug={slug} />;
}
