export type BlogFaqItem = {
  question: string;
  answer: string;
};

export function parseBlogFaqJson(raw: string | null | undefined): BlogFaqItem[] {
  if (!raw || !raw.trim()) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter((x): x is { question: string; answer: string } => {
        return Boolean(x) && typeof (x as { question?: string }).question === "string" && typeof (x as { answer?: string }).answer === "string";
      })
      .map((x) => ({ question: x.question.trim(), answer: x.answer.trim() }))
      .filter((x) => x.question.length > 0 && x.answer.length > 0);
  } catch {
    return [];
  }
}

export function normalizeFaqFromDb(raw: unknown): BlogFaqItem[] {
  if (raw == null) return [];
  if (typeof raw === "string") return parseBlogFaqJson(raw);
  if (Array.isArray(raw)) {
    return raw
      .map((x) => {
        if (!x || typeof x !== "object") return null;
        const q = (x as { question?: unknown }).question;
        const a = (x as { answer?: unknown }).answer;
        if (typeof q !== "string" || typeof a !== "string") return null;
        return { question: q.trim(), answer: a.trim() };
      })
      .filter((x): x is BlogFaqItem => Boolean(x && x.question && x.answer));
  }
  return [];
}

export function faqItemsToJsonLd(items: BlogFaqItem[]) {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
