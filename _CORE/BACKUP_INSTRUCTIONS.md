# Database Backup Instructions

## วิธี Backup Database ลง JSON

เนื่องจาก Network connection ไม่เสถียร แนะนำให้ backup ผ่าน **Supabase Dashboard** โดยตรง:

### 📋 **ขั้นตอน:**

1. **เปิด Supabase Dashboard:**
   - ไปที่ [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - เลือก Project: `cashlessthailand`
   - ไปที่ **SQL Editor**

2. **Run queries จากไฟล์ `BACKUP_QUERIES.sql`:**
   - Copy query แต่ละตัวจากไฟล์ `BACKUP_QUERIES.sql`
   - Paste ใน SQL Editor
   - กด **Run**
   - คลิก **Export** → **JSON**
   - Save ไฟล์ตามชื่อที่กำหนด

3. **Tables ที่ต้อง backup:**
   - ✅ `products` → `products_backup.json`
   - ✅ `profiles` → `profiles_backup.json`
   - ✅ `addresses` → `addresses_backup.json`
   - ✅ `orders` → `orders_backup.json`
   - ✅ `order_items` → `order_items_backup.json`
   - ✅ `carts` → `carts_backup.json`
   - ✅ `store_settings` → `store_settings_backup.json`

---

## 🔄 **Restore Database จาก Backup**

ถ้าต้องการ restore ข้อมูลจาก JSON backup:

```sql
-- Example: Restore products
-- 1. ไปที่ Supabase Dashboard → Table Editor
-- 2. เลือก table ที่ต้องการ restore
-- 3. Import JSON file
-- หรือใช้ INSERT statements ใน SQL Editor
```

---

## 📊 **Verify Backup**

หลัง backup เสร็จ run query นี้เพื่อดูจำนวน records:

```sql
-- Copy จาก BACKUP_QUERIES.sql section 8
```

---

## 💡 **Tips:**

- Backup ควรทำ**ก่อนการแก้ไข schema** ที่สำคัญ
- เก็บ backup files ใน `_CORE/` folder
- ใช้ชื่อไฟล์แบบ `{table_name}_backup_{date}.json` ถ้าต้องการ version control
- Backup อัตโนมัติสามารถทำได้ผ่าน **Supabase CLI** หรือ **GitHub Actions**

---

## 🚨 **สำคัญ:**

- **NEVER commit sensitive data** to Git (เช่น customer emails, phone numbers)
- ใช้ `.gitignore` สำหรับ `*_backup.json` files
- Backup เฉพาะข้อมูล **structure/schema** และ **mock data** เท่านั้น
