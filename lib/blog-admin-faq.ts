import { z } from "zod";

const faqItemSchema = z.object({
  question: z.string().trim().min(4).max(400),
  answer: z.string().trim().min(20).max(2000)
});

const faqArraySchema = z.array(faqItemSchema).max(10);

export function normalizeFaqJsonForDb(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("FAQ_JSON_PARSE");
  }
  const result = faqArraySchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("FAQ_JSON_INVALID");
  }
  return JSON.stringify(result.data);
}
