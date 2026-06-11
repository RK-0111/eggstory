/** 9900 (paise) -> "₹99" ; 19950 -> "₹199.50" */
export function formatRupees(paise) {
  const rupees = paise / 100;
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}
