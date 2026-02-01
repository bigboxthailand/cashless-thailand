# AI Chatbot System - Complete Documentation

## 📋 สรุปฟีเจอร์ทั้งหมด

### ✅ ฟีเจอร์ที่มีครบแล้ว:

1. **AI Chatbot Engine** (`scripts/chatbot_worker.js`)
   - ✅ Google Gemini API Integration (gemini-2.0-flash)
   - ✅ Knowledge Base System (4 ไฟล์ .md)
   - ✅ Smart Context Search
   - ✅ Chat History Awareness
   - ✅ Realtime + Polling Fallback
   - ✅ Unanswered Questions Logging
   - ✅ **Bot Disable Check** (ตรวจสอบ `bot_disabled` flag)
   - ✅ **AI Rate Limiting** (20 ข้อความ/วัน)

2. **Admin Bot Control** (`ChatCenter.jsx`)
   - ✅ ปุ่มปิด/เปิดบอท (Admin only)
   - ✅ แสดงสถานะ "Admin Handling"
   - ✅ Real-time update

3. **AI Rate Limiting System**
   - ✅ Database functions (`check_ai_limit`, `increment_ai_usage`)
   - ✅ Automatic midnight reset (Thailand time)
   - ✅ Usage tracking per user/conversation
   - ✅ Limit warning messages

4. **Database Schema**
   - ✅ `conversations.bot_disabled`
   - ✅ `conversations.admin_handling`
   - ✅ `conversations.handling_admin_id`
   - ✅ `ai_usage_tracking` table
   - ✅ `unanswered_questions` table

---

## 🔑 Environment Variables

### ต้องใส่ใน Vercel ทั้งหมด 7 ตัว:

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://euavftppzicwjhbugiys.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_poJ-NobQZpARz_G4cWG96Q_vxIPZkrE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_pPB5HmRxQRJFK3k9JmrJFA_2NxQapaw

# Notifications
TELEGRAM_BOT_TOKEN=8518760405:AAGvkvVhxVfLD-7aZ6d6mPEb9UxfHmEodyY
TELEGRAM_CHAT_ID=7437458172

# Email
RESEND_API_KEY=re_PxcEAhAW_HJfHA1W9m8st16fMnqBFWFnU

# AI Chatbot (⚠️ ใหม่!)
GEMINI_API_KEY=AIzaSyAuMInFHOB0L4w5dldT7SA5gbBoj2Y5nNA
```

---

## 🚀 วิธี Deploy

### 1. ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ https://vercel.com
2. เลือก Project
3. Settings → Environment Variables
4. เพิ่มตัวแปรทั้ง 7 ตัวข้างบน
5. เลือก Environment: **Production + Preview + Development**
6. Save

### 2. รัน SQL Migrations ใน Supabase

1. เปิด https://app.supabase.com
2. เลือก Project
3. SQL Editor
4. รันไฟล์ตามลำดับ:

```sql
-- 1. Bot Control System
_CORE/50_ADD_BOT_CONTROL.sql

-- 2. AI Rate Limiting
_CORE/51_AI_RATE_LIMIT.sql
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Add AI chatbot with rate limiting"
git push
```

Vercel จะ auto-deploy

---

## 🤖 วิธีรัน Chatbot Worker (Local)

```bash
cd /Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand
node scripts/chatbot_worker.js
```

**Output ที่ควรเห็น:**
```
Loading knowledge base...
Loaded XX knowledge chunks.
🤖 Chatbot starting...
Realtime Status: SUBSCRIBED
Creation of polling loop complete.
```

---

## 📊 การทำงานของระบบ

### Flow การตอบข้อความ:

1. **User ส่งข้อความ** → Supabase `messages` table
2. **Bot Worker ได้รับ notification** (Realtime/Polling)
3. **เช็ค `bot_disabled`** → ถ้าปิดอยู่ = ข้าม
4. **เช็ค AI Rate Limit** → ถ้าเกิน 20 = แจ้งเตือน
5. **Search Knowledge Base** → หา context ที่เกี่ยวข้อง
6. **เรียก Gemini API** → สร้างคำตอบ
7. **บันทึกคำตอบ** → Supabase `messages`
8. **Increment AI Usage** → นับจำนวนข้อความ

### Admin ปิดบอท:

1. Admin กดปุ่ม "ปิดบอท" ใน ChatCenter
2. Update `conversations.bot_disabled = true`
3. Bot Worker เช็คและข้ามการตอบ
4. Admin ตอบเอง

### Rate Limiting:

1. ทุกครั้งที่บอทตอบ → เรียก `increment_ai_usage()`
2. ก่อนตอบ → เรียก `check_ai_limit()`
3. ถ้าเกิน 20 ข้อความ → ส่งข้อความแจ้งเตือน
4. รีเซ็ตเที่ยงคืน (Thailand time)

---

## 🧪 การทดสอบ

### 1. ทดสอบ AI Rate Limiting:

```bash
node scripts/test_ai_rate_limit.js
```

### 2. ทดสอบ Chatbot:

1. รัน `node scripts/chatbot_worker.js`
2. เปิดเว็บไซต์ → Chat Widget
3. ส่งข้อความ "สวัสดี"
4. ดู console log ของ worker

### 3. ทดสอบ Bot Disable:

1. Login เป็น Admin
2. ไปที่ `/admin/chat`
3. เลือก conversation
4. กดปุ่ม "ปิดบอท"
5. ส่งข้อความ → บอทไม่ควรตอบ

---

## 📁 ไฟล์ที่เกี่ยวข้อง

```
scripts/
├── chatbot_worker.js          # Main bot engine
└── test_ai_rate_limit.js      # Test script

src/
├── components/
│   └── chat/
│       ├── ChatCenter.jsx     # Admin chat interface
│       └── ChatWidget.jsx     # User chat widget
├── lib/
│   └── aiRateLimit.js         # Rate limit helper
└── pages/
    ├── api/
    │   └── ai-limit.ts        # Rate limit API
    └── manual/
        ├── MANUAL_CONSOLIDATED.md
        ├── PRODUCT_CATALOG.md
        ├── BITCOIN_CRYPTO_KNOWLEDGE.md
        └── ADMIN_ANSWERS.md

_CORE/
├── 50_ADD_BOT_CONTROL.sql     # Bot control migration
└── 51_AI_RATE_LIMIT.sql       # Rate limiting migration

_DOCS/
└── AI_RATE_LIMITING.md        # Rate limiting docs
```

---

## ⚠️ สิ่งสำคัญ

1. **GEMINI_API_KEY** ต้องใส่ใน Vercel ก่อน deploy
2. **SQL Migrations** ต้องรันใน Supabase ก่อนใช้งาน
3. **Chatbot Worker** ต้องรันแยกต่างหาก (ไม่ได้รันบน Vercel)
4. **Rate Limit** รีเซ็ตเที่ยงคืน Thailand time (UTC+7)

---

## 🎯 Checklist ก่อน Deploy

- [ ] เพิ่ม `GEMINI_API_KEY` ใน Vercel
- [ ] รัน `50_ADD_BOT_CONTROL.sql` ใน Supabase
- [ ] รัน `51_AI_RATE_LIMIT.sql` ใน Supabase
- [ ] ทดสอบ chatbot worker ใน local
- [ ] ทดสอบ rate limiting
- [ ] ทดสอบ bot disable/enable
- [ ] Deploy to Vercel
- [ ] รัน chatbot worker บน server (production)

---

## 📞 Support

หากมีปัญหา:
1. เช็ค console log ของ `chatbot_worker.js`
2. เช็ค Supabase logs
3. เช็ค Vercel deployment logs
4. ดู `_DOCS/AI_RATE_LIMITING.md` สำหรับรายละเอียดเพิ่มเติม

---

**สร้างเมื่อ:** 2026-02-01  
**อัปเดตล่าสุด:** 2026-02-01
