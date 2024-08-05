/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };

// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// const defaultConfig = getDefaultConfig(__dirname);

// const {
//   resolver: { sourceExts, assetExts },
// } = getDefaultConfig(__dirname);

// const config = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//     // babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     assetExts: assetExts.filter(ext => ext !== 'svg'),
//     sourceExts: [...sourceExts, 'svg'],
//   },
//   overrides: [
//     {
//       test: './node_modules/ethers',
//       plugins: [
//         '@babel/plugin-proposal-private-property-in-object',
//         '@babel/plugin-proposal-class-properties',
//         '@babel/plugin-proposal-private-methods'
//       ]
//     }
//   ]
// };

// module.exports = mergeConfig(defaultConfig, config);

// module.exports = {
//     transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
//   plugins: ['react-native-reanimated/plugin'],
//   presets: ['module:metro-react-native-babel-preset'],
//   overrides: [
//     {
//       test: './node_modules/ethers',
//       plugins: [
//         '@babel/plugin-proposal-private-property-in-object',
//         '@babel/plugin-proposal-class-properties',
//         '@babel/plugin-proposal-private-methods'
//       ]
//     }
//   ]
// };

// const { getDefaultConfig } = require("metro-config")

// metroConfig = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig()
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve("react-native-svg-transformer"),
//       getTransformOptions: async () => ({
//         transform: {
//           experimentalImportSupport: false,
//           inlineRequires: false,
//         },
//       }),
//     },
//     resolver: {
//       assetExts: assetExts.filter((ext) => ext !== "svg"),
//       sourceExts: [...sourceExts, "svg"],
//     },
//   }
// })()

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  presets: ['module:@react-native/babel-preset'],
  // plugins: ['react-native-paper/babel', '@babel/plugin-transform-private-methods', '@babel/plugin-proposal-class-properties'],


  // presets: ['module:metro-react-native-babel-preset'],
  // overrides: [{
  //   "plugins": [
  //     ["@babel/plugin-transform-private-methods", {
  //     "loose": true
  //   }]
  //   ]
  // }]
};

module.exports = mergeConfig(defaultConfig, config);