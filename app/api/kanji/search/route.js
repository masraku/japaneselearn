export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(
    `https://kanjialive-api.p.rapidapi.com/api/public/search/${encodeURIComponent(
      q
    )}`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    }
  );

  const data = await res.json();
  return Response.json(data);
}
