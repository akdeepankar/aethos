import IpoDetailClient from "./ipo-detail";

export function generateStaticParams() {
  return [
    { slug: "spectraa-technology-solutions" },
    { slug: "gulf-lloyds-india" },
    { slug: "cube-highways-trust" },
    { slug: "vans-electroengineering" },
  ];
}

export default async function IpoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <IpoDetailClient slug={slug} />;
}
