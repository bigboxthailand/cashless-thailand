-- SQL Migration: 111_MOCK_BLOG_DATA.sql
-- Description: Inserts 4 professional Thai Bitcoin articles and mock engagement data.

-- 1. Insert 4 Professional Articles (Idempotent by slug)
INSERT INTO blog_posts (title, slug, short_description, content, image_url, category, tags, is_published, view_count)
VALUES 
(
    'Bitcoin Halving 2024: สิ่งที่นักลงทุนต้องรู้และผลกระทบต่อตลาด',
    'bitcoin-halving-2024-guide',
    'เจาะลึกเหตุการณ์ Bitcoin Halving ที่เกิดขึ้นทุกๆ 4 ปี และความหมายที่มีต่อมูลค่าของบิทคอยน์ในระยะยาว',
    '<h2>Bitcoin Halving คืออะไร?</h2><p>Bitcoin Halving คือเหตุการณ์ที่ถูกโปรแกรมไว้ล่วงหน้าในเครือข่าย Bitcoin โดยจะทำให้รางวัลที่นักขุดจะได้รับจากการสร้างบล็อกใหม่ลดลงครึ่งหนึ่ง ซึ่งเกิดขึ้นทุกๆ 210,000 บล็อก หรือประมาณทุกๆ 4 ปี</p><h3>ทำไม Halving ถึงสำคัญ?</h3><p>เหตุการณ์นี้เป็นหัวใจสำคัญของนโยบายการเงินของ Bitcoin ที่เน้นเรื่องความขาดแาลน (Scarcity) โดยจะจำกัดซัพพลายสูงสุดไว้ที่ 21 ล้านเหรียญเท่านั้น เมื่อซัพพลายใหม่ลดลง ในขณะที่ความต้องการยังคงเดิมหรือเพิ่มขึ้น ตามหลักเศรษฐศาสตร์มักจะส่งผลให้มูลค่าเพิ่มสูงขึ้นในระยะยาว</p><blockquote>"Bitcoin เป็นทรัพย์สินประเภทแรกในประวัติศาสตร์มนุษยชาติที่มีจำนวนจำกัดอย่างแน่นอนและไม่สามารถเปลี่ยนแปลงได้"</blockquote><p>นักลงทุนควรติดตามสถานการณ์อย่างใกล้ชิดและศึกษาข้อมูลให้รอบด้านก่อนการตัดสินใจลงทุน</p>',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1974&auto=format&fit=crop',
    'ความรู้คริปโต',
    ARRAY['bitcoin', 'halving', 'investment'],
    true,
    1452
),
(
    'Spot Bitcoin ETF: ประตูด่านแรกสู่การยอมรับจากสถาบันการเงินโลก',
    'spot-bitcoin-etf-impact',
    'การอนุมัติ Spot Bitcoin ETF ในสหรัฐฯ ถือเป็นก้าวสำคัญที่เปลี่ยนโฉมหน้าวงการคริปโตไปตลอดกาล',
    '<h2>ยุคใหม่ของการลงทุนใน Bitcoin</h2><p>การที่ SEC สหรัฐฯ อนุมัติการจัดตั้ง Spot Bitcoin ETF ทำให้นักลงทุนสถาบันและนักลงทุนรายย่อยสามารถเข้าถึง Bitcoin ได้ผ่านบัญชีซื้อขายหลักทรัพย์ปกติ โดยไม่ต้องก9ังวลเรื่องการเก็บรักษา Private Key ด้วยตนเอง</p><h3>กระแสเงินทุนที่ไหลเข้ามา</h3><p>ในช่วงเวลาที่ผ่านมาเราได้เห็นเม็ดเงินมหาศาลไหลเข้าสู่กองทุนอย่าง iShares Bitcoin Trust (IBIT) ของ BlackRock และ Fidelity Wise Origin Bitcoin Fund (FBTC) ซึ่งเป็นการยืนยันว่า Bitcoin ได้กลายเป็นสินทรัพย์กระแสหลักอย่างแท้จริง</p><p>ในอนาคตเราอาจได้เห็นการนำ Bitcoin เข้าไปรวมอยู่ในพอร์ตการลงทุนแบบ 60/40 แบบดั้งเดิมมากขึ้นเรื่อยๆ</p>',
    'https://images.unsplash.com/photo-1611974717528-587000284641?q=80&w=2070&auto=format&fit=crop',
    'ข่าวกระแส',
    ARRAY['bitcoin', 'etf', 'institutional'],
    true,
    3842
),
(
    'ทำไม Bitcoin ถึงถูกเรียกว่า Digital Gold ในยุคเงินเฟ้อพุ่งสูง?',
    'bitcoin-digital-gold-inflation',
    'เปรียบเทียบคุณสมบัติระหว่างทองคำและบิทคอยน์ ในฐานะสินทรัพย์ที่ใช้ป้องกันความเสี่ยงจากเงินเฟ้อ',
    '<h2>ทองคำดิจิทัล vs ทองคำแท่ง</h2><p>แม้ทองคำจะมีประวัติศาสตร์ยาวนานนับพันปีในฐานะเครื่องเก็บมูลค่า แต่ Bitcoin ก็มีคุณสมบัติที่เหนือกว่าในหลายด้าน เช่น การตรวจสอบได้ง่าย การพกพาสะดวก และการแบ่งเป็นหน่วยย่อยได้ถึง 100 ล้านส่วน (Satoshi)</p><h3>การป้องกันเงินเฟ้อ</h3><p>ในสภาวะที่ธนาคารกลางทั่วโลกพิมพ์เงินออกมามหาศาล ทำให้ค่าเงินกระดาษลดลง สินทรัพย์ที่มีจำนวนจำกัดอย่าง Bitcoin จึงได้รับความสนใจเพิ่มขึ้นอย่างมากในฐานะ "Safe Haven" แห่งศตวรรษที่ 21</p><blockquote>"Bitcoin คือทองคำที่สามารถส่งผ่านอินเทอร์เน็ตได้ในเวลาไม่กี่วินาที"</blockquote>',
    'https://images.unsplash.com/photo-1618044733300-9471158238ed?q=80&w=2070&auto=format&fit=crop',
    'ความรู้คริปโต',
    ARRAY['bitcoin', 'inflation', 'gold'],
    true,
    2105
),
(
    'Lightning Network: การปฏิวัติการชำระเงินด้วย Bitcoin ในประเทศไทย',
    'lightning-network-thailand-adoption',
    'อนาคตของการใช้ Bitcoin ซื้อกาแฟอาจอยู่ใกล้กว่าที่คิด ด้วยเทคโนโลยี Layer 2 อย่าง Lightning Network',
    '<h2>เร็วกว่าและถูกกว่า</h2><p>Lightning Network ช่วยให้การทำธุรกรรม Bitcoin เกิดขึ้นได้เกือบจะทันทีและมีค่าธรรมเนียมที่ต่ำมาก (Micro-payments) ซึ่งแก้ปัญหาเรื่องความเร็วของ Base Layer ได้อย่างสมบูรณ์</p><h3>โอกาสสำหรับร้านค้าไทย</h3><p>ในประเทศไทยเริ่มมีร้านค้าและสถานที่ท่องเที่ยวหลายแห่งเริ่มให้ความสนใจในการรับชำระด้วย Bitcoin ผ่าน Lightning Network เพื่อดึงดูดนักท่องเที่ยวต่างชาติที่ต้องการใช้คริปโตในชีวิตประจำวัน</p><p>นี่คือจุดเริ่มต้นของการสร้าง Cashless Society ที่แท้จริงด้วยเทคโนโลยีกระจายศูนย์</p>',
    'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop',
    'ไลฟ์สไตล์',
    ARRAY['bitcoin', 'lightning', 'thailand'],
    true,
    967
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    content = EXCLUDED.content,
    image_url = EXCLUDED.image_url,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags;

-- 2. Mock Engagement Data (Votes)
-- Using ON CONFLICT to avoid duplicate key errors
INSERT INTO blog_votes (post_id, user_id, vote_type)
SELECT p.id, u.id, 1
FROM blog_posts p, profiles u
WHERE p.is_published = true 
LIMIT 10
ON CONFLICT (post_id, user_id) DO NOTHING;

INSERT INTO blog_votes (post_id, user_id, vote_type)
SELECT p.id, u.id, -1
FROM blog_posts p, profiles u
WHERE p.is_published = true
OFFSET 5 LIMIT 2
ON CONFLICT (post_id, user_id) DO NOTHING;

-- 3. Mock Comments
-- We don't have a unique constraint on comments typically, 
-- but we can avoid inserting the exact same comment content if needed.
-- For now, just insert them. If run twice, comments will duplicate (which is fine for mock).
INSERT INTO blog_comments (post_id, user_id, content)
SELECT p.id, u.id, 'บทความนี้มีประโยชน์มากครับ ติดตามข้อมูลดีๆ แบบนี้ต่อไปนะครับ'
FROM blog_posts p, profiles u
LIMIT 5;

INSERT INTO blog_comments (post_id, user_id, content)
SELECT p.id, u.id, 'รออ่านตอนต่อไปเลยครับ เจาะลึกได้ดีมาก'
FROM blog_posts p, profiles u
OFFSET 2 LIMIT 3;
