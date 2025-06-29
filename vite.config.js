import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit()
	],
	
	build: {
		target: 'es2022',
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['svelte'],
					menu: ['./src/lib/components/menu'],
					utils: ['./src/lib/utils']
				}
			}
		}
	},

	optimizeDeps: {
		include: ['date-fns']
	},

	server: {
		port: 5173,
		host: true
	},

	preview: {
		port: 4173,
		host: true
	},

	css: {
		postcss: './postcss.config.js'
	}
});
