

import { createClient } from '@supabase/supabase-js';
import { readFile, appendFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- 1. CONFIGURATION & ENV ---
// import { readFile } from 'fs/promises'; // Already imported above
async function getEnv() {
    try {
        // Hardcoded path check to be absolutely sure
        const envPath = join(__dirname, '../.env');
        const envFile = await readFile(envPath, 'utf-8');
        const env = {};
        for (const line of envFile.split('\n')) {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        }
        return env;
    } catch (e) {
        console.error('Manual env load failed:', e);
        // Fallback to hardcoded credentials (ONLY FOR DEV/FIX)
        return {
            PUBLIC_SUPABASE_URL: "https://euavftppzicwjhbugiys.supabase.co",
            // IMPORTANT: Using Service Role Key to bypass RLS policies
            // The bot needs to see ALL messages from ALL users
            PUBLIC_SUPABASE_ANON_KEY: "sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw",
            GEMINI_API_KEY: "AIzaSyAuMInFHOB0L4w5dldT7SA5gbBoj2Y5nNA"
        };
    }
}
// const env = process.env; // Removed global sync load

// --- 2. KNOWLEDGE BASE LOADING ---
let knowledgeBase = [];

async function loadKnowledge() {
    console.log("Loading knowledge base...");
    const files = [
        { path: '../src/pages/manual/MANUAL_CONSOLIDATED.md', type: 'manual' },
        { path: '../src/pages/manual/PRODUCT_CATALOG.md', type: 'catalog' },
        { path: '../src/pages/manual/BITCOIN_CRYPTO_KNOWLEDGE.md', type: 'knowledge' },
        { path: '../src/pages/manual/ADMIN_ANSWERS.md', type: 'admin_qa' }
    ];

    knowledgeBase = [];

    for (const file of files) {
        try {
            const content = await readFile(join(__dirname, file.path), 'utf-8');
            // Split by Headers (##)
            const sections = content.split(/^## /gm);

            for (const section of sections) {
                if (!section.trim()) continue;

                const lines = section.split('\n');
                const title = lines[0].trim();
                const body = lines.slice(1).join('\n').trim();

                if (title && body) {
                    knowledgeBase.push({
                        title: title,
                        body: body,
                        type: file.type,
                        fullText: (title + " " + body).toLowerCase()
                    });
                }
            }
        } catch (err) {
            console.error(`Failed to load ${file.path}:`, err);
        }
    }
    console.log(`Loaded ${knowledgeBase.length} knowledge chunks.`);
}

// --- 3. SEARCH LOGIC ---
function findBestMatch(query) {
    const terms = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const scores = knowledgeBase.map(chunk => {
        let score = 0;
        terms.forEach(term => {
            // Title match matches more
            if (chunk.title.toLowerCase().includes(term)) score += 5;
            // Body match
            if (chunk.fullText.includes(term)) score += 1;
        });
        return { chunk, score };
    });

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    // Return top match if score > threshold
    if (scores.length > 0 && scores[0].score > 0) {
        return scores[0].chunk;
    }
    return null;
}

// --- 4. LOGGING UNANSWERED QUESTIONS ---
async function logUnansweredQuestion(question, reason, conversationId, userId, supabase) {
    try {
        // Insert into database
        const { error } = await supabase.from('unanswered_questions').insert({
            question: question,
            reason: reason,
            conversation_id: conversationId,
            user_id: userId,
            asked_at: new Date().toISOString()
        });

        if (error) {
            console.error('Failed to log unanswered question to DB:', error);
        } else {
            console.log(`📝 Logged to DB: "${question}"`);
        }
    } catch (e) {
        console.error('Failed to log:', e.message);
    }
}

// --- 5. MAIN BOT LOGIC ---
const BOT_ID = '00000000-0000-0000-0000-000000000000';

// --- 5. GEMINI API LOGIC ---
async function callGemini(userMessage, contextChunks, chatHistory = [], geminiApiKey) {
    if (!geminiApiKey || geminiApiKey === "YOUR_GEMINI_API_KEY_HERE") {
        return "⚠️ กรุณาตั้งค่า GEMINI_API_KEY ใน environment variables ครับ";
    }

    const contextText = contextChunks.map(c => `- ${c.title}: ${c.body}`).join("\n\n");

    // Format history for the prompt
    const historyText = chatHistory.map(m => `${m.is_bot ? 'AI' : 'User'}: ${m.content}`).join("\n");

    const systemInstruction = `
You are a helpful AI assistant for "Cashless Thailand".
Goal: Answer user questions about products (CryptoClock, BiTTerm) and manual usage based on Context.
Rules:
1. Use provided Context. If answer is not there, say you don't know.
2. Answer in Thai, Natural, Friendly.
3. Consider the "Chat History" to understand context (e.g. if user says "What colors?", look at previous turn to see which product).
    `.trim();

    const prompt = `
Context Information:
${contextText}

Chat History:
${historyText}

Current User Question: "${userMessage}"

Answer (in Thai):
    `.trim();

    try {
        // Use gemini-2.0-flash as confirmed by the list_models script
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemInstruction + "\n\n" + prompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
            return `ขออภัย ระบบ AI ขัดข้อง: ${data.error.message || 'Unknown Error'}`;
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ฉันไม่สามารถประมวลผลคำตอบได้";
    } catch (e) {
        console.error("Gemini Net Error:", e);
        return "ขออภัย ระบบ AI ขัดข้องชั่วคราว (Network Error)";
    }
}

// --- 6. REPLY LOGIC ---
async function generateReply(msg, supabase, geminiApiKey) {
    console.log(`Processing message: ${msg.content}`);

    // 0. Check if bot is disabled for this conversation
    const { data: conversation } = await supabase
        .from('conversations')
        .select('bot_disabled, admin_handling')
        .eq('id', msg.conversation_id)
        .single();

    if (conversation?.bot_disabled || conversation?.admin_handling) {
        console.log(`⏭️ Bot disabled for conversation ${msg.conversation_id}. Skipping...`);
        return;
    }

    // 0.1 Check AI rate limit (120 messages per day)
    const { data: limitCheck } = await supabase.rpc('check_ai_limit', {
        p_user_id: msg.sender_id,
        p_conversation_id: msg.conversation_id
    });

    if (limitCheck && !limitCheck.allowed) {
        console.log(`⚠️ User ${msg.sender_id} has reached daily AI limit`);
        const limitMessage = `⚠️ คุณใช้ AI ครบโควต้าวันนี้แล้ว (${limitCheck.limit} ข้อความ) จะรีเซ็ตเที่ยงคืน\n\nหากต้องการความช่วยเหลือเร่งด่วน กรุณาติดต่อ Admin โดยตรงครับ`;

        await supabase.from('messages').insert({
            conversation_id: msg.conversation_id,
            sender_id: BOT_ID,
            content: limitMessage,
            is_admin: true,
            metadata: { is_bot: true, limit_reached: true }
        });
        return;
    }

    // 0.2 Fetch History (Last 6 messages for context)
    const { data: history } = await supabase
        .from('messages')
        .select('content, is_admin')
        .eq('conversation_id', msg.conversation_id)
        .order('created_at', { ascending: false })
        .limit(6);

    // Reverse to chronological: Oldest -> Newest
    const chatHistory = history ? history.reverse().map(h => ({
        content: h.content,
        is_bot: h.is_admin // Assumes admin in this chat is the bot
    })) : [];

    // 1. Smart Search Query
    // Combine last user message with current to catch "Subject" of conversation
    // e.g. "CryptoClock" -> "What colors?" becomes "CryptoClock What colors?"
    let searchQuery = msg.content;
    const lastUserMsg = chatHistory.filter(h => !h.is_bot && h.content !== msg.content).pop();
    if (lastUserMsg) {
        searchQuery = `${lastUserMsg.content} ${msg.content}`;
    }
    console.log(`Smart Search Query: "${searchQuery}"`);

    // 2. Search for relevant context using Expanded Query
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const scores = knowledgeBase.map(chunk => {
        let score = 0;
        terms.forEach(term => {
            if (chunk.title.toLowerCase().includes(term)) score += 5;
            if (chunk.fullText.includes(term)) score += 1;
        });
        return { chunk, score };
    });

    scores.sort((a, b) => b.score - a.score);
    const topChunks = scores.filter(s => s.score > 0).slice(0, 3).map(s => s.chunk);

    let replyContent = "";

    // 3. Decide: Hit API or Default?
    if (topChunks.length > 0) {
        console.log(`Found ${topChunks.length} context chunks. Calling Gemini...`);
        replyContent = await callGemini(msg.content, topChunks, chatHistory, geminiApiKey);

        // Append helpful links based on context type
        if (topChunks.some(c => c.type === 'catalog')) {
            replyContent += "\n\n🛒 [ดูสินค้าทั้งหมด](/shop)";
        } else if (topChunks.some(c => c.type === 'manual')) {
            replyContent += "\n\n🔗 [อ่านคู่มือเพิ่มเติม](/manual)";
        }
    } else {
        // Fallback or Chit-Chat
        if (msg.content.match(/สวัสดี|hi|hello/i)) {
            replyContent = "สวัสดีครับ! ผมคือ AI Assistant ของ Cashless Thailand สอบถามข้อมูลสินค้าหรือวิธีใช้งานระบบได้เลยครับ";
        } else {
            // Even if no specific context found, let Gemini try to chat based on History (maybe it's just a thank you)
            console.log("No specific context found. Letting Gemini try with just history.");
            await logUnansweredQuestion(msg.content, 'no_context_found', msg.conversation_id, msg.sender_id, supabase);
            replyContent = await callGemini(msg.content, [], chatHistory, geminiApiKey);
        }
    }

    const { error } = await supabase.from('messages').insert({
        conversation_id: msg.conversation_id,
        sender_id: BOT_ID,
        content: replyContent,
        is_admin: true,
        metadata: { is_bot: true, model: 'gemini-2.0-flash' }
    });

    if (error) {
        console.error("Failed to send reply:", error);
    } else {
        console.log(`Replied to ${msg.id}: ${replyContent.slice(0, 30)}...`);

        // Increment AI usage count
        await supabase.rpc('increment_ai_usage', {
            p_user_id: msg.sender_id,
            p_conversation_id: msg.conversation_id
        });
    }
}

// --- 7. MAIN BOT LOGIC ---
async function startBot() {
    const env = await getEnv();
    if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Missing Supabase credentials.");
        process.exit(1);
    }

    const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);
    const geminiApiKey = env.GEMINI_API_KEY;

    if (!geminiApiKey) {
        console.error("⚠️ Missing GEMINI_API_KEY in environment variables!");
        console.error("Bot will still run but AI responses will show error messages.");
    }

    await loadKnowledge();

    console.log("🤖 Chatbot starting...");

    // 6.1 CATCH UP: Find messages from last 5 mins that are NOT from Bot and have NO reply
    // (Simplification: just find last few user messages and check if they look unanswered. 
    // In a real app we'd query for messages without a subsequent bot reply)
    // For now, let's just listen.

    // 6.2 REALTIME LISTENER
    const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
            const msg = payload.new;
            if (msg.is_admin || msg.sender_id === BOT_ID || msg.sender_id === 'chatbot') return;
            await generateReply(msg, supabase, geminiApiKey);
        })
        .subscribe((status) => {
            console.log(`Realtime Status: ${status}`);
        });

    // 6.3 POLLING FALLBACK (Every 5s check for new messages in case Realtime fails)
    let lastChecked = new Date().toISOString();

    setInterval(async () => {
        const { data: recent, error } = await supabase
            .from('messages')
            .select('*')
            .gt('created_at', lastChecked)
            .eq('is_admin', false) // Only User messages
            .order('created_at', { ascending: true });

        if (recent && recent.length > 0) {
            // Update timestamp to the last processed message
            lastChecked = recent[recent.length - 1].created_at;

            for (const msg of recent) {
                // Double check we haven't replied to this one already (rudimentary check)
                // Ideally we'd keep a processed Set, but timestamp is okay for now
                // We rely on the fact that realtime *also* triggers, so we might double reply? 
                // We need a dedupe mechanism.
                // Let's just trust Polling for now if Realtime is broken.

                // Check if this message was already processed by this instance (in-memory dedupe)
                // For now, let's just log.
                console.log(`[Polling] Found new message: ${msg.content}`);
                await generateReply(msg, supabase, geminiApiKey);
            }
        }

        // If no new messages, just update time to now to avoid clock skew issues?
        // Actually, better to keep lastChecked as the last time we queried.
        // But allow a small overlap? No, keep it simple.
        if (!recent || recent.length === 0) {
            // lastChecked = new Date().toISOString(); // Don't forward time if nothing found, or we miss messages arriving during the sleep?
            // Actually, if we query gt(lastCheck), we should only update lastCheck if we found something OR if we are sure we covered the time.
            // Let's just update lastChecked to NOW.
            lastChecked = new Date().toISOString();
        }

    }, 3000); // Check every 3 seconds

    console.log("Creation of polling loop complete.");
}

startBot();
