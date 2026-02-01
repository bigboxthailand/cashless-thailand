import type { APIRoute } from 'astro';
import { appendFile } from 'fs/promises';
import { join } from 'path';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { question, answer, category } = await request.json();

        if (!question || !answer) {
            return new Response(JSON.stringify({ error: 'Missing question or answer' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Format the knowledge entry
        const timestamp = new Date().toISOString();
        const categoryTag = category ? ` [${category.toUpperCase()}]` : '';
        const entry = `
## ${question}${categoryTag}
_Added: ${new Date().toLocaleDateString('th-TH')}_

${answer}

---

`;

        // Append to ADMIN_ANSWERS.md
        const filePath = join(process.cwd(), 'src/pages/manual/ADMIN_ANSWERS.md');
        await appendFile(filePath, entry, 'utf-8');

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error appending to knowledge base:', error);
        return new Response(JSON.stringify({ error: 'Failed to append knowledge' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
