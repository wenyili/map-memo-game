/** @type {import('next').NextConfig} */
import CopyPlugin from 'copy-webpack-plugin';

const nextConfig = {
    reactStrictMode: false,
    webpack: (config, {}) => {
        config.plugins.push(
          new CopyPlugin({
            patterns: [
              {
                from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
                to: "static/chunks/[name][ext]",
              },
            ],
          })
        )
        return config
    }
};

export default nextConfig;
