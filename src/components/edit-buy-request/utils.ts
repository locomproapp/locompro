
export function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || isNaN(value) || value === 0) return "";
  return (
    "$" +
    value
      .toLocaleString("es-AR", {
        maximumFractionDigits: 0,
        useGrouping: true,
      })
      .replace(/\./g, ".")
  );
}

export function parseCurrencyInput(input: string) {
  if (!input) return null;
  const cleaned = input.replace(/\D/g, "");
  return cleaned ? parseInt(cleaned, 10) : null;
}
