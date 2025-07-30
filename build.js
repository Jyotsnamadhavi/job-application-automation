#!/usr/bin/env node

import { build } from 'esbuild';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Ensure dist directory exists
if (!existsSync('dist')) {
    await mkdir('dist');
}

// Build configuration
const buildConfig = {
    entryPoints: {
        'content': 'frontend/content.js',
        'background': 'backend/background.js',
        'popup': 'frontend/popup.js'
    },
    bundle: true,
    outdir: 'dist',
    format: 'iife', // Immediately Invoked Function Expression
    target: ['chrome58'], // Target Chrome 58+ for extension compatibility
    minify: false, // Keep readable for debugging
    sourcemap: true,
    external: [], // Bundle everything
    define: {
        'process.env.NODE_ENV': '"production"'
    }
};

// Build function
async function buildExtension() {
    console.log('🔨 Building Chrome Extension...');
    
    try {
        const result = await build(buildConfig);
        
        if (result.errors.length > 0) {
            console.error('❌ Build errors:', result.errors);
            process.exit(1);
        }
        
        if (result.warnings.length > 0) {
            console.warn('⚠️ Build warnings:', result.warnings);
        }
        
        console.log('✅ Extension built successfully!');
        console.log('📁 Output files:');
        
        // List generated files
        const files = await readdir('dist');
        files.forEach(file => {
            console.log(`   - dist/${file}`);
        });
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Watch mode for development
async function watchExtension() {
    console.log('👀 Watching for changes...');
    
    const context = await build({
        ...buildConfig,
        watch: {
            onRebuild(error, result) {
                if (error) {
                    console.error('❌ Watch build failed:', error);
                } else {
                    console.log('✅ Rebuilt successfully!');
                }
            }
        }
    });
    
    // Keep the process running
    process.on('SIGINT', () => {
        context.dispose();
        process.exit(0);
    });
}

// Run based on command line arguments
const args = process.argv.slice(2);
if (args.includes('--watch')) {
    watchExtension();
} else {
    buildExtension();
} 