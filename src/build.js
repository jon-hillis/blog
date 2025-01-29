const MarkdownConverter = require('./markdown');
const fs = require('fs/promises');
const path = require('path');

async function build() {
    // Initialize markdown converter
    const converter = new MarkdownConverter();
    await converter.init();

    // Create dist directory if it doesn't exist
    await fs.mkdir('dist', { recursive: true });

    // Copy static files
    await fs.cp('public', 'dist', { recursive: true });

    // Process markdown files
    const contentDir = 'content';
    const files = await fs.readdir(contentDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const html = await converter.convertFile(path.join(contentDir, file));
            const outputPath = path.join('dist', file.replace('.md', '.html'));
            await fs.writeFile(outputPath, html);
        }
    }

    console.log('Build completed successfully!');
}

build().catch(console.error); 