import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.jsx', 
                'resources/js/app-welcome.jsx',
                'resources/js/app-loveletter-create.jsx',
                'resources/js/app-loveletter-view.jsx',
                'resources/css/filament/admin/theme.css',
                'resources/js/welcome.js',
                'resources/js/bootstrap.js',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
})
