import KanjiDetailClient from "@/components/KanjiDetailClient";

async function getKanjiDetail(char) {
  const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
  };

  try {
    // 1. Search first
    const searchRes = await fetch(
      `https://kanjialive-api.p.rapidapi.com/api/public/search/${encodeURIComponent(char)}`,
      { headers, cache: "no-store" },
    );

    if (!searchRes.ok) {
      return null;
    }

    const searchData = await searchRes.json();

    if (!searchData.length) {
      return null;
    }

    const kanjiChar =
      searchData[0]?.kanji?.character ||
      (typeof searchData[0]?.kanji === "string" ? searchData[0].kanji : null);

    if (!kanjiChar) {
      return null;
    }

    // 2. Get detail
    const detailRes = await fetch(
      `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${encodeURIComponent(kanjiChar)}`,
      { headers, cache: "no-store" },
    );

    if (!detailRes.ok) {
      return null;
    }

    const detailData = await detailRes.json();

    if (detailData?.Error) {
      return null;
    }

    return detailData;
  } catch (error) {
    console.error("Error fetching kanji detail:", error);
    return null;
  }
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
        <a
          href="/kanji"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          ← Back to Kanji List
        </a>
      </div>
    );
  }

  return <KanjiDetailClient kanji={data.kanji} kanjiData={data} />;
}
