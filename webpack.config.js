import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WorkboxWebpackPlugin from "workbox-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(new URL(".", import.meta.url).pathname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                quietDeps: true,
              },
            },
          },
        ],
      },
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = "production";
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
