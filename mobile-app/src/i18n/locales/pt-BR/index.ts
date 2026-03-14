import common from "./common.json";
import features from "./features.json";
import screens from "./screens.json";

// Combina todos os módulos, incluindo screens como namespace separado
export default {
  ...common,
  ...features,
  screens, // Mantém screens como namespace separado para evitar colisão
};

