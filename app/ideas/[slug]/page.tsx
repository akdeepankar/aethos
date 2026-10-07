import IdeaDetailClient from "./idea-detail";

export function generateStaticParams() {
  return [
    { slug: "racl-geartech" },
    { slug: "spectra-a-tech" },
    { slug: "spectraa-technology-solutions" },
  ];
}

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <IdeaDetailClient slug={slug} />;
}
