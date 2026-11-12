import { describe, it, expect } from 'vitest';
import { calculateQuote, type QuoteInput } from '../lib/pricing';
const base: QuoteInput = { address:'123 Main Street', feet:200, tier:1, wreaths:0, pathwayFeet:0, timer:false, storage:false, date:'2026-11-19' };
describe('HolidayFX commercial pricing', () => {
  it('charges $5 per roofline foot', () => expect(calculateQuote(base).roofline).toBe(1000));
  it('applies the 1.0 simple multiplier', () => expect(calculateQuote({...base,tier:1}).total).toBe(1000));
  it('applies the 1.35 steep multiplier', () => expect(calculateQuote({...base,tier:2}).total).toBe(1350));
  it('applies the 1.75 estate multiplier', () => expect(calculateQuote({...base,tier:3}).total).toBe(1750));
  it('charges $75 per wreath', () => expect(calculateQuote({...base,wreaths:2}).addons).toBe(150));
  it('charges $3.50 per pathway foot', () => expect(calculateQuote({...base,pathwayFeet:40}).addons).toBe(140));
  it('charges $50 for a timer', () => expect(calculateQuote({...base,timer:true}).addons).toBe(50));
  it('charges $150 for takedown and storage', () => expect(calculateQuote({...base,storage:true}).addons).toBe(150));
  it('applies 15% November 20 through December 20 inclusive', () => {
    for(const date of ['2026-11-20','2026-12-01','2026-12-20']) expect(calculateQuote({...base,date}).surcharge).toBe(150);
    for(const date of ['2026-11-19','2026-12-21']) expect(calculateQuote({...base,date}).surcharge).toBe(0);
  });
  it('requires 50% deposit on total including extras and surcharge', () => expect(calculateQuote({...base,wreaths:2,timer:true,storage:true,pathwayFeet:40,date:'2026-12-01'}).deposit).toBe(856.75));
});