export function isValidId(id) {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}
