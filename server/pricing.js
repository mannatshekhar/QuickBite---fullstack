// Single source of truth for money maths (client mirrors these values)
const DELIVERY_FEE = 40;
const FREE_DELIVERY_ABOVE = 499;
const TAX_RATE = 0.05;

function calcTotals(subtotal) {
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
  return { subtotal, deliveryFee, tax, total };
}
module.exports = { calcTotals, DELIVERY_FEE, FREE_DELIVERY_ABOVE, TAX_RATE };
