/**
 * Product catalog.
 *
 * This is the SINGLE SOURCE OF TRUTH for prices. The frontend only ever
 * displays what this module says; order totals are always recalculated
 * here on the server so a tampered browser request can't change a price.
 *
 * Prices are stored in PAISE (₹99 = 9900) because Razorpay expects the
 * smallest currency unit.
 *
 * To move to a real database later: keep the same shape, replace this
 * array with DB queries inside services/products.service.js. Nothing
 * else in the codebase needs to change.
 */

export const products = [
  {
    id: 'brown-6',
    stock: 100,
    category: 'brown',
    name: 'Free Range Brown Eggs',
    packSize: 6,
    pricePaise: 9900,
    tagline: 'The starter half-dozen',
    description: 'Six free range brown eggs from pasture-raised hens.',
  },
  {
    id: 'brown-12',
    stock: 100,
    category: 'brown',
    name: 'Free Range Brown Eggs',
    packSize: 12,
    pricePaise: 19900,
    tagline: 'A full week of breakfasts',
    description: 'Twelve free range brown eggs from pasture-raised hens.',
  },
  {
    id: 'brown-24',
    stock: 100,
    category: 'brown',
    name: 'Free Range Brown Eggs',
    packSize: 24,
    pricePaise: 39900,
    tagline: 'For the family kitchen',
    description: 'Twenty-four free range brown eggs from pasture-raised hens.',
  },
  {
    id: 'brown-30',
    stock: 100,
    category: 'brown',
    name: 'Free Range Brown Eggs',
    packSize: 30,
    pricePaise: 49900,
    tagline: 'Best value tray',
    description: 'A full tray of thirty free range brown eggs.',
  },
  {
    id: 'quail-12',
    stock: 60,
    category: 'quail',
    name: 'Quail Eggs',
    packSize: 12,
    pricePaise: 9900,
    tagline: 'Small eggs, big flavour',
    description: 'Twelve speckled quail eggs, delicate and rich.',
  },
];
