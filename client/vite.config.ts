import { defineConfig } from 'vite';
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3030',
                changeOrigin: true
            },
        },
        watch: {
          usePolling: true
        }
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true
    }
})