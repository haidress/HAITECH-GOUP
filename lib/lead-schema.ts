import { z } from "zod";

export const leadSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis."),
  email: z.email("Email invalide."),
  telephone: z.string().trim().min(8, "Numéro invalide.").max(25, "Numéro invalide.").optional(),
  source: z.enum(["site", "whatsapp", "autre"]).default("site"),
  besoin: z.string().trim().min(10, "Décrivez davantage votre besoin."),
  budget: z.number().positive("Budget invalide.").optional()
});

export type LeadInput = z.infer<typeof leadSchema>;
