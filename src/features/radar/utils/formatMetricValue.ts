const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type MetricFormatOptions = {
  compact?: boolean;
};

export function formatMetricValue(
  value: number,
  unit: string,
  valueLabel: string,
  options: MetricFormatOptions = {},
): string {
  const normalizedUnit = unit.toLowerCase();
  const normalizedLabel = valueLabel.toLowerCase();
  const formatter = options.compact ? compactFormat : numberFormat;

  if (/usd|dólar|dolar/.test(normalizedLabel)) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      notation: options.compact ? "compact" : "standard",
      maximumFractionDigits: options.compact ? 1 : 2,
    }).format(value);
  }

  if (/peso|ars/.test(normalizedUnit) || /\bars\b/.test(normalizedLabel)) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      notation: options.compact ? "compact" : "standard",
      maximumFractionDigits: options.compact ? 1 : 2,
    }).format(value);
  }

  const formatted = formatter.format(value);
  if (/puntos porcentuales/i.test(unit) || /incidencia/i.test(valueLabel)) {
    return `${formatted} pp`;
  }
  if (/porcentaje|%/.test(normalizedUnit) || /\(%\)/.test(valueLabel)) {
    return `${formatted}%`;
  }
  if (/personas/.test(normalizedUnit)) {
    return options.compact ? `${formatted} pers.` : `${formatted} personas`;
  }
  if (/índice|indice/.test(normalizedUnit) || /índice|indice/.test(normalizedLabel)) {
    return options.compact ? formatted : `${formatted} puntos de índice`;
  }
  return formatted;
}
