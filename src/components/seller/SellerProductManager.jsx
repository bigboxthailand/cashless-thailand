import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

const SellerProductManager = ({ shopId: propShopId }) => {
    const [shopId, setShopId] = useState(propShopId);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // basic, media, sales, marketing, attributes

    // Initial Form State matching Admin
    const initialFormState = {
        id: null,
        name: '',
        category: 'Hardware Wallet',
        subcategory: '',
        description: '',
        images: ['', '', '', '', ''],
        video: '',
        brand: '',
        model: '',
        condition: 'New',

        // Sales - Single
        price: '',
        comparePrice: '',
        stock: '',
        sku: '',

        // Sales - Variants
        hasVariants: false,
        variantOptions: [], // [{ name: "Color", values: ["Red", "Blue"] }]
        variantCombinations: [], // [{ name: "Red", price: 100, stock: 10, sku: "..." }]

        // Shipping
        weight: '',
        width: '',
        length: '',
        height: '',

        // Marketing
        marketing: {
            headline: '',
            subheadline: '',
            benefits: [] // { title, desc, icon }
        },

        // Tech Specs
        techSpecs: [], // { label, value }

        // Manual
        manualLink: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const CATEGORY_DATA = {
        "Hardware Wallet": ["Trezor", "Ledger", "Tangem", "OneKey", "BitBox", "Keystone"],
        "Clock": ["BitBlock", "Tickr", "Custom", "Desktop", "Wall"],
        "Accessory": ["Cable", "Case", "Stand", "Sticker", "Seed Storage"],
        "Kiosk": ["POS Terminal", "ATM", "Display", "Vending"],
        "Book": ["Education", "Novel", "Comic", "Whitepaper", "Technical", "Investment"],
        "eBook": ["PDF", "ePub", "Kindle", "Audiobook"],
        "Digital Content": ["Course", "Voucher", "Subscription", "License"],
        "Merchandise": ["T-Shirt", "Cap", "Hoodie", "Mug", "Bag", "Sticker Pack"],
        "Shirt": ["T-Shirt", "Polo", "Hoodie"],
        "Keychain": ["Metal", "Acrylic", "Leather"],
        "Mug": ["Ceramic", "Thermal", "Travel"]
    };

    // Resolve Shop ID for Wallet Users if not provided
    useEffect(() => {
        if (propShopId) {
            setShopId(propShopId);
        } else {
            const wallet = localStorage.getItem('user_wallet');
            if (wallet) resolveWalletShop(wallet);
        }
    }, [propShopId]);

    const resolveWalletShop = async (wallet) => {
        try {
            const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', wallet).single();
            if (profile) {
                const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', profile.id).single();
                if (shop) {
                    setShopId(shop.id);
                }
            }
        } catch (e) {
            console.error("Error resolving shop:", e);
        }
    };

    // Helper: Format Currency
    const formatCurrency = (amount) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);

    // Fetch Products
    useEffect(() => {
        if (shopId) fetchProducts();
    }, [shopId]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('shop_id', shopId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Helper: Stock Calculation
    const helperGetStock = (product) => {
        if (product.config?.hasVariants && product.config?.variants?.length > 0) {
            return product.config.variants.reduce((a, b) => a + (parseInt(b.stock) || 0), 0);
        }
        return parseInt(product.config?.inventory?.stock || product.inventory?.stock || product.stock || 0);
    };

    const helperGetStockColor = (stock) => {
        if (stock === 0) return "text-red-500";
        if (stock < 10) return "text-yellow-500";
        return "text-green-500";
    };

    // Variant Helper: Generate Combinations (Effect)
    useEffect(() => {
        if (!formData.hasVariants || formData.variantOptions.length === 0) return;
        // Logic to auto-update combos if needed, but we usually trigger this manually on option change
    }, [formData.variantOptions]);


    // Handlers
    const openAddModal = () => {
        setIsEditing(false);
        setFormData(initialFormState);
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditing(true);
        setActiveTab('basic');

        const meta = product.meta || {};
        const config = product.config || {};
        const pricing = product.pricing || {};
        const inventory = product.inventory || config.inventory || {};
        const media = product.media || {};
        const shipping = product.shipping || {};

        const hasVariants = !!(config.variants && config.variants.length > 0);
        let variantOptions = config.variantOptions || [];
        let variantCombinations = config.variants || [];

        if (hasVariants && variantOptions.length === 0) {
            variantOptions = [{ name: "Variation", values: variantCombinations.map(v => v.name) }];
        }

        setFormData({
            id: product.id,
            name: product.name || product.title || meta.title || '',
            category: config.category || product.category || 'Hardware Wallet',
            subcategory: config.subcategory || '',
            description: meta.description || '',
            images: [
                media.mainImage || product.image_url || '',
                ...(media.gallery || ['', '', '', ''])
            ].slice(0, 5),
            video: media.video || '',
            brand: meta.brand || '',
            model: meta.model || '',
            condition: meta.condition || 'New',

            // Single Sales
            price: pricing.basePrice || product.price || '',
            comparePrice: pricing.comparePrice || '',
            stock: inventory.stock || product.stock || '',
            sku: inventory.sku || '',

            // Variants
            hasVariants,
            variantOptions,
            variantCombinations,

            // Shipping
            weight: shipping.weight || inventory.weight || '',
            length: shipping.length || inventory.dimensions?.length || '',
            width: shipping.width || inventory.dimensions?.width || '',
            height: shipping.height || inventory.dimensions?.height || '',

            // Marketing
            marketing: config.marketing || { headline: '', subheadline: '', benefits: [] },
            techSpecs: config.techSpecs || [],
            manualLink: config.manualLink || '',
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Logic for Price
            let finalBasePrice = parseFloat(formData.price) || 0;
            if ((finalBasePrice === 0 || !formData.price) && formData.hasVariants && formData.variantCombinations.length > 0) {
                const prices = formData.variantCombinations.map(v => parseFloat(v.price) || 0).filter(p => p > 0);
                if (prices.length > 0) finalBasePrice = Math.min(...prices);
            }

            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            const productPayload = {
                shop_id: shopId, // CRITICAL: Link to Seller Shop
                category: formData.category,
                meta: {
                    title: formData.name,
                    description: formData.description,
                    brand: formData.brand,
                    model: formData.model,
                    condition: formData.condition,
                },
                config: {
                    hasVariants: formData.hasVariants,
                    variantOptions: formData.hasVariants ? formData.variantOptions : [],
                    variants: formData.hasVariants ? formData.variantCombinations : [],
                    subcategory: formData.subcategory,
                    inventory: {
                        stock: parseInt(formData.stock) || 0,
                        sku: formData.sku || `SKU-${Date.now()}`,
                        weight: parseFloat(formData.weight) || 0,
                        dimensions: {
                            width: parseFloat(formData.width) || 0,
                            length: parseFloat(formData.length) || 0,
                            height: parseFloat(formData.height) || 0
                        }
                    },
                    marketing: formData.marketing,
                    techSpecs: formData.techSpecs,
                    manualLink: formData.manualLink,
                },
                media: {
                    mainImage: formData.images[0] || 'https://placehold.co/400',
                    gallery: formData.images.slice(1).filter(url => url),
                    video: formData.video
                },
                pricing: {
                    basePrice: finalBasePrice,
                    comparePrice: parseFloat(formData.comparePrice) || null,
                    currency: 'THB'
                }
            };

            let error;
            if (isEditing) {
                const { data, error: updateError } = await supabase
                    .from('products')
                    .update(productPayload)
                    .eq('id', formData.id)
                    .eq('shop_id', shopId) // Security: Ensure ownership
                    .select()
                    .single();

                if (!updateError && data) {
                    setProducts(prev => prev.map(p => p.id === data.id ? data : p));
                }
                error = updateError;
            } else {
                const newId = `${slug}-${Date.now().toString().slice(-4)}`;
                const { data, error: insertError } = await supabase
                    .from('products')
                    .insert([{ ...productPayload, id: newId }])
                    .select()
                    .single();

                if (!insertError && data) {
                    setProducts(prev => [data, ...prev]);
                }
                error = insertError;
            }

            if (error) throw error;
            setIsModalOpen(false);

        } catch (err) {
            console.error('Error saving product:', err);
            alert('Failed to save product: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Image Upload Logic ---
    const resizeImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
                    }, file.type, 0.7);
                };
            };
        });
    };

    const handleImageUpload = async (e, index) => {
        let file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) file = await resizeImage(file);

        try {
            setIsLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `seller/${shopId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`; // Organize by Shop

            const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);

            const newImages = [...formData.images];
            newImages[index] = publicUrl;
            setFormData({ ...formData, images: newImages });

        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVariantImageUpload = async (e, comboIndex) => {
        let file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) file = await resizeImage(file);

        try {
            setIsLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);

            updateCombinationField(comboIndex, 'image', publicUrl);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id).eq('shop_id', shopId);
            if (error) throw error;
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete: ' + err.message);
        }
    };

    // --- Variant Logic ---
    const handleAddVariantOption = () => {
        setFormData(prev => ({
            ...prev,
            variantOptions: [...prev.variantOptions, { name: '', values: [] }]
        }));
    };

    const handleRemoveVariantOption = (index) => {
        const newOptions = [...formData.variantOptions];
        newOptions.splice(index, 1);
        setFormData(prev => ({ ...prev, variantOptions: newOptions }));
    };

    const handleOptionNameChange = (index, val) => {
        const newOptions = [...formData.variantOptions];
        newOptions[index].name = val;
        setFormData(prev => ({ ...prev, variantOptions: newOptions }));
    };

    const handleAddOptionValue = (index, val) => {
        if (!val) return;
        const newOptions = [...formData.variantOptions];
        if (!newOptions[index].values.includes(val)) {
            newOptions[index].values.push(val);
            setFormData(prev => ({ ...prev, variantOptions: newOptions }));
            updateCombinations(newOptions);
        }
    };

    const handleRemoveOptionValue = (optIndex, valIndex) => {
        const newOptions = [...formData.variantOptions];
        newOptions[optIndex].values.splice(valIndex, 1);
        setFormData(prev => ({ ...prev, variantOptions: newOptions }));
        updateCombinations(newOptions);
    };

    const updateCombinations = (options) => {
        if (options.length === 0) {
            setFormData(prev => ({ ...prev, variantCombinations: [] }));
            return;
        }

        const firstOption = options[0];
        const secondOption = options[1];
        let combos = [];

        if (secondOption && secondOption.values.length > 0) {
            firstOption.values.forEach(v1 => {
                secondOption.values.forEach(v2 => {
                    combos.push({
                        name: `${v1} - ${v2}`,
                        price: formData.price || '',
                        comparePrice: formData.comparePrice || '',
                        stock: formData.stock || '',
                        sku: `${formData.sku}-${v1}-${v2}`.toUpperCase(),
                        image: '',
                        weight: formData.weight || ''
                    });
                });
            });
        } else {
            firstOption.values.forEach(v1 => {
                combos.push({
                    name: v1,
                    price: formData.price || '',
                    comparePrice: formData.comparePrice || '',
                    stock: formData.stock || '',
                    sku: `${formData.sku}-${v1}`.toUpperCase(),
                    image: '',
                    weight: formData.weight || ''
                });
            });
        }
        // TODO: Merge existing values if names match to preserve data
        setFormData(prev => ({ ...prev, variantCombinations: combos }));
    };

    const updateCombinationField = (index, field, value) => {
        const newCombos = [...formData.variantCombinations];
        newCombos[index][field] = value;
        setFormData(prev => ({ ...prev, variantCombinations: newCombos }));
    };

    // --- Media Helpers ---
    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    // --- Marketing Helpers ---
    const handleMarketingChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            marketing: { ...prev.marketing, [field]: value }
        }));
    };

    const handleAddBenefit = () => {
        setFormData(prev => ({
            ...prev,
            marketing: {
                ...prev.marketing,
                benefits: [...(prev.marketing.benefits || []), { title: '', desc: '', icon: 'gift' }]
            }
        }));
    };

    const handleBenefitChange = (index, field, value) => {
        const newBenefits = [...(formData.marketing.benefits || [])];
        newBenefits[index][field] = value;
        setFormData(prev => ({
            ...prev,
            marketing: { ...prev.marketing, benefits: newBenefits }
        }));
    };

    const handleRemoveBenefit = (index) => {
        const newBenefits = [...(formData.marketing.benefits || [])];
        newBenefits.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            marketing: { ...prev.marketing, benefits: newBenefits }
        }));
    };

    // --- Tech Specs Helpers ---
    const handleAddTechSpec = () => {
        setFormData(prev => ({
            ...prev,
            techSpecs: [...(prev.techSpecs || []), { label: '', value: '' }]
        }));
    };

    const handleTechSpecChange = (index, field, value) => {
        const newSpecs = [...(formData.techSpecs || [])];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, techSpecs: newSpecs }));
    };

    const handleRemoveTechSpec = (index) => {
        const newSpecs = [...(formData.techSpecs || [])];
        newSpecs.splice(index, 1);
        setFormData(prev => ({ ...prev, techSpecs: newSpecs }));
    };


    const filteredProducts = products.filter(p =>
        (p.name || p.meta?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: '📝' },
        { id: 'media', label: 'Media', icon: '🖼️' },
        { id: 'sales', label: 'Sales Info', icon: '💰' },
        { id: 'marketing', label: 'Marketing & Specs', icon: '📢' },
        { id: 'attributes', label: 'Attributes', icon: '🏷️' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase">Products</h2>
                    <p className="text-white/50 text-sm">{products.length} items listed</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex bg-black/50 backdrop-blur-md rounded border border-white/10 p-1">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#D4AF37] w-full"
                    />
                    <button onClick={openAddModal} className="bg-[#D4AF37] text-black font-bold px-6 py-2 rounded-xl whitespace-nowrap hover:bg-[#b89530]">
                        + Add New
                    </button>
                </div>
            </div>

            {/* Product View */}
            {viewMode === 'list' ? (
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white/70">
                            <thead className="bg-white/5 text-white font-bold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">Product</th>
                                    <th className="p-4 text-center">Category</th>
                                    <th className="p-4 text-center">Stock</th>
                                    <th className="p-4 text-right">Price</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/2 transition-colors">
                                        <td className="p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                                <img
                                                    src={product.media?.mainImage || product.image_url || "https://placehold.co/100"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-base line-clamp-1">{product.name || product.title || product.meta?.title}</div>
                                                <div className="text-xs text-white/40 font-mono mt-1">ID: {product.id.substring(0, 8)}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-white/5 text-white/70 border border-white/10">
                                                {product.config?.category || product.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className={`font-bold ${helperGetStockColor(helperGetStock(product))}`}>
                                                {helperGetStock(product)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-bold text-[#D4AF37]">
                                            {formatCurrency(product.pricing?.basePrice || product.price || 0)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openEditModal(product)} className="text-white/50 hover:text-white px-2 py-1">Edit</button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500/50 hover:text-red-500 px-2 py-1">Del</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#D4AF37] transition-all relative">
                            <div className="aspect-square relative">
                                <img src={product.media?.mainImage || product.image_url || 'https://placehold.co/400'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => openEditModal(product)} className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Del</button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-white text-sm line-clamp-2 min-h-[40px]">{product.name || product.meta?.title}</h3>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-[#D4AF37] font-bold">{formatCurrency(product.pricing?.basePrice || product.price)}</span>
                                    <span className={`text-xs font-bold ${helperGetStockColor(helperGetStock(product))}`}>{helperGetStock(product)} in stock</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
                                <h2 className="text-xl font-black text-white uppercase">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                {/* Tabs */}
                                <div className="w-48 bg-[#111] border-r border-white/5 overflow-y-auto">
                                    <div className="p-4 space-y-2">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'text-white/40 hover:text-white'}`}
                                            >
                                                <span className="mr-2">{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#161616]">
                                    <form id="seller-product-form" onSubmit={handleSave} className="max-w-3xl mx-auto space-y-8">

                                        {/* 1. BASIC INFO */}
                                        {activeTab === 'basic' && (
                                            <div className="space-y-6 animate-fade-in">
                                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Basic Information</h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-bold text-white/40">Product Name</label>
                                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" placeholder="e.g. Ledger Nano X" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-bold text-white/40">Category</label>
                                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none">
                                                            {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Subcategory</label>
                                                    <select
                                                        value={formData.subcategory}
                                                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none"
                                                        disabled={!formData.category}
                                                    >
                                                        <option value="">Select Subcategory</option>
                                                        {formData.category && CATEGORY_DATA[formData.category]?.map(sub => (
                                                            <option key={sub} value={sub}>{sub}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Description</label>
                                                    <textarea required rows="5" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none resize-none"></textarea>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. MEDIA */}
                                        {activeTab === 'media' && (
                                            <div className="space-y-6 animate-fade-in">
                                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Product Images</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                    {formData.images.map((img, idx) => (
                                                        <div key={idx} className="aspect-square bg-black/50 border border-white/10 rounded-xl relative overflow-hidden group">
                                                            {img ? (
                                                                <>
                                                                    <img src={img} className="w-full h-full object-cover" />
                                                                    <button type="button" onClick={() => updateImage(idx, '')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                                                </>
                                                            ) : (
                                                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-white/5 transition-colors">
                                                                    <span className="text-2xl text-white/20">+</span>
                                                                    <span className="text-[8px] uppercase font-bold text-white/30 mt-2">{idx === 0 ? 'Main' : 'Gallery'}</span>
                                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, idx)} />
                                                                </label>
                                                            )}
                                                            {isLoading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-5 h-5 border-2 border-[#D4AF37] rounded-full animate-spin border-t-transparent"></div></div>}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t border-white/10">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Product Video (YouTube URL)</label>
                                                    <input type="url" value={formData.video} onChange={e => setFormData({ ...formData, video: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none mt-2" placeholder="https://youtube.com/..." />
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. SALES INFO */}
                                        {activeTab === 'sales' && (
                                            <div className="space-y-8 animate-fade-in">
                                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Sales & Variants</h3>
                                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <input type="checkbox" checked={formData.hasVariants} onChange={e => setFormData({ ...formData, hasVariants: e.target.checked })} className="w-5 h-5 accent-[#D4AF37]" />
                                                    <div>
                                                        <h4 className="font-bold text-white">Product has variations?</h4>
                                                        <p className="text-xs text-white/40">Enable this for sizes, colors, etc.</p>
                                                    </div>
                                                </div>

                                                {!formData.hasVariants ? (
                                                    <div className="grid md:grid-cols-4 gap-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] uppercase font-bold text-white/40">Price (THB)</label>
                                                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[#D4AF37] font-bold focus:border-[#D4AF37] outline-none" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] uppercase font-bold text-white/40">Compare Price (Old)</label>
                                                            <input type="number" value={formData.comparePrice} onChange={e => setFormData({ ...formData, comparePrice: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 focus:border-[#D4AF37] outline-none" placeholder="Original Price" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] uppercase font-bold text-white/40">Stock</label>
                                                            <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] uppercase font-bold text-white/40">SKU</label>
                                                            <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-6">
                                                        {formData.variantOptions.map((opt, idx) => (
                                                            <div key={idx} className="bg-black/30 border border-white/10 p-4 rounded-xl relative group">
                                                                <button type="button" onClick={() => handleRemoveVariantOption(idx)} className="absolute top-2 right-2 text-white/30 hover:text-red-500">×</button>
                                                                <div className="flex gap-4 mb-3">
                                                                    <input type="text" placeholder="Option Name (e.g. Color)" value={opt.name} onChange={(e) => handleOptionNameChange(idx, e.target.value)} className="bg-transparent border-b border-white/20 text-white text-sm focus:border-[#D4AF37] outline-none px-2 py-1 w-full" />
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {opt.values.map((val, vIdx) => (
                                                                        <span key={vIdx} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white flex items-center gap-2">
                                                                            {val} <button type="button" onClick={() => handleRemoveOptionValue(idx, vIdx)} className="text-white/50 hover:text-white">x</button>
                                                                        </span>
                                                                    ))}
                                                                    <input type="text" placeholder="+ Add Value & Enter" onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') { e.preventDefault(); handleAddOptionValue(idx, e.target.value); e.target.value = ''; }
                                                                    }} className="bg-transparent text-xs text-white placeholder:text-white/30 outline-none w-32" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {formData.variantOptions.length < 2 && (
                                                            <button type="button" onClick={handleAddVariantOption} className="text-xs text-[#D4AF37] font-bold uppercase hover:underline">+ Add Another Option</button>
                                                        )}

                                                        {/* Combinations Table */}
                                                        {formData.variantCombinations.length > 0 && (
                                                            <div className="overflow-x-auto border border-white/10 rounded-xl">
                                                                <table className="w-full text-sm text-left text-white">
                                                                    <thead className="bg-white/5 text-xs font-bold uppercase text-white/50">
                                                                        <tr>
                                                                            <th className="p-3 w-16">Img</th>
                                                                            <th className="p-3">Variant</th>
                                                                            <th className="p-3">Price</th>
                                                                            <th className="p-3">Old</th>
                                                                            <th className="p-3">Stock</th>
                                                                            <th className="p-3">SKU</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-white/5">
                                                                        {formData.variantCombinations.map((combo, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="p-3">
                                                                                    <div className="w-8 h-8 bg-white/10 rounded overflow-hidden cursor-pointer hover:border-[#D4AF37] border border-transparent relative group">
                                                                                        {combo.image ? <img src={combo.image} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-[8px]">+</span>}
                                                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleVariantImageUpload(e, idx)} />
                                                                                    </div>
                                                                                </td>
                                                                                <td className="p-3 font-bold">{combo.name}</td>
                                                                                <td className="p-3"><input type="number" value={combo.price} onChange={e => updateCombinationField(idx, 'price', e.target.value)} className="bg-black/50 border border-white/10 rounded px-2 py-1 w-24 text-[#D4AF37] font-bold text-xs" /></td>
                                                                                <td className="p-3"><input type="number" placeholder="Old" value={combo.comparePrice} onChange={e => updateCombinationField(idx, 'comparePrice', e.target.value)} className="bg-black/50 border border-white/10 rounded px-2 py-1 w-20 text-white/50 text-xs" /></td>
                                                                                <td className="p-3"><input type="number" value={combo.stock} onChange={e => updateCombinationField(idx, 'stock', e.target.value)} className="bg-black/50 border border-white/10 rounded px-2 py-1 w-20 text-white text-xs" /></td>
                                                                                <td className="p-3"><input type="text" value={combo.sku} onChange={e => updateCombinationField(idx, 'sku', e.target.value)} className="bg-black/50 border border-white/10 rounded px-2 py-1 w-28 text-white text-xs" /></td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 4. MARKETING & SPECS */}
                                        {activeTab === 'marketing' && (
                                            <div className="space-y-6 animate-fade-in">
                                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Marketing & Specs</h3>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Marketing Headline</label>
                                                    <input type="text" value={formData.marketing.headline} onChange={e => handleMarketingChange('headline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" placeholder="Short catchy phrase" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Subheadline</label>
                                                    <input type="text" value={formData.marketing.subheadline} onChange={e => handleMarketingChange('subheadline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" placeholder="Secondary text" />
                                                </div>

                                                {/* Benefits */}
                                                <div className="space-y-4 pt-4 border-t border-white/10">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-white">Benefits</h4>
                                                        <button type="button" onClick={handleAddBenefit} className="text-[#D4AF37] text-xs font-bold">+ Add Benefit</button>
                                                    </div>
                                                    {formData.marketing.benefits.map((benefit, idx) => (
                                                        <div key={idx} className="bg-black/30 border border-white/10 p-4 rounded-xl relative group space-y-2">
                                                            <button type="button" onClick={() => handleRemoveBenefit(idx)} className="absolute top-2 right-2 text-white/30 hover:text-red-500">×</button>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input placeholder="Title" value={benefit.title} onChange={e => handleBenefitChange(idx, 'title', e.target.value)} className="bg-black/50 rounded px-2 py-1 text-sm text-white border border-white/10" />
                                                                <input placeholder="Icon Name" value={benefit.icon} onChange={e => handleBenefitChange(idx, 'icon', e.target.value)} className="bg-black/50 rounded px-2 py-1 text-sm text-white border border-white/10" />
                                                            </div>
                                                            <textarea placeholder="Description" value={benefit.desc} onChange={e => handleBenefitChange(idx, 'desc', e.target.value)} rows="2" className="w-full bg-black/50 rounded px-2 py-1 text-sm text-white border border-white/10 resize-none" />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Tech Specs */}
                                                <div className="space-y-4 pt-4 border-t border-white/10">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-white">Tech Specs</h4>
                                                        <button type="button" onClick={handleAddTechSpec} className="text-[#D4AF37] text-xs font-bold">+ Add Spec</button>
                                                    </div>
                                                    {formData.techSpecs.map((spec, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center">
                                                            <input placeholder="Label" value={spec.label} onChange={e => handleTechSpecChange(idx, 'label', e.target.value)} className="w-1/3 bg-black/50 rounded px-2 py-1 text-sm text-white border border-white/10" />
                                                            <input placeholder="Value" value={spec.value} onChange={e => handleTechSpecChange(idx, 'value', e.target.value)} className="flex-1 bg-black/50 rounded px-2 py-1 text-sm text-white border border-white/10" />
                                                            <button type="button" onClick={() => handleRemoveTechSpec(idx)} className="text-white/30 hover:text-red-500">×</button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Manual Link */}
                                                <div className="pt-4 border-t border-white/10">
                                                    <label className="text-[10px] uppercase font-bold text-white/40">Manual Link</label>
                                                    <input type="text" value={formData.manualLink} onChange={e => setFormData({ ...formData, manualLink: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none mt-2" placeholder="/knowledge/..." />
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. ATTRIBUTES */}
                                        {activeTab === 'attributes' && (
                                            <div className="space-y-6 animate-fade-in">
                                                <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 mb-4">Attributes</h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-bold text-white/40">Brand</label>
                                                        <input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-bold text-white/40">Model</label>
                                                        <input type="text" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] uppercase font-bold text-white/40">Condition</label>
                                                        <select value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] outline-none">
                                                            <option>New</option><option>Used</option><option>Refurbished</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-8 border-t border-white/5 flex gap-4">
                                            <button type="submit" disabled={isLoading} className="flex-1 bg-[#D4AF37] text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-[#b89530] transition-transform active:scale-95 disabled:opacity-50">
                                                {isLoading ? 'Saving...' : 'Save Product'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SellerProductManager;
