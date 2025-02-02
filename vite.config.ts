import { defineConfig } from "vite";
import VitePluginString from "vite-plugin-string";

export default defineConfig({
  plugins: [
    VitePluginString({
      include: "**/*.scss", // Treat all SCSS files as strings
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/components/my-dropdown.scss";`,
      },
    },
  },
});
