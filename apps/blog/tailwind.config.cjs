const baseConfig = require("@repo/config/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
};
