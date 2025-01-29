const marked = require('marked');
const fs = require('fs/promises');
const path = require('path');

class MarkdownConverter {
    constructor(templatesDir = 'templates') {
        this.templatesDir = templatesDir;
        this.postTemplate = '';
    }

    async init() {
        this.postTemplate = await fs.readFile(
            path.join(this.templatesDir, 'post.html'),
            'utf-8'
        );
    }

    async convertFile(markdownPath) {
        const markdown = await fs.readFile(markdownPath, 'utf-8');
        return this.convert(markdown);
    }

    convert(markdown) {
        const frontMatter = this.parseFrontMatter(markdown);
        const content = marked.parse(frontMatter.content);
        
        return this.applyTemplate({
            ...frontMatter.data,
            content
        });
    }

    parseFrontMatter(markdown) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontMatterRegex);

        if (!match) {
            return {
                data: {},
                content: markdown
            };
        }

        const data = {};
        const frontMatterLines = match[1].split('\n');
        
        frontMatterLines.forEach(line => {
            const [key, ...value] = line.split(':');
            if (key && value) {
                data[key.trim()] = value.join(':').trim();
            }
        });

        return {
            data,
            content: match[2]
        };
    }

    applyTemplate(data) {
        let html = this.postTemplate;
        
        // Replace template variables
        Object.entries(data).forEach(([key, value]) => {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        // Format date
        html = html.replace(/{{formatDate ([^}]+)}}/g, (_, date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });

        return html;
    }
}

module.exports = MarkdownConverter; 