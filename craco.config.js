const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
        },
      },
    },
    plugins: {
      add: [
        new MonacoWebpackPlugin({
          languages: [],
        }),
      ],
    },
  },
};
