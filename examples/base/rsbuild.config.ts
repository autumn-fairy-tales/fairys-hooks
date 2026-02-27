import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { getLoadingHtmlTags, RsbuildReactRoutesPlugin } from '@fairys/admin-tools-react-plugins';
import { pluginMockServer } from 'rspack-plugin-mock/rsbuild';

export default defineConfig({
  output: {
    assetPrefix: '/fairys-hooks/example/',
  },
  server: {
    base: '/fairys-hooks/example/',
    // The plugin will read the `proxy` option from the `server`
    proxy: {
      '/api': 'http://example.com',
    },
  },
  html: {
    title: 'Fairys Hooks',
    favicon: './public/logo.png',
    tags: getLoadingHtmlTags('Fairys'),
  },
  plugins: [
    pluginMockServer(),
    pluginReact(),
    RsbuildReactRoutesPlugin({
      loadType: 'lazy',
      keepAliveBasePath: '@fairys/admin-tools-react/lib/components/keep-alive',
    }),
  ],
  tools: {
    postcss: (_, { addPlugins }) => {
      addPlugins([tailwindcss()]);
    },
  },
});
