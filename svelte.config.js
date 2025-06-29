import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$data: 'src/lib/data'
		},

		// Enhanced image processing
		serviceWorker: {
			register: false
		},

		// TypeScript configuration
		typescript: {
			config: (config) => {
				return {
					...config,
					compilerOptions: {
						...config.compilerOptions,
						allowJs: true,
						checkJs: true
					}
				};
			}
		},

		// CSP configuration for enhanced security
		csp: {
			mode: 'auto',
			directives: {
				'script-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'blob:'],
				'connect-src': ['self']
			}
		}
	}
};

export default config;
