export function formatNationalPopulationDimensions(row: Record<string, unknown>): string {
  const age = row["edad"];
  const rawSex = row["sexo_nom"];
  const sexCode = String(row["sexo_cod"] ?? "");
  const sex = rawSex ?? (sexCode === "1" ? "Mujer" : sexCode === "2" ? "Varón" : null);
  const dimensions = [
    age === null || age === undefined || String(age).trim() === "" ? null : `Edad: ${String(age)}`,
    sex === null || sex === undefined || String(sex).trim() === "" ? null : `Sexo: ${String(sex)}`,
  ].filter((value): value is string => value !== null);
  return dimensions.length > 0 ? dimensions.join(" · ") : "—";
}
