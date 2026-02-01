export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
  };

  // 1. search dulu
  const searchRes = await fetch(
    `https://kanjialive-api.p.rapidapi.com/api/public/search/${encodeURIComponent(
      q
    )}`,
    { headers }
  );

  const searchData = await searchRes.json();

  if (!searchData.length) {
    return Response.json({ error: "No kanji found" }, { status: 404 });
  }

  const kanjiChar =
    searchData[0]?.kanji?.character ||
    (typeof searchData[0]?.kanji === "string"
      ? searchData[0].kanji
      : null);

  if (!kanjiChar) {
    return Response.json({ error: "Invalid kanji data" }, { status: 500 });
  }

  // 2. detail
  const detailRes = await fetch(
    `https://kanjialive-api.p.rapidapi.com/api/public/kanji/${encodeURIComponent(
      kanjiChar
    )}`,
    { headers }
  );

  const detailData = await detailRes.json();

  if (detailData?.Error) {
    return Response.json({ error: detailData.Error }, { status: 404 });
  }

  return Response.json(detailData);
}
