
const stopWords = new Set([
  "the", "is", "are", "was", "were", "a", "an", "and",
  "or", "but", "in", "on", "at", "to", "of", "for",
  "with", "by", "as", "it", "this", "that", "from",
  "be", "been", "being", "has", "have", "had", "we",
  "they", "their", "you", "your", "he", "she", "his",
  "her", "i", "our", "can", "will", "would", "could"
]);

function createDemoSummary(text, length) {
  const sentences = text
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g);

  if (!sentences) return text.trim();

  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  const frequency = {};

  for (const word of words) {
    if (!stopWords.has(word) && word.length > 2) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  }

  const scored = sentences.map((sentence, index) => {
    const sentenceWords =
      sentence.toLowerCase().match(/[a-z0-9]+/g) || [];

    let score = 0;

    for (const word of sentenceWords) {
      score += frequency[word] || 0;
    }

    return {
      sentence: sentence.trim(),
      index,
      score: score / Math.sqrt(sentenceWords.length || 1)
    };
  });

  const count = {
    short: 2,
    medium: 4,
    detailed: 6
  }[length];

  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(count, sentences.length))
    .sort((a, b) => a.index - b.index);

  return selected.map(item => item.sentence).join(" ");
}

export async function GET() {
  return Response.json({
    status: "success",
    mode: "demo",
    message: "Smart Summarizer Demo API is working!"
  });
}

export async function POST(request) {
  try {
    const { text, length } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return Response.json(
        { error: "Please enter some text." },
        { status: 400 }
      );
    }

    if (text.length > 12000) {
      return Response.json(
        { error: "Maximum text length is 12,000 characters." },
        { status: 400 }
      );
    }

    if (!["short", "medium", "detailed"].includes(length)) {
      return Response.json(
        { error: "Please select a valid summary length." },
        { status: 400 }
      );
    }

    const summary = createDemoSummary(text, length);

    return Response.json({
      status: "success",
      mode: "demo",
      summary
    });

  } catch (error) {
    console.error("Demo API error:", error);

    return Response.json(
      { error: "Unable to generate demo summary." },
      { status: 500 }
    );
  }
}
