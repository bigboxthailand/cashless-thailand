import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
    Quote, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2,
    Heading3, Undo, Redo, Eraser, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

const CATEGORIES = ["ข่าวกระแส", "ความรู้คริปโต", "ความปลอดภัย", "ไลฟ์สไตล์", "ประกาศ"];

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt('ใส่ URL รูปภาพ:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = window.prompt('ใส่ URL ลิงก์:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/5 sticky top-0 z-10 backdrop-blur-md">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <Italic size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('underline') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <UnderlineIcon size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 1 }) ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <Heading1 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 2 }) ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('heading', { level: 3 }) ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <Heading3 size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <ListOrdered size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <Quote size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 self-center" />
            <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-white/10 text-white/60"
            >
                <ImageIcon size={18} />
            </button>
            <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'text-[#D4AF37] bg-white/10' : 'text-white/60'}`}
            >
                <LinkIcon size={18} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded hover:bg-white/10 text-white/60 disabled:opacity-20"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded hover:bg-white/10 text-white/60 disabled:opacity-20"
            >
                <Redo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                className="p-2 rounded hover:bg-white/10 text-white/60"
            >
                <Eraser size={18} />
            </button>
        </div>
    );
};

export default function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        short_description: '',
        image_url: '',
        category: 'ข่าวกระแส',
        tags: '',
        is_published: false
    });

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
            Underline,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[400px] text-white',
            },
        },
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            short_description: post.short_description || '',
            image_url: post.image_url || '',
            category: post.category || 'ข่าวกระแส',
            tags: (post.tags || []).join(', '),
            is_published: post.is_published
        });
        editor?.commands.setContent(post.content || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingPost(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            short_description: '',
            image_url: '',
            category: 'ข่าวกระแส',
            tags: '',
            is_published: false
        });
        editor?.commands.setContent('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            ...formData,
            content: editor?.getHTML() || '',
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        };

        if (editingPost) {
            const { error } = await supabase
                .from('blog_posts')
                .update(postData)
                .eq('id', editingPost.id);
            if (error) alert("Update failed: " + error.message);
            else {
                setEditingPost(null);
                resetForm();
                fetchPosts();
            }
        } else {
            const { error } = await supabase
                .from('blog_posts')
                .insert([postData]);
            if (error) alert("Insert failed: " + error.message);
            else {
                resetForm();
                fetchPosts();
            }
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) return;
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) alert("Delete failed: " + error.message);
        else fetchPosts();
    };

    const generateSlug = () => {
        if (formData.slug) return;
        const slug = formData.title
            .toLowerCase()
            .replace(/[^\u0E00-\u0E7Fa-z0-9 ]/g, '')
            .replace(/\s+/g, '-');
        setFormData({ ...formData, slug });
    };

    return (
        <div className="space-y-10">
            {/* Form Section */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-8 bg-[#D4AF37] rounded-full"></span>
                    {editingPost ? "แก้ไขบทความ" : "เขียนบทความใหม่"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">หัวข้อ (Title)</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                onBlur={generateSlug}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                placeholder="หัวข้อภาษาไทย..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">URL Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all font-mono text-sm"
                                placeholder="url-slug-here"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">หมวดหมู่ (Category)</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">รูปหน้าปก (Image URL)</label>
                            <input
                                type="text"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">คำอธิบายสั้นๆ (Short Description)</label>
                        <textarea
                            value={formData.short_description}
                            onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all h-20"
                            placeholder="แสดงในหน้าลิสต์บทความ..."
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">เนื้อหาบทความ (Professional Content Editor)</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden min-h-[500px] flex flex-col">
                            <MenuBar editor={editor} />
                            <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-white/50 text-xs font-bold uppercase tracking-widest pl-1">แท็ก (Tags - คั่นด้วย Comma)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                                placeholder="crypto, bitcoin, thailand..."
                            />
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 h-[52px]">
                            <input
                                type="checkbox"
                                id="is_published"
                                checked={formData.is_published}
                                onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                className="w-5 h-5 accent-[#D4AF37]"
                            />
                            <label htmlFor="is_published" className="text-white font-bold text-sm cursor-pointer">เปิดเผยสู่สาธารณะ (Publish)</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        {editingPost && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-8 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                            >
                                ยกเลิก
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-10 py-3 rounded-xl bg-[#D4AF37] text-black font-black uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                        >
                            {editingPost ? "บันทึกการแก้ไข" : "สร้างบทความ"}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-8 bg-[#D4AF37] rounded-full"></span>
                        รายการบทความทั้งหมด
                    </h2>
                    <button onClick={fetchPosts} className="text-[#D4AF37] text-sm font-bold hover:underline">Refresh</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-white/40 text-[10px] uppercase tracking-widest border-b border-white/10">
                                <th className="p-4">รูป & หัวข้อ</th>
                                <th className="p-4">หมวดหมู่</th>
                                <th className="p-4">วันที่</th>
                                <th className="p-4">สถานะ</th>
                                <th className="p-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                                {post.image_url && <img src={post.image_url} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="max-w-xs">
                                                <p className="font-bold text-white text-sm truncate">{post.title}</p>
                                                <p className="text-[10px] text-white/30 truncate">{post.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-white/70 border border-white/10">
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/50 text-xs">
                                        {new Date(post.created_at).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="p-4">
                                        {post.is_published ? (
                                            <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                Published
                                            </span>
                                        ) : (
                                            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Draft</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(post)}
                                                className="p-2 text-white/30 hover:text-[#D4AF37] transition-colors"
                                                title="Edit"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-white/30 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 0-2 2H7a2 2 0 0 0-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <div className="p-10 text-center text-white/30 text-sm">กำลังโหลดข้อมูล...</div>}
                    {!loading && posts.length === 0 && <div className="p-10 text-center text-white/30 text-sm italic">ยังไม่มีบทความในระบบ</div>}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ProseMirror {
                    padding: 2rem;
                    outline: none !important;
                    min-height: 400px;
                }
                .ProseMirror h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; color: white; }
                .ProseMirror h2 { font-size: 2rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: white; border-left: 4px solid #D4AF37; padding-left: 1rem; }
                .ProseMirror h3 { font-size: 1.5rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 1rem; color: white; }
                .ProseMirror p { margin-bottom: 1.25rem; line-height: 1.8; color: rgba(255,255,255,0.8); }
                .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
                .ProseMirror blockquote { border-left: 3px solid #D4AF37; padding-left: 1.5rem; font-style: italic; color: #D4AF37; margin: 2rem 0; }
                .ProseMirror img { max-width: 100%; border-radius: 1rem; margin: 2rem 0; border: 1px solid rgba(255,255,255,0.1); }
                .ProseMirror a { color: #D4AF37; text-decoration: underline; font-weight: bold; }
            ` }} />
        </div>
    );
}
