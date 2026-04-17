import { View, useWindowDimensions } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from 'react-native-svg';

export function AtmosphericBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      className="absolute inset-0 bg-bg-deeper"
      pointerEvents="none"
    >
      <Svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <RadialGradient
            id="mesh-top"
            cx="50%"
            cy="28%"
            rx="70%"
            ry="50%"
            fx="50%"
            fy="28%"
          >
            <Stop offset="0%" stopColor="rgb(130,145,180)" stopOpacity={0.16} />
            <Stop offset="60%" stopColor="rgb(130,145,180)" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="mesh-bl"
            cx="15%"
            cy="75%"
            rx="60%"
            ry="50%"
            fx="15%"
            fy="75%"
          >
            <Stop
              offset="0%"
              stopColor="rgb(180,150,100)"
              stopOpacity={0.055}
            />
            <Stop offset="55%" stopColor="rgb(180,150,100)" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient
            id="mesh-br"
            cx="90%"
            cy="90%"
            rx="55%"
            ry="60%"
            fx="90%"
            fy="90%"
          >
            <Stop offset="0%" stopColor="rgb(70,90,120)" stopOpacity={0.12} />
            <Stop offset="55%" stopColor="rgb(70,90,120)" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse
          cx="50%"
          cy="28%"
          rx="70%"
          ry="50%"
          fill="url(#mesh-top)"
        />
        <Ellipse
          cx="15%"
          cy="75%"
          rx="60%"
          ry="50%"
          fill="url(#mesh-bl)"
        />
        <Ellipse
          cx="90%"
          cy="90%"
          rx="55%"
          ry="60%"
          fill="url(#mesh-br)"
        />
      </Svg>
    </View>
  );
}
