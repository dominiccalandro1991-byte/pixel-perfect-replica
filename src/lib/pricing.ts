import { z } from 'zod';

export const quoteSchema = z.object({
  address: z.string().trim().min(5, 'Enter your installation address.').max(300),
  feet: z.number().int().min(100).max(5000),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  wreaths: z.number().int().min(0).max(50),
  pathwayFeet: z.number().int().min(0).max(5000),
  timer: z.boolean(),
  storage: z.boolean(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => !Number.isNaN(Date.parse(v)), 'Select a valid date.'),
});
export type QuoteInput = z.infer<typeof quoteSchema>;
export function calculateQuote(input: QuoteInput) {
  const roofline = input.feet * 5 * ({ 1: 1, 2: 1.35, 3: 1.75 }[input.tier]);
  const addons = input.wreaths * 75 + input.pathwayFeet * 3.5 + (input.timer ? 50 : 0) + (input.storage ? 150 : 0);
  const monthDay = input.date.slice(5);
  const peak = monthDay >= '11-20' && monthDay <= '12-20';
  const surcharge = peak ? Math.round((roofline + addons) * .15 * 100) / 100 : 0;
  const total = Math.round((roofline + addons + surcharge) * 100) / 100;
  return { roofline, addons, surcharge, total, deposit: Math.round(total * 50) / 100, peak };
}
export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);