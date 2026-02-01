# AI Rate Limiting System

## Overview
ระบบจำกัดการตอบของ AI ไม่เกิน **120 ข้อความต่อวันต่อคน** และรีเซ็ตทุกเที่ยงคืน (00:00)

## Database Schema

### Table: `ai_usage_tracking`
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key -> profiles.id)
- conversation_id: UUID (Foreign Key -> conversations.id)
- message_count: INTEGER (จำนวนข้อความที่ AI ตอบไปแล้ววันนี้)
- last_reset_at: TIMESTAMP (วันที่รีเซ็ตล่าสุด)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Functions

#### 1. `check_ai_limit(user_id, conversation_id)`
ตรวจสอบว่าผู้ใช้สามารถรับการตอบจาก AI ได้หรือไม่

**Returns:**
```json
{
  "allowed": true/false,
  "current_count": 45,
  "limit": 120,
  "remaining": 75,
  "reset_at": "2026-02-02T00:00:00Z"
}
```

#### 2. `increment_ai_usage(user_id, conversation_id)`
เพิ่มตัวนับหลังจาก AI ตอบข้อความ

**Returns:**
```json
{
  "success": true,
  "current_count": 46,
  "limit": 120,
  "remaining": 74,
  "limit_reached": false
}
```

#### 3. `get_ai_usage_stats(user_id)`
ดูสถิติการใช้งาน AI ของผู้ใช้

**Returns:** Array of usage stats for all conversations

---

## Integration Guide

### For AI Chatbot (Edge Function / Webhook)

```javascript
import { checkAILimit, incrementAIUsage } from '../lib/aiRateLimit.js';

async function handleUserMessage(userId, conversationId, userMessage) {
    // 1. Check if user has reached limit
    const limitCheck = await checkAILimit(userId, conversationId);
    
    if (!limitCheck.allowed) {
        // Send limit reached message
        return {
            type: 'system',
            content: '⚠️ คุณใช้ AI ครบโควต้าวันนี้แล้ว (120 ข้อความ) จะรีเซ็ตเที่ยงคืน',
            metadata: { limit_reached: true }
        };
    }
    
    // 2. Check if admin has disabled bot for this conversation
    const { data: conv } = await supabase
        .from('conversations')
        .select('bot_disabled')
        .eq('id', conversationId)
        .single();
    
    if (conv?.bot_disabled) {
        // Bot is disabled, don't respond
        return null;
    }
    
    // 3. Generate AI response
    const aiResponse = await generateAIResponse(userMessage);
    
    // 4. Increment usage counter
    const usage = await incrementAIUsage(userId, conversationId);
    
    // 5. Add warning if approaching limit
    let finalMessage = aiResponse;
    if (usage.remaining <= 10 && usage.remaining > 0) {
        finalMessage += `\n\n⚠️ เหลือ AI ตอบได้อีก ${usage.remaining} ข้อความวันนี้`;
    }
    
    return {
        type: 'text',
        content: finalMessage,
        metadata: { 
            ai_generated: true,
            remaining: usage.remaining 
        }
    };
}
```

### For Frontend (ChatWidget.jsx)

```javascript
import { checkAILimit, formatLimitMessage } from '../lib/aiRateLimit.js';

// In ChatWidget component
const [aiLimitInfo, setAiLimitInfo] = useState(null);

// Check limit when opening chat
useEffect(() => {
    if (conversationId && session) {
        checkAILimit(session.user.id, conversationId).then(setAiLimitInfo);
    }
}, [conversationId, session]);

// Show warning in UI
{aiLimitInfo && aiLimitInfo.remaining <= 30 && (
    <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20">
        <p className="text-xs text-orange-300">
            {formatLimitMessage(aiLimitInfo.remaining)}
        </p>
    </div>
)}
```

---

## API Endpoints

### POST `/api/ai-limit`

**Check Limit:**
```bash
curl -X POST /api/ai-limit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "conversation_id": "uuid",
    "action": "check"
  }'
```

**Increment Usage:**
```bash
curl -X POST /api/ai-limit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "conversation_id": "uuid",
    "action": "increment"
  }'
```

**Get Stats:**
```bash
curl -X POST /api/ai-limit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "action": "stats"
  }'
```

---

## Migration Steps

1. **Run SQL Migration:**
   ```bash
   # Via Supabase Dashboard SQL Editor
   # Copy and run: _CORE/51_AI_RATE_LIMIT.sql
   ```

2. **Test Functions:**
   ```sql
   -- Test check limit
   SELECT check_ai_limit('user-uuid', 'conversation-uuid');
   
   -- Test increment
   SELECT increment_ai_usage('user-uuid', 'conversation-uuid');
   
   -- Test stats
   SELECT * FROM get_ai_usage_stats('user-uuid');
   ```

3. **Integrate with AI Bot:**
   - Add rate limit check before generating AI response
   - Increment counter after successful AI response
   - Show appropriate messages to users

---

## Overview

This system limits AI chatbot responses to **20 messages per user per day** to prevent abuse and manage API costs.

### Key Features:
- **Daily Limit**: 20 AI responses per user
- **Reset Time**: Midnight (00:00) Thailand Time (UTC+7)
- **Tracking**: Per user + per conversation
- **Warnings**: User gets notified when approaching limit
- **Fail-Open**: If system fails, requests are allowed (prevents blocking users)

---

## Database Schema
- Only AI-generated responses count toward the limit
