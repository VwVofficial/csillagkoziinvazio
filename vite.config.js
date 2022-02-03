import { defineConfig } from 'vite';
import { createHtmlPlugin as html } from 'vite-plugin-html';

export default defineConfig({
	plugins: [html({ minify: true })],
	build: {
		minify: 'esbuild',
	},
});
