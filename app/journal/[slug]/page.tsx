import JournalPostClient from "./journal-detail";

export function generateStaticParams() {
  return [
    { slug: "memo-1" },
    { slug: "memo-2" },
    { slug: "market-update" },
  ];
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <JournalPostClient slug={slug} />;
}
