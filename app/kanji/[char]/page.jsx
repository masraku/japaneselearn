import KanjiDetailClient from "@/components/KanjiDetailClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getKanjiDetail(char) {
  const res = await fetch(
    `${BASE_URL}/api/kanji/detail?q=${encodeURIComponent(char)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function KanjiDetailPage({ params }) {
  const { char } = await params;
  const decodedChar = decodeURIComponent(char);
  
  if (!decodedChar) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Kanji not found</p>
      </div>
    );
  }

  const data = await getKanjiDetail(decodedChar);
  
  if (!data || !data.kanji) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">Could not load kanji details</p>
        <a href="/kanji" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Kanji List
        </a>
      </div>
    );
  }

  return <KanjiDetailClient kanji={data.kanji} kanjiData={data} />;
}
