import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar } from '../../chunks/Navbar_DWavSQqS.mjs';
import { $ as $$Footer } from '../../chunks/Footer_BP6qeS3w.mjs';
import { p as products } from '../../chunks/products_DJd6FeeG.mjs';
export { renderers } from '../../renderers.mjs';

const manualsData = {
  "cryptoclock-basic": {"title":"CryptoClock User Manual","intro":"คู่มือการใช้งานฉบับสมบูรณ์: ตั้งแต่การเชื่อมต่อ WiFi, การปรับแต่งหน้าจอ, ไปจนถึงเทคนิคการใช้งานสำหรับติดตามราคาสินทรัพย์แบบเรียลไทม์","sections":[{"id":"features","type":"features","title":"ฟังก์ชันหลัก (Key Features)","items":["ติดตามราคา Crypto Real-time (มากกว่า 80 เหรียญจาก Binance/Bitkub)","ดูราคาทองคำ (สมาคมค้าทองคำ) และหุ้น (SET/NASDAQ)","เช็คราคาน้ำมัน (ปตท./บางจาก) และเปรียบเทียบค่าเงิน (USD/THB)","แสดงราคาสูงสุด/ต่ำสุด ในรอบ 24 ชม. พร้อมเปอร์เซ็นต์เปลี่ยนแปลง","ปรับแต่งรูปโปรไฟล์ (.jpg), ชื่อ, ตำแหน่ง, และคำคมส่วนตัวได้","ระบบพักหน้าจออัตโนมัติ (Sleep Mode) และปรับระดับความสว่างหน้าจอ","อัปเดตเวลาสากลอัตโนมัติผ่านอินเทอร์เน็ต (NTP)"]},{"id":"use-cases","type":"grid_card","title":"ประโยชน์การใช้งาน (Why Invest?)","items":[{"head":"สำหรับนักเทรด (Trader)","body":"ไม่พลาดทุกการเปลี่ยนแปลงราคา ตัดสินใจซื้อขายได้ทันที พร้อมดูข้อมูล High/Low ในรอบ 24 ชั่วโมง","image":"/images/manuals/marketing/target-trader.webp"},{"head":"สำหรับบริษัท/Exchange","body":"เพิ่มความน่าเชื่อถือ ตกแต่งออฟฟิศให้ดูทันสมัย และแสดงภาพรวมตลาดแบบเรียลไทม์ให้กับทีมงาน","image":"/images/manuals/marketing/target-company.webp"},{"head":"สำหรับ KOL/Influencer","body":"ใช้ประกอบฉาก Live Stream หรือจัดโต๊ะคอม (Desk Setup) สร้างคอนเทนต์ที่ดูเป็นมืออาชีพ","image":"/images/manuals/marketing/target-kol.webp"},{"head":"สำหรับนักลงทุนระยะยาว","body":"ติดตามมูลค่าสินทรัพย์รอบโลกทั้งคริปโต ทองคำ น้ำมัน และหุ้น เพื่อประเมินสถานการณ์ตลาดได้ทันท่วงที","image":"/images/manuals/marketing/target-investor.webp"}]},{"id":"wifi-setup","type":"steps","title":"1. การเริ่มต้นใช้งาน (Connect WiFi)","intro":"ขั้นตอนการเชื่อมต่อนาฬิกาเข้ากับอินเทอร์เน็ตครั้งแรก (รองรับ WiFi 2.4GHz เท่านั้น)","items":[{"head":"1.1 เปิดเครื่องและรอสัญญาณ","body":"เสียบปลั๊ก USB-C (แนะนำอแดปเตอร์ 5V/2A) เมื่อเครื่องเริ่มทำงานจะทำการค้นหา WiFi หากยังไม่เคยเชื่อมต่อ เครื่องจะปล่อย Hotspot ชื่อ 'CryptoClock'","image":"/images/manuals/basic/1-setup-power.jpeg"},{"head":"1.2 เชื่อมต่อ Hotspot","body":"ใช้มือถือหรือคอมพิวเตอร์ ค้นหา WiFi และกดเชื่อมต่อกับชื่อ 'CryptoClock' (อาจต้องรอ 1-2 นาทีเพื่อให้มือถือจับสัญญาณ)","image":"/images/manuals/basic/1-wifi-search.jpg"},{"head":"1.3 เข้าหน้าตั้งค่า (Config)","body":"เมื่อเชื่อมต่อแล้ว ระบบควรจะเด้งหน้าตั้งค่าขึ้นมาอัตโนมัติ หากไม่เด้ง ให้เปิด Browser พิมพ์ 192.168.4.1 หรือสแกน QR Code ที่หน้าจอ","image":"/images/manuals/basic/1-wifi-portal.jpg"},{"head":"1.4 เลือก WiFi บ้าน","body":"กรอก SSID และ Password ของ WiFi บ้านคุณ (ข้อควรระวัง: รองรับเฉพาะคลื่น 2.4GHz เท่านั้น ยังไม่รองรับ 5GHz)","image":"/images/manuals/basic/1-wifi-select.jpg"},{"head":"1.5 บันทึกและรีสตาร์ท","body":"กดปุ่ม Update เครื่องจะทำการบันทึกค่าและ Restart ตัวเองเพื่อเชื่อมต่ออินเทอร์เน็ตจริง","image":"/images/manuals/basic/1-wifi-save.jpg"}]},{"id":"interface","type":"steps","title":"2. การแสดงผลหน้าจอ (Interface)","intro":"ทำความเข้าใจหน้าจอแสดงผลต่างๆ ของ CryptoClock","items":[{"head":"2.1 หน้าจอหลัก (Profile)","body":"แสดงรูปโปรไฟล์, ข้อมูลส่วนตัว, และนาฬิกา (สามารถกดที่พื้นที่ว่างเพื่อสลับไปยังหน้าจอแสดงราคาเหรียญ)","image":"/images/manuals/basic/2-face-main.jpg"},{"head":"2.2 หน้าจอราคาเหรียญ (Crypto Tracker)","body":"แสดงราคา Real-time, สกุลเงินเปรียบเทียบ (THB/USDT), ราคา High/Low 24 ชม. และสามารถแตะโลโก้เหรียญเพื่อตั้งค่าได้","image":"/images/manuals/basic/2-face-crypto.jpeg"},{"head":"2.3 หน้าจอตั้งค่า (Settings Info)","body":"กดปุ่ม Set ที่หน้าจอ จะแสดง IP Address, Device ID และข้อมูลระบบต่างๆ สำหรับใช้ตั้งค่าผ่านเว็บไซต์","image":"/images/manuals/basic/2-face-system.jpeg"}]},{"id":"settings","type":"steps","title":"3. การตั้งค่าขั้นสูง (Advanced Settings)","intro":"วิธีการปรับแต่งการทำงานและเปลี่ยนเหรียญผ่าน Web Interface","items":[{"head":"3.1 เข้าสู่เมนูตั้งค่า","body":"แตะที่รูปโปรไฟล์ หรือโลโก้เหรียญเพื่อแสดง QR Code จากนั้นสแกนด้วยมือถือที่เชื่อมต่อ WiFi เดียวกันกับนาฬิกา","image":"/images/manuals/basic/3-config-qrcode.jpeg"},{"head":"3.2 ปรับความสว่างและเวลา","body":"สามารถปรับ Brightness (ความสว่าง 10-100%), Update Interval (ความถี่ 10-300 วินาที), และ Sleep Time ได้ที่ตัวเครื่องโดยตรง","image":"/images/manuals/basic/3-settings-menu.jpeg"},{"head":"3.3 เปลี่ยนรูปโปรไฟล์และข้อมูล","body":"อัปโหลดรูปโปรไฟล์สกุล .jpg ขนาดไม่เกิน 100x100px และปรับแก้ ชื่อ, ตำแหน่ง (Motto) รวมถึงสีตัวอักษรได้ผ่านเว็บ","image":"/images/manuals/basic/3-config-upload.png"},{"head":"3.4 เลือกเหรียญใหม่","body":"เลือกเหรียญจากรายการที่รองรับ (Binance/Bitkub) แล้วกด Submit เครื่องจะรีสตาร์ทเพื่อแสดงเหรียญใหม่ทันที","image":"/images/manuals/basic/3-coin-select-web.png"}]},{"id":"specs","type":"specs","title":"ข้อมูลทางเทคนิค (Hardware Specs)","items":[{"label":"CPU","value":"Dual-core 32-bit (Up to 240MHz)"},{"label":"Memory","value":"520 KB SRAM / 32Mbit SPI Flash"},{"label":"Wireless","value":"Wi-Fi 802.11 b/g/n (2.4GHz) & Bluetooth 4.2"},{"label":"Power Input","value":"5V / 2A (USB-C)"},{"label":"Image Support","value":"JPEG, BMP, GRAYSCALE"},{"label":"Working Temp","value":"-20℃ ~ 70℃"}]},{"id":"faq","type":"faq","title":"คำถามที่พบบ่อย (FAQ)","items":[{"head":"เชื่อมต่อ WiFi ไม่ได้ ทำอย่างไร?","body":"1. ตรวจสอบว่าเป็น WiFi คลื่น 2.4GHz เท่านั้น (ไม่รองรับ 5GHz)\n2. ลองใช้มือถือปล่อย Hotspot ทดสอบดูว่าเครื่องสามารถเชื่อมต่อได้ปกติหรือไม่"},{"head":"หน้าจอค้าง หรือเปิดไม่ติด","body":"1. ตรวจสอบอแดปเตอร์จ่ายไฟว่ามีกำลังไฟพอหรือไม่ (แนะนำ 5V/2A)\n2. หากค้าง ให้กดปุ่ม Reset ด้านหลังเครื่อง (ปุ่มริมสุด) 1 ครั้งเพื่อรีสตาร์ท"},{"head":"ราคาเหรียญไม่อัปเดต หรือแสดงค่าผิดพลาด","body":"ตรวจสอบสัญญาณอินเทอร์เน็ตที่เชื่อมต่ออยู่ หากยังมีปัญหา ให้ลองปิดแล้วเปิดเครื่องใหม่ หรือกดเปลี่ยนเหรียญอีกครั้ง"}]}]},
  "cryptoclock-pro": {"title":"CryptoClock Pro User Guide","intro":"คู่มือสำหรับรุ่น Pro ที่มาพร้อมจอ IPS Full Color และฟังก์ชันขั้นสูงสำหรับเทรดเดอร์ รวมถึงกราฟแท่งเทียนและการติดตาม Portfolio","sections":[{"type":"list","title":"ฟังก์ชันเด่น (Pro Features)","items":["หน้าจอ IPS LCD คมชัดทุกมุมมอง","กราฟแท่งเทียน (Candlestick) Timeframe 15m - 1D","เชื่อมต่อ API เพื่อดูมูลค่ารวมของ Portfolio","ระบบสัมผัส (Capacitive Touch) เปลี่ยนหน้าจอง่ายๆ","รองรับ NFC (เฉพาะรุ่น NFC Edition) แตะเพื่อสั่งงาน"]},{"type":"steps","title":"1. การตั้งค่าและเชื่อมต่อ","items":[{"head":"1.1 เริ่มต้นใช้งาน","body":"เสียบสาย USB-C หน้าจอจะติดขึ้นมาพร้อมกราฟิก Boot screen เชื่อมต่อ WiFi ตามขั้นตอนมาตรฐาน (เหมือนรุ่น Basic)"},{"head":"1.2 การควบคุมด้วยการสัมผัส","body":"แตะขอบขวาของจอเพื่อ 'ถัดไป', ขอบซ้ายเพื่อ 'ย้อนกลับ', และแตะตรงกลางค้างไว้เพื่อเข้าเมนู 'ด่วน'"}]},{"type":"steps","title":"2. การตั้งค่า Portfolio & API","items":[{"head":"2.1 เตรียม API Key","body":"เข้าไปที่เว็บ Exchange ของคุณ (เช่น Binance/Bitkub) สร้าง API Key โดยเลือกสิทธิ์เป็น 'Read-Only' เท่านั้น (ห้ามติ๊ก Withdraw/Trade เด็ดขาดเพื่อความปลอดภัย)"},{"head":"2.2 เชื่อมต่อกับนาฬิกา","body":"เข้าหน้า Web Config ของ CryptoClock Pro ไปที่เมนู 'Portfolio' กรอก API Key และ Secret Key ที่ได้มา จากนั้นกด Save"},{"head":"2.3 การแสดงผล","body":"เลือกโหมดหน้าจอเป็น 'Portfolio View' เครื่องจะดึงมูลค่าสินทรัพย์ทั้งหมดมาแสดงเป็นสกุลเงินที่คุณเลือก (THB/USD)"}]},{"type":"faq","title":"คำถามที่พบบ่อย (FAQ)","items":[{"head":"กราฟไม่ขึ้น / ขึ้นเป็นเส้นตรง","body":"อาจเกิดจาก Volume เหรียญนั้นต่ำมากในช่วงเวลานั้น หรือ API ของ Exchange มีการจำกัด Rate Limit ให้รอสักครู่ ระบบจะดึงข้อมูลใหม่"},{"head":"ยอดเงินใน Portfolio ไม่ตรง","body":"ระบบจะอัปเดตทุกๆ 1-5 นาที (ตั้งค่าได้) หากมีการเทรดหรือโอนเหรียญเข้าออก อาจต้องรอรอบการอัปเดตถัดไป"}]}]},
  "cryptoclock-epaper": {"title":"CryptoClock ePaper Guide","intro":"คู่มือสำหรับนาฬิกา E-Ink ที่เน้นความสบายตาและการประหยัดพลังงาน เรียนรู้วิธีดูแลรักษาหน้าจอและยืดอายุแบตเตอรี่","sections":[{"type":"list","title":"ฟังก์ชันเด่น (E-Ink Features)","items":["จอ E-Ink สบายตาเหมือนกระดาษ ไม่มีแสงสีฟ้า","แสดงผลค้างได้แม้แบตหมด (Always On Display)","แบตเตอรี่ใช้งานได้ยาวนาน 30-60 วัน","กรอบไม้แท้ งานประกอบ Hand-made Premium"]},{"type":"steps","title":"1. ธรรมชาติของ E-Ink ที่ควรทราบ","items":[{"head":"1.1 การกระพริบของหน้าจอ","body":"หน้าจอจะมีการกระพริบ ดำ-ขาว สลับกันทุกครั้งที่มีการเปลี่ยนข้อมูล เพื่อเป็นการล้างเม็ดหมึก (Refresh) ป้องกันภาพค้าง ถือเป็นอาการปกติ"},{"head":"1.2 Ghosting Effect","body":"หากสังเกตเห็นเงาจางๆ ของตัวเลขเก่า ให้กดปุ่ม Refresh ด้านหลังเครื่อง ระบบจะทำการ Full Refresh เพื่อล้างหน้าจอให้สะอาด"}]},{"type":"steps","title":"2. การดูแลรักษาแบตเตอรี่","items":[{"head":"2.1 การชาร์จไฟ","body":"เมื่อสัญลักษณ์แบตเตอรี่แจ้งเตือน ให้ชาร์จด้วยสาย USB-C ประมาณ 2-3 ชั่วโมงจนไฟสถานะเปลี่ยนเป็นสีเขียว"},{"head":"2.2 ยืดอายุการใช้งาน","body":"แนะนำให้ตั้งค่า Interval การอัปเดตราคาเป็น 5 นาทีขึ้นไป หากตั้งถี่เกินไป (เช่น 1 นาที) แบตเตอรี่จะหมดเร็วขึ้น"}]},{"type":"faq","title":"คำถามที่พบบ่อย (FAQ)","items":[{"head":"หน้าจอแสดงผลช้ากว่ารุ่นอื่น","body":"เป็นข้อจำกัดของเทคโนโลยี E-Ink ที่ต้องใช้เวลาจัดเรียงเม็ดหมึกประมาณ 2-3 วินาที แลกมากับความคมชัดและความสบายตา"},{"head":"วางในที่มืดมองไม่เห็น","body":"รุ่นนี้ไม่มี Backlight (แสงสว่างในตัว) ต้องอาศัยแสงไฟจากภายนอกเหมือนการอ่านหนังสือจริง เพื่อสุขภาพดวงตาที่ดีที่สุด"}]}]},
  "cryptoclock-saving": {"title":"CryptoClock Saving Guide","intro":"คู่มือรุ่นประหยัดพลังงาน ดีไซน์ Retro 7-Segment เรียบง่ายแต่ทรงพลัง เหมาะสำหรับผู้ที่ต้องการโฟกัสแค่ราคา","sections":[{"type":"list","title":"ฟังก์ชันเด่น","items":["จอ LED 7-Segment สไตล์ Retro ยุค 90","ประหยัดไฟสูงสุด (กินไฟน้อยกว่า 1W)","ระบบ Auto-Dimming หรี่แสงอัตโนมัติในที่มืด","ขนาดจิ๋ว พกพาสะดวก"]},{"type":"steps","title":"1. การใช้งาน","items":[{"head":"1.1 การอ่านค่า","body":"เนื่องจากข้อจำกัดของจอ 7-Segment ชื่อเหรียญจะแสดงเป็นตัวย่อ (เช่น BTC, ETH) ตามด้วยราคาที่วิ่งผ่านหน้าจอ"},{"head":"1.2 โหมดกลางคืน (Night Mode)","body":"เซ็นเซอร์วัดแสงจะทำงานอัตโนมัติ หากห้องมืดลง ไฟตัวเลขจะหรี่ลงเพื่อไม่ให้แยงตาขณะนอนหลับ"}]},{"type":"faq","title":"FAQ","items":[{"head":"แสดงภาษาไทยได้ไหม?","body":"ไม่ได้ครับ จอ 7-Segment แสดงได้เฉพาะตัวเลขและตัวอักษรภาษาอังกฤษพื้นฐานเท่านั้น"},{"head":"ใช้ Power Bank ได้ไหม?","body":"ได้ครับ เนื่องจากกินไฟน้อยมาก Power Bank ทั่วไปอาจตัดไฟ (เพราะนึกว่าไม่ได้ใช้งาน) แนะนำให้ใช้รุ่นที่มีโหมด Low Current หรือเสียบไฟบ้านจะเสถียรที่สุด"}]}]},
  "bitterm-series": {"title":"BiTTerm Hybrid ATM: Enterprise Deployment Guide","intro":"คู่มือมาตรฐาน (SOP) ฉบับสมบูรณ์สำหรับ BiTTerm ATM Series ระบบ Micro-ATM อัจฉริยะ ครอบคลุมตั้งแต่การติดตั้ง การใช้งาน การบริหารจัดการสินทรัพย์ดิจิทัล ความปลอดภัย กฎหมาย การสนับสนุน และแผนพัฒนาในอนาคต","sections":[{"id":"intro","type":"features","title":"0. บทนำ: รู้จักกับ BiTTerm ATM","intro":"สรุปข้อมูลสำคัญ: ตู้นี้คืออะไร แก้ปัญหาอะไร และทำไมคุณถึงควรมีไว้ที่ร้าน","items":["BiTTerm คืออะไร?: เครื่อง Micro-ATM รับแลกเงินสด/PromptPay เป็น Bitcoin ได้ทันที ใช้งานง่ายเหมือนตู้เติมเงิน","แก้ปัญหาอะไร?: ลบความยุ่งยากในการซื้อ Bitcoin แบบเดิมๆ ไม่ต้องรอ KYC ไม่ต้องใช้แอปซับซ้อน สอดเงินปุ๊บเหรียญเข้าปั๊บ","วัตถุประสงค์หลัก: สร้างจุดเชื่อมต่อ (Gateway) ให้คนทั่วไปเข้าถึงสินทรัพย์ดิจิทัลได้ง่ายที่สุด ผ่านร้านค้าในชุมชน","ใครควรใช้งาน?: เจ้าของร้านค้า, คาเฟ่ หรือ Community Mall ที่ต้องการรายได้เสริม (Passive Income) และสร้างจุดเด่นให้ธุรกิจ"]},{"id":"overview","type":"grid_card","title":"1. Product Overview & Core Strengths","intro":"ภาพรวมผลิตภัณฑ์และจุดเด่นหลัก","items":[{"head":"Bare-metal / Industrial Design","body":"สถาปัตยกรรมเน้นเสถียรภาพ บูตเร็ว ลดความเสี่ยงระบบค้างและมัลแวร์","image":"/images/manuals/bitterm/core/industrial.jpg"},{"head":"Hybrid Payment","body":"ผสาน Fiat + Lightning + NFC ใช้งานได้จริงกับลูกค้าทั่วไป","image":"/images/manuals/bitterm/core/hybrid.jpg"},{"head":"Real-time Control","body":"แจ้งเตือนและติดตามสถานะเครื่องแบบเรียลไทม์","image":"/images/manuals/bitterm/core/alerts.jpg"},{"head":"Scalable Deployment","body":"รองรับการขยายหลายเครื่อง หลายสาขา และแฟรนไชส์","image":"/images/manuals/bitterm/core/scalable.jpg"}]},{"id":"architecture","type":"specs","title":"2. System Architecture & Specifications","intro":"สถาปัตยกรรมระบบและสเปกฮาร์ดแวร์","items":[{"label":"Architecture","value":"Hybrid Edge (Terminal) + Cloud Core"},{"label":"Processor","value":"Industrial-grade Controller / MCU"},{"label":"Display","value":"3.5\" – 10.1\" Touchscreen (Configurable)"},{"label":"Connectivity","value":"Wi-Fi / Ethernet / Optional LTE"},{"label":"Peripherals","value":"Bill Acceptor, NFC, QR, Printer"},{"label":"Security","value":"Device Identity, Encrypted Storage, Physical Lock"}]},{"id":"installation","type":"steps","title":"3. Installation & Deployment","intro":"มาตรฐานการติดตั้งหน้างาน","items":[{"head":"3.1 Site Preparation","body":"เลือกจุดวางใกล้ไฟฟ้า เครือข่าย และกล้องวงจรปิด","image":"/images/manuals/bitterm/install/site.jpg"},{"head":"3.2 Physical Mounting","body":"ยึดเครื่องและล็อกด้วยระบบป้องกันการงัดแงะ","image":"/images/manuals/bitterm/install/lock.jpg"},{"head":"3.3 Network Pairing","body":"จับคู่เครื่องกับระบบผ่าน WiFi","image":"/images/manuals/bitterm/install/wifi.jpg"}]},{"id":"merchant","type":"steps","title":"4. Merchant Operations & Configuration","intro":"การบริหารจัดการสำหรับร้านค้า (รวม Fees, Limits และ API)","items":[{"head":"Fee & Limit Management","body":"ตั้งค่าค่าธรรมเนียม, ส่วนต่างราคา, วงเงินขั้นต่ำ-สูงสุด ได้เอง","image":"/images/manuals/bitterm/merchant/settings.jpg"},{"head":"API & Webhook Integration","body":"เชื่อมต่อ LNbits, PromptPay และ Partner API","image":"/images/manuals/bitterm/merchant/api.jpg"},{"head":"Daily Operation","body":"ตรวจสอบยอด, Cash-out และ Reconciliation ประจำวัน","image":"/images/manuals/bitterm/merchant/cashout.jpg"}]},{"id":"customer","type":"steps","title":"5. Customer User Guide","intro":"ขั้นตอนการใช้งานสำหรับลูกค้า","items":[{"head":"Step 1: Initiation","body":"เลือกภาษา ตรวจสอบอัตราแลกเปลี่ยน และวิธีชำระเงิน","image":"/images/manuals/bitterm/user/step1.jpg"},{"head":"Step 2: Payment","body":"สอดเงินสด หรือสแกน PromptPay","image":"/images/manuals/bitterm/user/step2.jpg"},{"head":"Step 3: Settlement","body":"รับเงินผ่าน QR (Lightning) หรือแตะ Bolt Card","image":"/images/manuals/bitterm/user/step3.jpg"}]},{"id":"assets","type":"features","title":"6. Wallet, Asset & Token Handling","intro":"การจัดการ Wallet และสินทรัพย์ดิจิทัล","items":["รองรับ Bitcoin (On-chain / Lightning) และ Token ที่กำหนด","สร้าง Address ใหม่ทุกธุรกรรมเพื่อความเป็นส่วนตัว","Logic การยืนยันธุรกรรมตามประเภทเครือข่าย"]},{"id":"logs","type":"features","title":"7. Monitoring, Logs & Audit","intro":"การบันทึกข้อมูลและการตรวจสอบ","items":["Transaction Log: Amount, Hash, Status, Timestamp","Event Log: Login, Config Change, Power Cycle","Error Log: Network / Hardware / API","รองรับ Audit และการตรวจย้อนหลังตามกฎหมาย"]},{"id":"troubleshooting","type":"faq","title":"8. Troubleshooting & Maintenance","items":[{"head":"Bill Jam","body":"เปิดฝาหน้าและนำธนบัตรที่ติดออกอย่างระมัดระวัง"},{"head":"System Offline","body":"ตรวจสอบเครือข่าย หากจำเป็นให้รีบูตเครื่อง"},{"head":"Transaction Failed","body":"ตรวจสอบ Liquidity และสถานะ API"}]},{"id":"firmware","type":"steps","title":"9. Firmware & Lifecycle","intro":"การอัปเดตซอฟต์แวร์และอายุการสนับสนุน","items":[{"head":"OTA Update","body":"ตรวจสอบและอัปเดตอัตโนมัติเมื่อเครื่อง Idle","image":"/images/manuals/bitterm/firmware/fw.jpg"},{"head":"Lifecycle Policy","body":"สนับสนุนซอฟต์แวร์ตามระยะเวลาที่กำหนด","image":"/images/manuals/bitterm/firmware/lifecycle.jpg"}]},{"id":"legal","type":"features","title":"10. Legal Disclaimer & Terms","intro":"ข้อกำหนดและข้อจำกัดความรับผิดชอบ","items":["ไม่รับผิดชอบต่อความผันผวนของราคา","ผู้ใช้งานต้องปฏิบัติตามกฎหมายในเขตอำนาจศาลของตน","ร้านค้าต้องดูแลความปลอดภัยของข้อมูลและรหัสผ่าน"]},{"id":"support","type":"grid_card","title":"11. Support & Escalation","intro":"ช่องทางสนับสนุนและระดับ SLA","items":[{"head":"Critical Issue","body":"กรณีระบบหยุดทำงาน ติดต่อทีมฉุกเฉิน","image":"/images/manuals/bitterm/support/critical.jpg"},{"head":"General Support","body":"แจ้งปัญหาทั่วไปผ่านระบบ Ticket","image":"/images/manuals/bitterm/support/general.jpg"}]},{"id":"roadmap","type":"steps","title":"12. Roadmap & Future Expansion","intro":"แผนพัฒนาในอนาคต","items":[{"head":"Multi-chain Expansion","body":"เพิ่มการรองรับสินทรัพย์และ Layer-2 ใหม่","image":"/images/manuals/bitterm/roadmap/multichain.jpg"},{"head":"Loyalty & Rewards","body":"ระบบสะสมแต้มและสิทธิประโยชน์","image":"/images/manuals/bitterm/roadmap/loyalty.jpg"}]}]},
  "bitpos-terminal": {"title":"BiTPos Terminal Guide","intro":"คู่มือการใช้งานเครื่อง POS รับชำระเงินด้วย Bitcoin Lightning Network สำหรับร้านค้า","sections":[{"type":"list","title":"ฟีเจอร์ร้านค้า","items":["รับเงินทันทีผ่าน Lightning Network (วินาทีเดียวจบ)","พิมพ์ใบเสร็จในตัว (Thermal Printer)","รองรับ NFC (Bolt Card)","สรุปยอดขายรายวันอัตโนมัติ"]},{"type":"steps","title":"1. เริ่มต้นใช้งาน","items":[{"head":"1.1 ใส่กระดาษใบเสร็จ","body":"เปิดฝาครอบด้านบน วางม้วนกระดาษ Thermal ขนาด 58mm โดยให้ด้านมันหงายขึ้น ปิดฝาให้สนิท"},{"head":"1.2 Login ร้านค้า","body":"เปิดแอป BiTPos ใส่ Pairing Code จาก LNBits หรือ BTCPay Server ของร้านคุณเพื่อเชื่อมต่อกระเป๋าเงิน"}]},{"type":"steps","title":"2. วิธีรับเงินลูกค้า","items":[{"head":"2.1 ระบุจำนวนเงิน","body":"กดจำนวนเงินบาทที่ต้องการรับ (เช่น 150 บาท) ระบบจะแปลงเป็น Satoshi อัตโนมัติตามเรทปัจจุบัน"},{"head":"2.2 การชำระเงิน","body":"ลูกค้าสามารถเลือก 'สแกน QR Code' ด้วยมือถือ หรือ 'แตะบัตร NFC' ที่หัวเครื่อง เสียง Beep ยาวจะดังขึ้นเมื่อได้รับเงินสำเร็จ พร้อมพิมพ์ใบเสร็จทันที"}]},{"type":"faq","title":"FAQ","items":[{"head":"เปลี่ยนกระดาษยังไง?","body":"ใช้กระดาษความร้อนขนาด 58mm ทั่วไป (แบบเดียวกับเครื่องรูดบัตรเครดิต) หาซื้อได้ตามร้านเครื่องเขียน"},{"head":"ต้องใช้อินเทอร์เน็ตไหม?","body":"จำเป็นครับ เครื่องรองรับทั้ง WiFi และใส่ซิม 4G หากเน็ตหลุดจะไม่สามารถเจน QR Code ได้"}]}]},
  "bitnode-personal": {"title":"BiTNode Personal Guide","intro":"คู่มือการติดตั้งและดูแลรักษา Bitcoin Full Node ส่วนตัวของคุณ เส้นทางสู่ความเป็นอิสระทางการเงินอย่างแท้จริง","sections":[{"type":"list","title":"สเปกและระบบ","items":["OS: Umbrel หรือ Start9 (Linux based)","Storage: NVMe SSD ความเร็วสูง (สำคัญมากสำหรับการ Sync)","Cooling: Passive Cooling เคสอลูมิเนียมทั้งตัว ไร้เสียงรบกวน"]},{"type":"steps","title":"1. การติดตั้ง Hardware","items":[{"head":"1.1 การเชื่อมต่อ","body":"เสียบสาย LAN เข้ากับ Router บ้านของคุณ (แนะนำให้ต่อตรง ไม่ผ่าน Switch) และเสียบสายไฟ USB-C PD"},{"head":"1.2 เข้าสู่ระบบครั้งแรก","body":"รอประมาณ 5 นาที แล้วเปิด Browser บนคอมพิวเตอร์ พิมพ์ 'http://umbrel.local' (หรือ IP Address ของเครื่อง)"}]},{"type":"steps","title":"2. ขั้นตอนที่สำคัญที่สุด (Setup Wizard)","items":[{"head":"2.1 จด Seed Phrase","body":"ระบบจะแสดงคำศัพท์ 24 คำ (Seed Phrase) **สำคัญมาก!** ให้จดลงกระดาษและเก็บในที่ปลอดภัย ห้ามถ่ายรูปหรือเซฟลงคอมเด็ดขาด นี่คือกุญแจเดียวในการกู้เงินของคุณ"},{"head":"2.2 Initial Block Download (IBD)","body":"หลังจากตั้งรหัสผ่าน เครื่องจะเริ่มดาวน์โหลดประวัติธุรกรรม Bitcoin ทั้งหมดตั้งแต่อดีต (IBD) ขั้นตอนนี้จะใช้เวลา 2-4 วัน ห้ามถอดปลั๊กหรือปิดเน็ต"}]},{"type":"faq","title":"FAQ & Troubleshooting","items":[{"head":"ตัวเครื่องร้อนมาก ผิดปกติไหม?","body":"ปกติครับ เคสถูกออกแบบมาให้เป็น Heatsink ระบายความร้อน ผิวสัมผัสอาจร้อนถึง 45-50 องศาขณะ Sync ข้อมูล ไม่ต้องกังวล"},{"head":"ไฟดับขณะ Sync เป็นอะไรไหม?","body":"ระบบ File System (Btrfs/Ext4) มีความทนทาน เมื่อไฟมาเครื่องจะบูตและทำ Self-check สักพักแล้วจะทำงานต่อเอง แนะนำให้มี UPS สำรองไฟจะดีที่สุด"}]}]},
};

const $$Astro = createAstro();
async function getStaticPaths() {
  return products.map((product) => ({
    params: { id: product.id },
    props: { product }
  }));
}
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const product = Astro2.props.product || products.find((p) => p.id === id);
  if (!product) {
    return Astro2.redirect("/404");
  }
  const manuals = manualsData;
  const manual = manuals[product.id] || {
    title: "Coming Soon",
    intro: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E23\u0E38\u0E48\u0E19\u0E19\u0E35\u0E49\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E17\u0E33",
    sections: []
  };
  const defaultTheme = {
    bgMain: "bg-[#050505]",
    // พื้นหลังหลัก
    bgGradient: "",
    // แสง Gradient ด้านบน (ถ้ามี)
    textMain: "text-white",
    // สีตัวอักษรหลัก
    textSub: "text-white/60",
    // สีตัวอักษรรอง
    accent: "text-[#D4AF37]",
    // สีเน้น (หัวข้อ/ลิ้งค์)
    accentBg: "bg-[#D4AF37]",
    // สีพื้นหลังของปุ่ม/Icon
    cardBg: "bg-[#111]",
    // สีพื้นหลังของการ์ด
    cardBorder: "border-white/10",
    // สีขอบการ์ด
    stepBadge: "bg-[#D4AF37]/10 text-[#D4AF37]"
    // สีป้าย Step
  };
  const themeSettings = {
    // 1. CryptoClock Basic: สีเทอร์ควอยซ์ (Turquoise/Teal)
    "cryptoclock-basic": {
      ...defaultTheme,
      bgMain: "bg-slate-950",
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/30 via-slate-950 to-slate-950",
      accent: "text-teal-400",
      accentBg: "bg-teal-500",
      stepBadge: "bg-teal-500/10 text-teal-400"
    },
    // 2. CryptoClock Pro: สีเขียวเข้ม (Dark Green/Emerald)
    "cryptoclock-pro": {
      ...defaultTheme,
      bgMain: "bg-black",
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/40 via-black to-black",
      accent: "text-emerald-400",
      accentBg: "bg-emerald-500",
      stepBadge: "bg-emerald-500/10 text-emerald-400"
    },
    // 3. CryptoClock ePaper: สีขาว/หินอ่อน (White/Marble - Light Theme)
    "cryptoclock-epaper": {
      ...defaultTheme,
      bgMain: "bg-[#f8f9fa]",
      // พื้นหลังสว่าง
      bgGradient: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-200 via-[#f8f9fa] to-[#f8f9fa]",
      textMain: "text-slate-900",
      // เปลี่ยนตัวอักษรเป็นสีเข้ม
      textSub: "text-slate-600",
      accent: "text-slate-800",
      accentBg: "bg-slate-800",
      cardBg: "bg-white",
      // การ์ดสีขาว
      cardBorder: "border-gray-200 shadow-sm",
      // ขอบสีเทาอ่อน + เงา
      stepBadge: "bg-slate-200 text-slate-800"
    },
    // 4. CryptoClock Saving: สีส้ม Cyberpunk
    "cryptoclock-saving": {
      ...defaultTheme,
      bgMain: "bg-black",
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/20 via-black to-black",
      accent: "text-orange-500",
      accentBg: "bg-orange-600",
      stepBadge: "bg-orange-500/10 text-orange-500"
    },
    // 5. BiTTerm Series: สีส้ม Bitcoin Industrial
    "bitterm-series": {
      ...defaultTheme,
      bgMain: "bg-[#0b0b0b]",
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/20 via-[#0b0b0b] to-[#0b0b0b]",
      accent: "text-amber-500",
      accentBg: "bg-amber-600",
      stepBadge: "bg-amber-500/10 text-amber-500"
    },
    // 6. BiTPos Terminal: สีแดง (Red/Restaurant)
    "bitpos-terminal": {
      ...defaultTheme,
      bgMain: "bg-[#0f0505]",
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-[#0f0505] to-[#0f0505]",
      accent: "text-red-500",
      accentBg: "bg-red-600",
      stepBadge: "bg-red-500/10 text-red-500"
    },
    // 7. BiTNode Personal: สีส้ม+ม่วง (Lightning Network)
    "bitnode-personal": {
      ...defaultTheme,
      bgMain: "bg-[#080510]",
      // พื้นหลังอมม่วงดำ
      bgGradient: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-orange-900/10 to-[#080510]",
      accent: "text-purple-400",
      accentBg: "bg-purple-500",
      stepBadge: "bg-purple-500/10 text-purple-400"
    }
  };
  const theme = themeSettings[product.id] || defaultTheme;
  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Manual: ${product.meta.title}` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, {})} ${maybeRenderHead()}<main${addAttribute(`${theme.bgMain} ${theme.bgGradient} min-h-screen pt-28 pb-20 scroll-smooth`, "class")}>   <div${addAttribute(`relative border-b ${theme.cardBorder} bg-transparent`, "class")}> <div class="max-w-7xl mx-auto px-6 py-16"> <a${addAttribute(`/products/${product.id}`, "href")}${addAttribute(`inline-flex items-center gap-2 ${theme.accent} text-sm font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity`, "class")}> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
Back to Product
</a> <h1${addAttribute(`text-4xl md:text-6xl font-black ${theme.textMain} mb-6 leading-tight`, "class")}> ${manual.title} <span${addAttribute(`block ${theme.accent} text-2xl md:text-4xl mt-2 font-bold`, "class")}>${product.meta.title}</span> </h1> <p${addAttribute(`${theme.textSub} text-xl max-w-3xl leading-relaxed`, "class")}> ${manual.intro} </p> </div> </div> <div class="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">  <aside class="hidden lg:block w-64 shrink-0"> <div${addAttribute(`sticky top-32 ${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6`, "class")}> <h3${addAttribute(`${theme.textMain} font-bold mb-4 uppercase tracking-wider text-sm border-b ${theme.cardBorder} pb-2`, "class")}>
Contents
</h3> <ul class="space-y-1 text-sm"> ${manual.sections.map((section) => renderTemplate`<li> <a${addAttribute(`#${section.id}`, "href")}${addAttribute(`${theme.textSub} hover:${theme.accent} transition-all block py-2 px-3 rounded-lg -ml-3`, "class")}> ${section.title} </a> </li>`)} </ul> </div> </aside>  <div class="flex-1 space-y-20"> ${manual.sections.map(
    (section, idx) => renderTemplate`<section${addAttribute(section.id, "id")} class="scroll-mt-32">  <div${addAttribute(`mb-8 border-l-4 ${theme.cardBorder.replace("border", "border-l-4").replace("white/10", theme.accent.replace("text-", "border-"))} pl-6`, "class")}${addAttribute(`border-color: currentColor; color: ${theme.accentBg.replace("bg-", "")}`, "style")}>  <h2${addAttribute(`text-3xl font-bold ${theme.textMain} mb-2`, "class")}> ${section.title} </h2> ${section.intro && renderTemplate`<p${addAttribute(theme.textSub, "class")}> ${section.intro} </p>`} </div>   ${section.type === "features" && renderTemplate`<ul class="grid md:grid-cols-2 gap-4"> ${section.items.map((item) => renderTemplate`<li${addAttribute(`flex items-start gap-3 ${theme.cardBg} p-4 rounded-xl border ${theme.cardBorder} hover:opacity-90 transition-opacity`, "class")}> <svg${addAttribute(`w-6 h-6 ${theme.accent} shrink-0`, "class")} fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path> </svg> <span${addAttribute(`${theme.textSub}`, "class")}> ${item} </span> </li>`)} </ul>`}  ${section.type === "grid_card" && renderTemplate`<div class="grid md:grid-cols-2 gap-6"> ${section.items.map(
      (item) => renderTemplate`<div${addAttribute(`${theme.cardBg} rounded-2xl border ${theme.cardBorder} overflow-hidden group hover:border-opacity-50 transition-colors`, "class")}> ${item.image && renderTemplate`<div class="overflow-hidden"> <img${addAttribute(item.image, "src")}${addAttribute(item.head, "alt")} class="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"> </div>`} <div class="p-6"> <h3${addAttribute(`text-xl font-bold ${theme.accent} mb-2`, "class")}> ${item.head} </h3> <p${addAttribute(`${theme.textSub} leading-relaxed`, "class")}> ${item.body} </p> </div> </div>`
    )} </div>`}  ${section.type === "steps" && renderTemplate`<div class="space-y-8"> ${section.items.map(
      (item, stepIdx) => {
        const youtubeID = item.video ? getYouTubeID(item.video) : null;
        return renderTemplate`<div${addAttribute(`flex flex-col md:flex-row gap-8 ${theme.cardBg} p-6 md:p-8 rounded-3xl border ${theme.cardBorder}`, "class")}>  <div class="md:w-1/2 space-y-4"> <span${addAttribute(`inline-block px-3 py-1 rounded ${theme.stepBadge} text-xs font-bold uppercase tracking-wider`, "class")}>
Step${" "} ${stepIdx + 1} </span> <h3${addAttribute(`text-2xl font-bold ${theme.textMain} leading-snug`, "class")}> ${item.head} </h3> <p${addAttribute(`${theme.textSub} text-lg leading-relaxed`, "class")}> ${item.body} </p> </div>  <div class="md:w-1/2 space-y-4"> ${item.image && renderTemplate`<img${addAttribute(
          item.image,
          "src"
        )}${addAttribute(
          item.head,
          "alt"
        )}${addAttribute(`rounded-xl w-full border ${theme.cardBorder} shadow-lg`, "class")} loading="lazy">`} ${item.video && (youtubeID ? renderTemplate`<div${addAttribute(`rounded-xl overflow-hidden border ${theme.cardBorder} shadow-lg aspect-video bg-black`, "class")}> <iframe width="100%" height="100%"${addAttribute(`https://www.youtube.com/embed/${youtubeID}`, "src")}${addAttribute(
          item.head,
          "title"
        )} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div>` : renderTemplate`<video controls${addAttribute(`rounded-xl w-full border ${theme.cardBorder} shadow-lg bg-black aspect-video`, "class")}> <source${addAttribute(
          item.video,
          "src"
        )} type="video/mp4">
Your
                                                                        browser
                                                                        does not
                                                                        support
                                                                        the
                                                                        video
                                                                        tag.
</video>`)} </div> </div>`;
      }
    )} </div>`}  ${section.type === "specs" && renderTemplate`<div${addAttribute(`${theme.cardBg} rounded-2xl border ${theme.cardBorder} overflow-hidden`, "class")}> <table class="w-full text-left"> <tbody${addAttribute(`divide-y ${theme.cardBorder.includes("white") ? "divide-white/10" : "divide-gray-200"}`, "class")}> ${section.items.map(
      (item) => renderTemplate`<tr class="hover:bg-white/5 transition-colors"> <th${addAttribute(`py-4 px-6 ${theme.accent} font-medium w-1/3 align-top`, "class")}> ${item.label} </th> <td${addAttribute(`py-4 px-6 ${theme.textSub}`, "class")}> ${item.value} </td> </tr>`
    )} </tbody> </table> </div>`}  ${section.type === "faq" && renderTemplate`<div class="grid gap-4"> ${section.items.map(
      (item) => renderTemplate`<div${addAttribute(`${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} hover:opacity-90 transition-colors`, "class")}> <h3${addAttribute(`text-lg font-bold ${theme.textMain} mb-3 flex items-start gap-3`, "class")}> <span${addAttribute(`${theme.accent} bg-current/10 px-2 rounded`, "class")}>
Q
</span> ${item.head} </h3> <p${addAttribute(`${theme.textSub} pl-9 leading-relaxed`, "class")}> ${item.body} </p> </div>`
    )} </div>`} </section>`
  )}  <section${addAttribute(`pt-16 border-t ${theme.cardBorder} text-center`, "class")}> <h2${addAttribute(`text-2xl font-bold ${theme.textMain} mb-2`, "class")}>
ยังติดปัญหาการใช้งาน?
</h2> <p${addAttribute(`${theme.textSub} mb-8`, "class")}>
ทีมงาน Support พร้อมช่วยเหลือคุณทุกวัน (10:00 - 20:00)
</p> <div class="flex justify-center gap-6"> <a href="https://lin.ee/fllUbyx" target="_blank" class="flex items-center gap-3 px-6 py-3 bg-[#06C755] rounded-full text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[#06C755]/20"> <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" class="w-6 h-6 filter brightness-0 invert" alt="Line">
Line Support
</a> <a href="https://www.facebook.com/cryptoclockofficial" target="_blank" class="flex items-center gap-3 px-6 py-3 bg-[#1877F2] rounded-full text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[#1877F2]/20"> <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" class="w-5 h-5 filter brightness-0 invert" alt="Facebook">
Facebook
</a> </div> </section> </div> </div> </main> ${renderComponent($$result2, "Footer", $$Footer, {})} ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/knowledge/[id].astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/knowledge/[id].astro";
const $$url = "/knowledge/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
