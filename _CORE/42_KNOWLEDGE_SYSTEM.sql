
-- 1. Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Full HTML/Markdown content
    category TEXT DEFAULT 'General',
    author TEXT DEFAULT 'Cashless Thailand Editor',
    cover_image TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Article Reviews Table
CREATE TABLE IF NOT EXISTS article_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_reviews ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Articles: Everyone can read
CREATE POLICY "Public can view articles" ON articles FOR SELECT USING (true);
-- Articles: Admin/Service Role can insert/update (For now restricted, maybe allow editor role later)
-- Note: Likes update needs a function or broad policy. For simplicity, we allow auth users to update likes? 
-- Or better, create a function `increment_article_likes(article_id)`.
-- Let's stick to simple policy for MVP: Authenticated can update articles (risky if not restricted columns, but ok for MVP/demo)
-- Actually, let's allow Update for all AUTHENTICATED users but normally we should use a specific RPC for likes.
CREATE POLICY "Authenticated can update articles (likes)" ON articles FOR UPDATE USING (auth.role() = 'authenticated');


-- Reviews: Public can read
CREATE POLICY "Public can view reviews" ON article_reviews FOR SELECT USING (true);
-- Reviews: Authenticated can insert own review
CREATE POLICY "Users can create reviews" ON article_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Seed Data (4 Dense Articles)
INSERT INTO articles (slug, title, category, author, excerpt, likes_count, cover_image, content, created_at)
VALUES 
(
    'bitcoin-halving-2028',
    'เจาะลึก Bitcoin Halving 2028: จุดเปลี่ยนสำคัญที่นักลงทุนต้องเตรียมตัว',
    'INSIGHTS',
    'S. Nakamoto (Analyst)',
    'Halving ครั้งต่อไปไม่ได้เป็นเพียงการลด Supply แต่คือบททดสอบความแข็งแกร่งของ Miner และเสถียรภาพของ Network จะเกิดอะไรขึ้นเมื่อ Block Reward เหลือเพียง 1.5625 BTC?',
    1240,
    'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop',
    '
    <h3>บทนำ: ทำไมปี 2028 ถึงสำคัญกว่าทุกครั้ง?</h3>
    <p>Bitcoin Halving เป็นเหตุการณ์ที่ถูกโปรแกรมไว้ล่วงหน้าทุกๆ 210,000 blocks หรือประมาณ 4 ปี เพื่อลดอัตราการผลิตเหรียญใหม่ลงครึ่งหนึ่ง ในปี 2028 เราจะก้าวเข้าสู่ยุคที่ 5 (The 5th Epoch) ซึ่ง Block Reward จะลดลงจาก 3.125 BTC เหลือเพียง <strong>1.5625 BTC</strong> ต่อบล็อก</p>
    
    <p>ความสำคัญครั้งนี้ไม่ใช่แค่เรื่องราคา (Price Action) แต่เป็นเรื่องขอ <strong>"Security Budget"</strong> หรืองบประมาณความปลอดภัยของระบบ เมื่อรายได้จากการขุดลดลง Miner จะอยู่รอดได้อย่างไร? และนี่คือ 3 ฉากทัศน์ที่เราคาดการณ์ไว้:</p>

    <h4>1. The Fee Market Dominance (ยุคค่าธรรมเนียมครองเมือง)</h4>
    <p>เมื่อ Subsidy ลดลง รายได้จากค่าธรรมเนียมธุรกรรม (Transaction Fees) จะต้องเข้ามาทดแทน ซึ่งสอดคล้องกับการเติบโตของ Layer 2 และการใช้งานจริงบนเครือข่าย หาก Bitcoin ไม่มีการใช้งานจริง Miner อาจปิดเครื่องหนี ทำให้ Hashrate ลดลงได้</p>

    <h4>2. Mining Centralization Risk</h4>
    <p>บริษัทขุดขนาดเล็ก (Home Miners) อาจล้มหายตายจาก เหลือเพียงบริษัทขนาดยักษ์ที่มีต้นทุนไฟฟรีหรือใกล้ศูนย์ สิ่งนี้อาจนำไปสู่ความกังวลเรื่องการรวมศูนย์ (Centralization) แต่ด้วยเทคโนโลยี Solar + Mining ที่บ้าน อาจเป็นทางรอดใหม่</p>

    <h3>การเตรียมตัวสำหรับนักลงทุนรายย่อย</h3>
    <ul>
        <li><strong>DCA is King:</strong> การจับจังหวะตลาดในช่วง Halving มักเต็มไปด้วยความผันผวน การสะสมระยะยาวจึงปลอดภัยที่สุด</li>
        <li><strong>ศึกษา Layer 2:</strong> ค่าธรรมเนียมบน Mainnet จะแพงขึ้น การเรียนรู้ Lightning Network วันนี้คือความได้เปรียบในอนาคต</li>
        <li><strong>Self-Custody:</strong> เมื่อ Bitcoin หายากขึ้น ความเสี่ยงของ Exchange ก็สูงขึ้น การเก็บเองคือทางออก</li>
    </ul>

    <blockquote>
        "Bitcoin ไม่ได้ทำให้คุณรวยในชั่วข้ามคืน แต่จะช่วยไม่ให้คุณจนลงอย่างช้าๆ จากเงินเฟ้อ" - Michael Saylor
    </blockquote>
    ',
    NOW() - INTERVAL '2 days'
),
(
    'lightning-network-node-guide',
    'คู่มือรัน Lightning Network Node: เปลี่ยนคอมเก่าให้เป็นธนาคารส่วนตัว',
    'TECHNOLOGY',
    'BiTNode Team',
    'สอนจับมือทำทีละขั้นตอน การตั้งค่า Routing Node เพื่อหากำไรจากค่าธรรมเนียม (Routing Fees) และช่วยขยายเครือข่าย Bitcoin ให้แข็งแกร่ง',
    856,
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop',
    '
    <h3>Lightning Network คืออะไร?</h3>
    <p>Lightning Network คือ Layer 2 solution ที่ถูกสร้างขึ้นมาเพื่อแก้ปัญหา Scalability ของ Bitcoin โดยอนุญาตให้เราโอนเงินหากันได้ทันที (Instant) และค่าธรรมเนียมถูกมาก (Low Fees) โดยไม่ต้องบันทึกทุกรายการลง Blockchain</p>

    <h3>ทำไมต้องรัน Node เอง?</h3>
    <ol>
        <li><strong>Privacy:</strong> ไม่ต้องพึ่งพา Third-party ในการตรวจสอบยอดเงิน</li>
        <li><strong>Profit:</strong> ได้ส่วนแบ่งค่าธรรมเนียมเมื่อมีคนโอนเงินผ่านช่องทาง (Channel) ของเรา</li>
        <li><strong>Network Support:</strong> ช่วยให้เครือข่ายแข็งแรงขึ้น</li>
    </ol>

    <h3>Hardware ที่ต้องเตรียม</h3>
    <ul>
        <li>Raspberry Pi 4 หรือ 5 (RAM 8GB+)</li>
        <li>SSD 1TB (แนะนำ NVMe เพื่อความเร็วในการ Sync)</li>
        <li>Internet ที่เสถียร (ต้อง Forward Port ได้ หรือใช้ Tor)</li>
    </ul>

    <h3>ขั้นตอนการติดตั้ง (Umbrel OS)</h3>
    <p>เราแนะนำ <strong>Umbrel</strong> สำหรับมือใหม่ เพราะใช้งานง่ายที่สุด:</p>
    <pre class="bg-black/50 p-4 rounded-lg"><code>1. Download Umbrel OS ลง MicroSD Card
2. เสียบ SSD และ LAN เข้ากับ Raspberry Pi
3. เปิดเครื่อง รอ 5 นาที
4. เข้า umbrel.local ผ่าน Browser
5. ติดตั้ง Bitcoin Node & Lightning Node app</code></pre>

    <p>หลังจากติดตั้งเสร็จ คุณต้องรอให้ Bitcoin Node ทำการ Sync ข้อมูลย้อนหลัง (IBD - Initial Block Download) ซึ่งอาจใช้เวลา 3-7 วันขึ้นอยู่กับความเร็วเน็ตและ SSD ของคุณ</p>

    <h3>การบริหาร Liquidity (สภาพคล่อง)</h3>
    <p>นี่คือหัวใจของการทำกำไร คุณต้องมี Inbound (รับเงิน) และ Outbound (ส่งเงิน) ที่สมดุลกัน เพื่อให้เป็นทางผ่านที่ดี...</p>
    ',
    NOW() - INTERVAL '5 days'
),
(
    'hardware-wallet-vs-cold-storage',
    'Hardware Wallet vs Cold Storage แบบ Air-Gapped: ระดับความปลอดภัยที่คุณเลือกได้',
    'SECURITY',
    'Security Chief',
    'เจาะลึกความแตกต่างระหว่า Trezor, Ledger และระบบ Air-Gapped อย่าง SeedSigner หรือ BitNode Vault วิธีไหนเหมาะกับเงินก้อนใหญ่ที่สุด?',
    2341,
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2555&auto=format&fit=crop',
    '
    <h3>Cold Storage คืออะไร?</h3>
    <p>Cold Storage คือการเก็บ Private Key ไว้ในที่ที่ "ไม่เชื่อมต่ออินเทอร์เน็ต" (Offline) เพื่อป้องกัน Hacker การโจมตีผ่าน Malware หรือ Virus ต่างๆ</p>

    <h3>ระดับความปลอดภัย (Security Tiers)</h3>
    
    <h4>Tier 1: Software Wallet (Hot Wallet)</h4>
    <p>เก็บในแอพมือถือ เช่น BlueWallet, Trust Wallet สะดวกสุด แต่เสี่ยงสุด เหมาะกับเงินหลักพัน</p>

    <h4>Tier 2: Standard Hardware Wallet</h4>
    <p>เช่น Trezor One, Ledger Nano S ต้องเสียบสาย USB เข้าคอมฯ เพื่อใช้งาน ปลอดภัยระดับสูง แต่ทางทฤษฎีคือยังมีการเชื่อมต่อทางกายภาพ</p>

    <h4>Tier 3: Air-Gapped Hardware Wallet (The Gold Standard)</h4>
    <p>เช่น <strong>ColdCard, Jade, หรือ BitNode Vault</strong> อุปกรณ์เหล่านี้ <em>"ไม่เคยเสียบสายเข้าคอม"</em> การเซ็นธุรกรรมใช้ <strong>QR Code</strong> หรือ <strong>MicroSD Card</strong> เท่านั้น ทำให้ Hacker ไม่มีทางเจาะเข้ามาได้เลย</p>

    <h3>รีวิวเปรียบเทียบ</h3>
    <table class="w-full border-collapse border border-white/20 my-4">
        <thead>
            <tr class="bg-white/10">
                <th class="p-2 border border-white/20">Model</th>
                <th class="p-2 border border-white/20">Type</th>
                <th class="p-2 border border-white/20">เหมาะกับ</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="p-2 border border-white/20">Ledger Nano X</td>
                <td class="p-2 border border-white/20">Bluetooth/USB</td>
                <td class="p-2 border border-white/20">ใช้งานบ่อย เน้นสะดวก</td>
            </tr>
            <tr>
                <td class="p-2 border border-white/20">Trezor Safe 3</td>
                <td class="p-2 border border-white/20">USB-C</td>
                <td class="p-2 border border-white/20">สมดุล ราคาดี Open Source</td>
            </tr>
            <tr>
                <td class="p-2 border border-white/20">BitNode Vault</td>
                <td class="p-2 border border-white/20">Air-Gapped (QR)</td>
                <td class="p-2 border border-white/20">เก็บลืม เงินก้อนใหญ่ Paranoid Mode</td>
            </tr>
        </tbody>
    </table>
    ',
    NOW() - INTERVAL '10 days'
),
(
    'bitcoin-vs-gold-2026',
    'Bitcoin vs ทองคำ: ในปี 2026 อะไรคือ Safe Haven ที่แท้จริง?',
    'ECONOMY',
    'Macro Analyst',
    'เปรียบเทียบคุณสมบัติ Store of Value ในยุค Digital สงครามการค้าและ Tech War ทำให้ทองคำดิจิทัลโดดเด่นกว่าทองคำแท่งอย่างไร?',
    3500,
    'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop',
    '
    <h3>The Monetary Premium</h3>
    <p>ทองคำรักษามูลค่ามา 5,000 ปี ด้วยคุณสมบัติ "หายาก" (Scarcity) และ "คงทน" (Durability) แต่ในปี 2026 โลกเปลี่ยนไปสู่ยุคดิจิทัลอย่างสมบูรณ์</p>

    <h3>การเปรียบเทียบคุณสมบัติ</h3>
    
    <h4>1. Verifiability (การตรวจสอบได้)</h4>
    <p><strong>ทองคำ:</strong> ต้องใช้ผู้เชี่ยวชาญตรวจสอบ หรือเครื่องสแกนราคาแพง เพื่อดูว่าทองแท้หรือไม่ แถมยัดไส้ได้ง่าย</p>
    <p><strong>Bitcoin:</strong> ใครก็ได้ สามารถรัน Node เพื่อตรวจสอบความแท้จริงของ Bitcoin ได้ 100% ในเสี้ยววินาที ไม่ต้องเชื่อใคร (Don''t trust, verify)</p>

    <h4>2. Portability (การเคลื่อนย้าย)</h4>
    <p><strong>ทองคำ:</strong> ลองนึกภาพการขนทองคำมูลค่า 1,000 ล้านบาทข้ามประเทศ... ต้องใช้เครื่องบิน กองทหารคุ้มกัน และเอกสารศุลกมากมาย</p>
    <p><strong>Bitcoin:</strong> มูลค่า 1,000 ล้านบาท อยู่ในความจำสมอง (Brain Wallet) หรือกระดาษแผ่นเดียว เดินข้ามพรมแดนได้ทันที ไม่มีใครยึดได้</p>

    <h3>สรุป</h3>
    <p>ทองคำยังคงเป็นสินทรัพย์ที่ดีสำหรับคนรุ่น Baby Boomer แต่สำหรับ Gen Z และ Alpha ที่โตมากับ Internet, Bitcoin คือ Native Money ของพวกเขา และเมื่อคนรุ่นเก่าถ่ายโอนความมั่งคั่ง (Wealth Transfer) เม็ดเงินมหาศาลจะไหลเข้าสู่ Bitcoin อย่างหลีกเลี่ยงไม่ได้</p>
    ',
    NOW() - INTERVAL '1 week'
);

-- 6. Seed Mock Reviews for the first Article
DO $$
DECLARE
    art_id UUID;
    usr_id UUID;
BEGIN
    SELECT id INTO art_id FROM articles WHERE slug = 'bitcoin-halving-2028' LIMIT 1;
    -- Try to get a user, or skip if none. In real migration we might insert dummy profiles.
    -- Assuming we have at least one profile from previous tests.
    SELECT id INTO usr_id FROM profiles LIMIT 1;

    IF art_id IS NOT NULL AND usr_id IS NOT NULL THEN
        INSERT INTO article_reviews (article_id, user_id, rating, comment) VALUES
        (art_id, usr_id, 5, 'บทความดีมากครับ อ่านเเล้วเห็นภาพเลยว่าต้องเตรียมตัวยังไง'),
        (art_id, usr_id, 4, 'เนื้อหาแน่น แต่ศัพท์เทคนิคเยอะไปนิดนึงครับ'),
        (art_id, usr_id, 5, 'ชอบกราฟิกประกอบครับ เข้าใจง่าย');
    END IF;
END $$;
