module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', // Expo 프로젝트에 필요한 Babel 프리셋
    ],
    plugins: [
      'react-native-reanimated/plugin', // Reanimated 관련 플러그인 추가 (항상 마지막에 위치해야 함)
    ],
  };
};
