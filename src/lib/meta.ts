export const pageHead = (title: string, description: string) => ({ meta: [
  {title: `${title} | HolidayFX`}, {name:'description',content:description},
  {property:'og:title',content:`${title} | HolidayFX`}, {property:'og:description',content:description},
  {property:'og:type',content:'website'}, {name:'twitter:card',content:'summary_large_image'},
] });