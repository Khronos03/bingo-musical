import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        {
            name: 'bingo-json-persistence',
            configureServer(server) {
                const songsPath = resolve(__dirname, 'src', 'data', 'songs.json');
                const cardsPath = resolve(__dirname, 'src', 'data', 'cards.json');

                server.middlewares.use((req, res, next) => {
                    if (req.method !== 'POST' || !req.url?.startsWith('/__bingo-data/')) {
                        return next();
                    }

                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        try {
                            const parsed = JSON.parse(body || '{}');

                            if (req.url === '/__bingo-data/save-songs') {
                                await writeFile(songsPath, JSON.stringify(parsed.songs ?? [], null, 2) + '\n');
                                res.statusCode = 200;
                                res.end('OK');
                                return;
                            }

                            if (req.url === '/__bingo-data/save-cards') {
                                await writeFile(cardsPath, JSON.stringify(parsed.cards ?? [], null, 2) + '\n');
                                res.statusCode = 200;
                                res.end('OK');
                                return;
                            }

                            next();
                        } catch (error) {
                            res.statusCode = 400;
                            res.end('Invalid JSON');
                        }
                    });

                    req.on('error', next);
                });
            },
        },
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
});
