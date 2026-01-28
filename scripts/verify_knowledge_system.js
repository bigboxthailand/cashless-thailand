
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyKnowledgeSystem() {
    console.log("🔍 Verifying Knowledge System...");

    // 1. Check Articles
    const { data: articles, error: artError } = await supabase
        .from('articles')
        .select('id, slug, title, category');

    if (artError) {
        console.error("❌ Failed to fetch articles:", artError.message);
        process.exit(1);
    }

    console.log(`✅ Found ${articles.length} articles.`);
    articles.forEach(a => console.log(`   - [${a.category}] ${a.title} (${a.slug})`));

    if (articles.length === 0) {
        console.warn("⚠️ No articles found. Did the seed run?");
    }

    // 2. Check Reviews (for the first article)
    const firstArticle = articles.find(a => a.slug === 'bitcoin-halving-2028');
    if (firstArticle) {
        const { data: reviews, error: revError } = await supabase
            .from('article_reviews')
            .select('*')
            .eq('article_id', firstArticle.id);

        if (revError) {
            console.error("❌ Failed to fetch reviews:", revError.message);
        } else {
            console.log(`✅ Found ${reviews.length} reviews for 'bitcoin-halving-2028'.`);
        }
    }

    console.log("🎉 Knowledge System Verification Complete!");
}

verifyKnowledgeSystem();
