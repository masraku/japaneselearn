// API route untuk mendapatkan kanji berdasarkan grade/level
// Grade mapping: 1-6 = Elementary school grades
// JLPT mapping: N5 ≈ grade 1-2, N4 ≈ grade 3-4, N3 ≈ grade 5-6

// Cache untuk menyimpan data dari API (karena /kanji/all mengembalikan semua 1235 kanji)
let cachedKanjiData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 jam

async function fetchAllKanji() {
  // Return cached data jika masih valid
  if (cachedKanjiData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedKanjiData;
  }

  const res = await fetch(
    `https://kanjialive-api.p.rapidapi.com/api/public/kanji/all`,
    {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch kanji data");
  }

  cachedKanjiData = await res.json();
  cacheTimestamp = Date.now();
  return cachedKanjiData;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade"); // 1-6

  if (!grade) {
    return Response.json({ error: "Missing grade parameter" }, { status: 400 });
  }

  try {
    const allKanji = await fetchAllKanji();
    
    // Filter berdasarkan grade
    const gradeNum = parseInt(grade);
    const filteredKanji = allKanji.filter(item => item.grade === gradeNum);
    
    // Extract kanji dengan full details
    const kanjiList = filteredKanji.map((item) => ({
      character: item.kanji?.character || item.ka_utf || "",
      meaning: item.kanji?.meaning?.english || item.meaning || "",
      onyomi: {
        katakana: item.kanji?.onyomi?.katakana || item.onyomi_ja || "",
        romaji: item.kanji?.onyomi?.romaji || item.onyomi || "",
      },
      kunyomi: {
        hiragana: item.kanji?.kunyomi?.hiragana || item.kunyomi_ja || "",
        romaji: item.kanji?.kunyomi?.romaji || item.kunyomi || "",
      },
      strokes: item.kanji?.strokes?.count || item.kstroke || 0,
    })).filter(k => k.character);

    return Response.json({ 
      grade,
      count: kanjiList.length,
      kanji: kanjiList 
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
