import { View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Svg,
  Text as SvgText,
} from "react-native-svg";

import { ArcSegment } from "./ArcSegment";
import { RadialChartData } from "./types";
import { calculatePercentages, polarToCartesian } from "./utils";

import { CustomText } from "@/components";
import { getCategoryConfig } from "@/constants/categoryConfig";
import { CategorySummary } from "@/types";

type RadialChartProps = {
  data: CategorySummary[];
  size?: number;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const RadialChart = ({ data, size = 300 }: RadialChartProps) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const strokeWidth = 10;

  // Preparar dados com cores
  const chartData: RadialChartData[] = data.map((item) => ({
    category: item.category,
    value: item.value,
    color: getCategoryConfig(item.category).color,
  }));

  // Calcular segmentos com porcentagens
  const segments = calculatePercentages(chartData);

  // Se não houver dados, mostrar mensagem
  if (segments.length === 0) {
    return (
      <View className="items-center justify-center" style={{ height: size }}>
        <CustomText className="text-neutral-400">
          Nenhum gasto registrado
        </CustomText>
      </View>
    );
  }

  return (
    <AnimatedView
      entering={FadeIn.duration(600)}
      className="items-center justify-center"
    >
      <Animated.View entering={ZoomIn.duration(800).delay(200)}>
        <Svg width={size} height={size}>
          <Defs>
            {/* Definir gradientes para efeito glow em cada categoria */}
            {segments.map((segment, index) => (
              <RadialGradient
                key={`gradient-${segment.category}-${index}`}
                id={`glow-${segment.category}-${index}`}
                cx="50%"
                cy="50%"
              >
                <Stop offset="0%" stopColor={segment.color} stopOpacity="0.8" />
                <Stop
                  offset="50%"
                  stopColor={segment.color}
                  stopOpacity="0.4"
                />
                <Stop offset="100%" stopColor={segment.color} stopOpacity="0" />
              </RadialGradient>
            ))}
          </Defs>

          {/* Círculos concêntricos de fundo */}
          {[0.25, 0.5, 0.75, 1].map((scale, index) => (
            <Circle
              key={`circle-${index}`}
              cx={centerX}
              cy={centerY}
              r={radius * scale}
              stroke="#2a2a2a"
              strokeWidth={1}
              fill="none"
              opacity={0.3}
            />
          ))}

          {/* Renderizar arcos com glow */}
          {segments.map((segment, index) => (
            <ArcSegment
              key={`arc-${segment.category}-${index}`}
              centerX={centerX}
              centerY={centerY}
              radius={radius}
              startAngle={segment.startAngle}
              endAngle={segment.endAngle}
              color={segment.color}
              strokeWidth={strokeWidth}
              delay={index * 150}
            />
          ))}

          {/* Labels de porcentagem */}
          {segments.map((segment, index) => {
            const midAngle =
              segment.startAngle + (segment.endAngle - segment.startAngle) / 2;
            const labelRadius = radius + 35;
            const labelPos = polarToCartesian(
              centerX,
              centerY,
              labelRadius,
              midAngle
            );

            return (
              <SvgText
                key={`label-${segment.category}-${index}`}
                x={labelPos.x}
                y={labelPos.y}
                fill="white"
                fontSize={14}
                fontWeight="600"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {segment.percentage}%
              </SvgText>
            );
          })}
        </Svg>
      </Animated.View>

      {/* Legenda das categorias */}
      <View className="mt-6 flex-row flex-wrap justify-center px-4">
        {segments.map((segment, index) => (
          <AnimatedView
            key={`legend-${segment.category}`}
            entering={FadeIn.duration(500).delay(800 + index * 100)}
            className="m-2 flex-row items-center"
          >
            <View
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <CustomText className="text-sm text-white">
              {segment.category}
            </CustomText>
          </AnimatedView>
        ))}
      </View>
    </AnimatedView>
  );
};
