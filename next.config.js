/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["itbook.store"],
  },
};

module.exports = removeImports(nextConfig);

// module.exports = nextConfig;
