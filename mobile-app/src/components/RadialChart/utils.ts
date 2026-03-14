import { ArcSegment, RadialChartData } from "./types";

/**
 * Converte coordenadas polares para cartesianas
 */
export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

/**
 * Calcula as porcentagens de cada categoria baseado no total
 */
export const calculatePercentages = (data: RadialChartData[]): ArcSegment[] => {
  // Filtrar apenas categorias com valor > 0
  const validData = data.filter((item) => item.value > 0);

  // Calcular total
  const total = validData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return [];
  }

  // Calcular ângulos para cada categoria
  let currentAngle = 0;
  const segments: ArcSegment[] = validData.map((item) => {
    const percentage = (item.value / total) * 100;
    const angleRange = (percentage / 100) * 360;

    const segment: ArcSegment = {
      category: item.category,
      value: item.value,
      percentage: parseFloat(percentage.toFixed(1)),
      color: item.color,
      startAngle: currentAngle,
      endAngle: currentAngle + angleRange,
    };

    currentAngle += angleRange;

    return segment;
  });

  return segments;
};

/**
 * Gera o path SVG para um arco
 */
export const generateArcPath = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
};
