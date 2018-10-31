const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: __dirname + "/dist"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".js", ".ts"]
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: "awesome-typescript-loader" },
      { test: /\.js$/, loader: "source-map-loader", enforce: "pre" }
    ]
  },

  devServer: {
    publicPath: "/",
    overlay: true
  }
};

module.exports.plugins = (module.exports.plugins || []).concat([
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  })
]);
