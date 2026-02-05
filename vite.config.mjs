import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        __DEV__: true,
        global: 'window',
        'process.env.NODE_ENV': JSON.stringify('development'),
    },
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
        extensions: [
            '.web.js',
            '.web.jsx',
            '.js',
            '.jsx',
        ],
    },
    optimizeDeps: {
        include: [
            'react-native-web',
            '@react-navigation/native',
            '@react-navigation/native-stack',
            'react-native-gifted-chat',
            'socket.io-client'
        ],
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
            mainFields: ['module', 'main'],
            resolveExtensions: ['.web.js', '.js', '.jsx'],
        },
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.js$|index.*\.js$/,
        exclude: [],
    },
});
