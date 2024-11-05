const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: {
    server: "./server.js",
    cdn: "./cdn/server.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "ejs-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "frontend/template", to: "frontend/template" }],
    }),
  ],
};
