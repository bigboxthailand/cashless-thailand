import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';

const ProductManager = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic'); // basic, media, sales, shipping, attributes

    // Initial Form State
    const initialFormState = {
        id: null,
        name: '',
        category: 'Hardware Wallet',
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

        subcategory: '', // New field

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
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

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

    // Variant Helper: Generate Combinations
    useEffect(() => {
        if (!formData.hasVariants || formData.variantOptions.length === 0) return;

        // Only regenerate if structure changes significantly, 
        // ideally we merge existing values to preserve typed price/stock
        // For simplicity in this demo, we might reset strings if options change:

        // Simple 1-Tier generation for now (Shopee usually 2 max: Color, Size)
        // If we want FULL combo generation:
        // cartesian product of option values
    }, [formData.variantOptions]);

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
        const shipping = product.shipping || {}; // Assuming stored in shipping column if exists, else inventory

        // Check for variants in config
        const hasVariants = !!(config.variants && config.variants.length > 0);
        let variantOptions = config.variantOptions || [];
        let variantCombinations = config.variants || [];

        // Backwards compatibility for flat variants list
        if (hasVariants && variantOptions.length === 0) {
            // Implicit 'Option'
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

            length: shipping.length || inventory.dimensions?.length || '',
            height: shipping.height || inventory.dimensions?.height || '',

            // Content
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
            // Generate slug for ID (only used for new products)
            const slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

            // Construct the payload matching the ACTUAL schema
            // Determine Base price logic
            let finalBasePrice = parseFloat(formData.price) || 0;
            if ((finalBasePrice === 0 || !formData.price) && formData.hasVariants && formData.variantCombinations.length > 0) {
                // Auto-pick the lowest price from variants as base price
                const prices = formData.variantCombinations.map(v => parseFloat(v.price) || 0).filter(p => p > 0);
                if (prices.length > 0) {
                    finalBasePrice = Math.min(...prices);
                }
            }

            const productPayload = {
                category: formData.category,

                // Meta holds the display title and description
                meta: {
                    title: formData.name,
                    description: formData.description,
                    brand: formData.brand,
                    model: formData.model,
                    condition: formData.condition,
                    // Preserve other meta fields if they existed but are not in form? 
                    // ideally we'd merge, but for now we write what we control.
                },

                // Config holds variants AND now Inventory (since invalid column removed)
                config: {
                    hasVariants: formData.hasVariants,
                    variantOptions: formData.hasVariants ? formData.variantOptions : [],
                    variants: formData.hasVariants ? formData.variantCombinations : [],
                    subcategory: formData.subcategory,
                    // Storing inventory here since 'inventory' column doesn't exist
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
                    // New Fields
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
                // Update existing
                const { data: updated, error: updateError } = await supabase
                    .from('products')
                    .update(productPayload)
                    .eq('id', formData.id)
                    .select()
                    .single();

                if (!updateError && updated) {
                    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
                }
                error = updateError;
            } else {
                // Insert new - we must specify the ID since it's not auto-generated UUID
                const newId = slug || `product-${Date.now()}`;

                const { data: inserted, error: insertError } = await supabase
                    .from('products')
                    .insert([{ ...productPayload, id: newId }])
                    .select()
                    .single();

                if (!insertError && inserted) {
                    setProducts(prev => [inserted, ...prev]);
                }
                error = insertError;
            }

            if (error) {
                console.error("Supabase Error:", error);
                throw error;
            }
            setIsModalOpen(false);

        } catch (err) {
            console.error('Error saving product:', err);
            alert('Failed to save product: ' + (err.message || JSON.stringify(err)));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddVariantOption = () => {
        setFormData(prev => ({
            ...prev,
            variantOptions: [...prev.variantOptions, { name: '', values: [] }]
        }));
    };

    const handleRemoveVariantOption = (index) => {
        const newOptions = [...formData.variantOptions];
        newOptions.splice(index, 1);
        setFormData(prev => ({
            ...prev,
            variantOptions: newOptions
        }));
        // Note: Needs logic to clear combinations if options removed
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
        // Generate Cartesian Product
        // Only supports 1 level for now for simplicity, or 2 levels max
        if (options.length === 0) {
            setFormData(prev => ({ ...prev, variantCombinations: [] }));
            return;
        }

        const firstOption = options[0];
        // If 2nd option exists
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

        // Ideally merge with existing to keep values, but for now reset:
        setFormData(prev => ({ ...prev, variantCombinations: combos }));
    };

    const updateCombinationField = (index, field, value) => {
        const newCombos = [...formData.variantCombinations];
        newCombos[index][field] = value;
        setFormData(prev => ({ ...prev, variantCombinations: newCombos }));
    };

    // Helper: Get Total Stock
    const helperGetStock = (product) => {
        if (product.config?.hasVariants && product.config?.variants?.length > 0) {
            return product.config.variants.reduce((a, b) => a + (parseInt(b.stock) || 0), 0);
        }
        return parseInt(product.config?.inventory?.stock || product.inventory?.stock || product.stock || 0);
    };

    // Helper: Get Stock Color Class
    const helperGetStockColor = (stock) => {
        if (stock === 0) return "text-red-500";
        if (stock < 10) return "text-yellow-500";
        return "text-green-500";
    };


    // --- Existing Utility Functions ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p => {
        const name = p.name || p.title || p.meta?.title || '';
        const category = p.config?.category || p.category || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const formatCurrency = (amount) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: '📝' },
        { id: 'media', label: 'Media', icon: '🖼️' },
        { id: 'sales', label: 'Sales Info', icon: '💰' },
        { id: 'marketing', label: 'Marketing & Specs', icon: '📢' },
        // { id: 'shipping', label: 'Shipping', icon: '🚚' },
        { id: 'attributes', label: 'Attributes', icon: '🏷️' },
    ];
    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

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
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });
                        resolve(resizedFile);
                    }, file.type, 0.7); // 0.7 quality
                };
            };
        });
    };

    const handleImageUpload = async (e, index) => {
        let file = e.target.files[0];
        if (!file) return;

        // Auto Resize if > 2MB
        if (file.size > 2 * 1024 * 1024) {
            try {
                // Show temporary loading state or toast if possible, but for now just process
                file = await resizeImage(file);
            } catch (err) {
                console.error("Resize error:", err);
                alert("Failed to resize image. Please upload a smaller file.");
                return;
            }
        }

        try {
            setIsLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            updateImage(index, publicUrl);

        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVariantImageUpload = async (e, comboIndex) => {
        let file = e.target.files[0];
        if (!file) return;

        // Auto Resize if > 2MB
        if (file.size > 2 * 1024 * 1024) {
            try {
                file = await resizeImage(file);
            } catch (err) {
                console.error("Resize error:", err);
                alert("Failed to resize image.");
                return;
            }
        }

        try {
            setIsLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            updateCombinationField(comboIndex, 'image', publicUrl);

        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-white/50 text-sm mt-1">{products.length} Products</div>
                <div className="flex w-full md:w-auto gap-3">
                    <div className="flex bg-black/10 backdrop-blur-md rounded border border-white/10 p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>
                    </div>
                    <input
                        type="text" placeholder="Search..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/10 backdrop-blur-md border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] w-full md:w-64"
                    />
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded text-sm hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add New
                    </button>
                </div>
            </div>

            {/* Product View: List vs Grid */}
            {viewMode === 'list' ? (
                /* List View */
                /* List View */
                <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden animate-in fade-in">
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
                                            <a href={`/products/${product.id}`} target="_blank" className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0 hover:border-[#D4AF37] transition-colors">
                                                <img
                                                    src={product.media?.mainImage || product.image_url || "https://placehold.co/100"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                            <div>
                                                <a href={`/products/${product.id}`} target="_blank" className="text-white font-bold text-base line-clamp-1 hover:text-[#D4AF37] transition-colors">
                                                    {product.name || product.title || product.meta?.title}
                                                </a>
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
                                            <a href={`/products/${product.id}`} target="_blank" className="text-[#D4AF37] hover:text-white px-2 py-1">View</a>
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
                /* Grid View */
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all group relative flex flex-col">
                            {/* Image */}
                            <div className="aspect-square bg-white/5 relative overflow-hidden">
                                <img
                                    src={product.media?.mainImage || product.image_url || "https://placehold.co/400"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a
                                        href={`/products/${product.id}`}
                                        target="_blank"
                                        className="bg-[#D4AF37] text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-colors"
                                    >
                                        View
                                    </a>
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#D4AF37] transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 transition-colors"
                                    >
                                        Del
                                    </button>
                                </div>
                                {/* Category Badge */}
                                <span className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] uppercase font-bold text-white/80 border border-white/10">
                                    {product.config?.category || product.category || "Uncat"}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="p-3 flex-1 flex flex-col">
                                <h3 className="text-white font-bold text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
                                    {product.name || product.title || product.meta?.title}
                                </h3>
                                <div className="mt-auto flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase font-bold mb-0.5">Price</div>
                                        <div className="text-[#D4AF37] font-bold text-sm">
                                            {formatCurrency(product.pricing?.basePrice || product.price || 0)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-white/40 uppercase font-bold mb-0.5">Stock</div>
                                        <div className={`text-xs font-bold ${helperGetStockColor(helperGetStock(product))}`}>
                                            {helperGetStock(product)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#111] border border-white/10 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col relative z-20 shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161616]">
                                <h2 className="text-lg font-bold text-white">
                                    {isEditing ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white">✕</button>
                            </div>

                            {/* Body */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-1/5 bg-[#0A0A0A] border-r border-white/5 overflow-y-auto">
                                    <div className="flex flex-col p-2 gap-1">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === tab.id
                                                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <span>{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-8 bg-[#111]">
                                    <form id="product-form" onSubmit={handleSave} className="space-y-8 max-w-4xl">

                                        {/* 1. BASIC INFO */}
                                        {activeTab === 'basic' && (
                                            <div className="space-y-6">
                                                <h3 className="section-title">Basic Information</h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="input-label">Product Name *</label>
                                                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" />
                                                    </div>
                                                    <div>
                                                        <label className="input-label">Category *</label>
                                                        <select
                                                            value={formData.category}
                                                            onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                                            className="input-field"
                                                        >
                                                            {Object.keys(CATEGORY_DATA).map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="input-label">Subcategory</label>
                                                        <select
                                                            value={formData.subcategory}
                                                            onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                                            className="input-field"
                                                            disabled={!formData.category}
                                                        >
                                                            <option value="">Select Subcategory</option>
                                                            {formData.category && CATEGORY_DATA[formData.category]?.map(sub => (
                                                                <option key={sub} value={sub}>{sub}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="input-label">Description</label>
                                                    <textarea rows="5" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none" />
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. MEDIA */}
                                        {activeTab === 'media' && (
                                            <div className="space-y-6">
                                                <h3 className="section-title">Product Media</h3>

                                                {/* Hidden File Inputs */}
                                                <div className="hidden">
                                                    <input type="file" id="cover-upload" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} />
                                                    {[1, 2, 3, 4].map(i => (
                                                        <input key={i} type="file" id={`gallery-upload-${i}`} accept="image/*" onChange={(e) => handleImageUpload(e, i)} />
                                                    ))}
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="w-1/3">
                                                        <label className="input-label">Cover Image</label>
                                                        <div
                                                            onClick={() => document.getElementById('cover-upload').click()}
                                                            className="aspect-square bg-white/5 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden mb-2 cursor-pointer hover:border-[#D4AF37] hover:bg-white/10 transition-colors group"
                                                        >
                                                            {formData.images[0] ? (
                                                                <img src={formData.images[0]} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <>
                                                                    <span className="text-2xl mb-1">📷</span>
                                                                    <span className="text-white/30 text-xs font-bold uppercase group-hover:text-white">Upload</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input type="url" placeholder="Or paste URL..." value={formData.images[0]} onChange={e => updateImage(0, e.target.value)} className="input-field text-xs" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="input-label">Gallery</label>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {[1, 2, 3, 4].map(i => (
                                                                <div key={i} className="relative">
                                                                    <div
                                                                        onClick={() => document.getElementById(`gallery-upload-${i}`).click()}
                                                                        className="aspect-video bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center overflow-hidden mb-1 cursor-pointer hover:border-[#D4AF37] hover:bg-white/10 group"
                                                                    >
                                                                        {formData.images[i] ? (
                                                                            <img src={formData.images[i]} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-white/30 text-xl group-hover:text-white">+</span>
                                                                        )}
                                                                    </div>
                                                                    <input type="url" placeholder="URL" value={formData.images[i] || ''} onChange={e => updateImage(i, e.target.value)} className="input-field text-xs py-1" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-white/10">
                                                    <label className="input-label">Product Video (YouTube URL)</label>
                                                    <input type="url" value={formData.video} onChange={e => setFormData({ ...formData, video: e.target.value })} className="input-field" placeholder="https://youtube.com/..." />
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. SALES INFO (Dual Mode) */}
                                        {activeTab === 'sales' && (
                                            <div className="space-y-6">
                                                <h3 className="section-title">Sales Information</h3>

                                                {/* Enable Variations Toggle */}
                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
                                                    <label className="text-sm font-bold text-white flex-1">Enable Variations?</label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, hasVariants: !formData.hasVariants })}
                                                        className={`w-12 h-6 rounded-full transition-colors relative ${formData.hasVariants ? 'bg-[#D4AF37]' : 'bg-white/20'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.hasVariants ? 'left-7' : 'left-1'}`} />
                                                    </button>
                                                </div>

                                                {!formData.hasVariants ? (
                                                    // SINGLE MODE
                                                    <div className="grid grid-cols-4 gap-6 animate-in fade-in">
                                                        <div><label className="input-label">Price</label><input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="input-field" /></div>
                                                        <div><label className="input-label">Compare Price (Old)</label><input type="number" value={formData.comparePrice} onChange={e => setFormData({ ...formData, comparePrice: e.target.value })} className="input-field" placeholder="Full Price" /></div>
                                                        <div><label className="input-label">Stock</label><input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="input-field" /></div>
                                                        <div><label className="input-label">SKU</label><input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="input-field" /></div>
                                                    </div>
                                                ) : (
                                                    // VARIANT MODE
                                                    <div className="space-y-6 animate-in fade-in">
                                                        {/* Tier 1: Variation Types */}
                                                        <div className="space-y-4">
                                                            {formData.variantOptions.map((opt, idx) => (
                                                                <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 relative group">
                                                                    <button type="button" onClick={() => handleRemoveVariantOption(idx)} className="absolute top-2 right-2 text-white/30 hover:text-red-500">×</button>
                                                                    <div className="mb-3">
                                                                        <label className="input-label">Variation Name (e.g. Color)</label>
                                                                        <input
                                                                            type="text" value={opt.name}
                                                                            onChange={e => handleOptionNameChange(idx, e.target.value)}
                                                                            className="input-field" placeholder="Color, Size, etc."
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="input-label">Options (Press Enter)</label>
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            {opt.values.map((val, vIdx) => (
                                                                                <span key={vIdx} className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded border border-[#D4AF37]/30 flex items-center gap-2">
                                                                                    {val}
                                                                                    <button type="button" onClick={() => handleRemoveOptionValue(idx, vIdx)} className="hover:text-white">×</button>
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                        <input
                                                                            type="text" placeholder="Add option..."
                                                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOptionValue(idx, e.target.value); e.target.value = ''; } }}
                                                                            className="input-field text-xs"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            {formData.variantOptions.length < 2 && (
                                                                <button type="button" onClick={handleAddVariantOption} className="w-full py-2 border border-dashed border-white/20 text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37] rounded-lg text-sm">
                                                                    + Add Variation Tier
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* Tier 2: Table */}
                                                        {formData.variantCombinations.length > 0 && (
                                                            <div className="overflow-x-auto border border-white/10 rounded-lg">
                                                                <table className="w-full text-left text-sm text-white/70">
                                                                    <thead className="bg-white/10 font-bold uppercase text-xs">
                                                                        <tr>
                                                                            <th className="p-3 w-16 text-center">Image</th>
                                                                            <th className="p-3">Variation</th>
                                                                            <th className="p-3 w-32">Price</th>
                                                                            <th className="p-3 w-32">Old Price</th>
                                                                            <th className="p-3 w-32">Stock</th>
                                                                            <th className="p-3 w-40">SKU</th>
                                                                            <th className="p-3 w-28">Weight</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-white/5">
                                                                        {formData.variantCombinations.map((combo, idx) => (
                                                                            <tr key={idx}>
                                                                                <td className="p-3">
                                                                                    <input
                                                                                        type="file"
                                                                                        id={`variant-upload-${idx}`}
                                                                                        className="hidden"
                                                                                        accept="image/*"
                                                                                        onChange={(e) => handleVariantImageUpload(e, idx)}
                                                                                    />
                                                                                    <div
                                                                                        onClick={() => document.getElementById(`variant-upload-${idx}`).click()}
                                                                                        className="w-10 h-10 bg-white/5 rounded border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#D4AF37] overflow-hidden relative group"
                                                                                    >
                                                                                        {combo.image ? (
                                                                                            <img src={combo.image} className="w-full h-full object-cover" />
                                                                                        ) : (
                                                                                            <span className="text-white/30 text-xs">+</span>
                                                                                        )}
                                                                                        {combo.image && (
                                                                                            <button
                                                                                                onClick={(e) => { e.stopPropagation(); updateCombinationField(idx, 'image', ''); }}
                                                                                                className="absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold"
                                                                                            >
                                                                                                DEL
                                                                                            </button>
                                                                                        )}
                                                                                    </div>
                                                                                </td>
                                                                                <td className="p-3 text-white">{combo.name}</td>
                                                                                <td className="p-3"><input type="number" value={combo.price} onChange={e => updateCombinationField(idx, 'price', e.target.value)} className="input-field py-1" /></td>
                                                                                <td className="p-3"><input type="number" placeholder="Old" value={combo.comparePrice} onChange={e => updateCombinationField(idx, 'comparePrice', e.target.value)} className="input-field py-1 text-[#D4AF37]" /></td>
                                                                                <td className="p-3"><input type="number" value={combo.stock} onChange={e => updateCombinationField(idx, 'stock', e.target.value)} className="input-field py-1" /></td>
                                                                                <td className="p-3"><input type="text" value={combo.sku} onChange={e => updateCombinationField(idx, 'sku', e.target.value)} className="input-field py-1" /></td>
                                                                                <td className="p-3"><input type="number" placeholder="kg" value={combo.weight} onChange={e => updateCombinationField(idx, 'weight', e.target.value)} className="input-field py-1" /></td>
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

                                        {/* MARKETING & SPECS */}
                                        {activeTab === 'marketing' && (
                                            <div className="space-y-8 animate-in fade-in">
                                                {/* Marketing Header */}
                                                <div className="space-y-4">
                                                    <h3 className="section-title">Marketing Copy</h3>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div>
                                                            <label className="input-label">Headline</label>
                                                            <input
                                                                value={formData.marketing?.headline || ''}
                                                                onChange={e => handleMarketingChange('headline', e.target.value)}
                                                                className="input-field"
                                                                placeholder="e.g. Why Basic?"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="input-label">Subheadline</label>
                                                            <input
                                                                value={formData.marketing?.subheadline || ''}
                                                                onChange={e => handleMarketingChange('subheadline', e.target.value)}
                                                                className="input-field"
                                                                placeholder="e.g. จุดเริ่มต้นของการเป็น Bitcoiner"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Benefits */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                        <h3 className="section-title mb-0 border-0 pb-0">Key Benefits</h3>
                                                        <button type="button" onClick={handleAddBenefit} className="text-[#D4AF37] text-xs font-bold hover:underline">+ Add Benefit</button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {(formData.marketing?.benefits || []).map((benefit, idx) => (
                                                            <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10 relative group">
                                                                <button type="button" onClick={() => handleRemoveBenefit(idx)} className="absolute top-2 right-2 text-white/30 hover:text-red-500">×</button>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="input-label">Title</label>
                                                                        <input
                                                                            value={benefit.title}
                                                                            onChange={e => handleBenefitChange(idx, 'title', e.target.value)}
                                                                            className="input-field"
                                                                            placeholder="e.g. Minimal Design"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="input-label">Icon (Phosphor/FontAwesome name)</label>
                                                                        <input
                                                                            value={benefit.icon}
                                                                            onChange={e => handleBenefitChange(idx, 'icon', e.target.value)}
                                                                            className="input-field"
                                                                            placeholder="e.g. gift, chart, shop"
                                                                        />
                                                                    </div>
                                                                    <div className="col-span-2">
                                                                        <label className="input-label">Description</label>
                                                                        <textarea
                                                                            rows="2"
                                                                            value={benefit.desc}
                                                                            onChange={e => handleBenefitChange(idx, 'desc', e.target.value)}
                                                                            className="input-field resize-none"
                                                                            placeholder="Benefit description..."
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {(formData.marketing?.benefits || []).length === 0 && (
                                                            <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
                                                                No benefits added.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Tech Specs */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                        <h3 className="section-title mb-0 border-0 pb-0">Tech Specs</h3>
                                                        <button type="button" onClick={handleAddTechSpec} className="text-[#D4AF37] text-xs font-bold hover:underline">+ Add Spec</button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {(formData.techSpecs || []).map((spec, idx) => (
                                                            <div key={idx} className="flex gap-2 items-start">
                                                                <div className="w-1/3">
                                                                    <input
                                                                        value={spec.label}
                                                                        onChange={e => handleTechSpecChange(idx, 'label', e.target.value)}
                                                                        className="input-field"
                                                                        placeholder="Label (e.g. CPU)"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <input
                                                                        value={spec.value}
                                                                        onChange={e => handleTechSpecChange(idx, 'value', e.target.value)}
                                                                        className="input-field"
                                                                        placeholder="Value (e.g. Dual-core...)"
                                                                    />
                                                                </div>
                                                                <button type="button" onClick={() => handleRemoveTechSpec(idx)} className="p-2 text-white/30 hover:text-red-500">×</button>
                                                            </div>
                                                        ))}
                                                        {(formData.techSpecs || []).length === 0 && (
                                                            <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg">
                                                                No specs added.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Manual Link */}
                                                <div className="space-y-4 pt-4 border-t border-white/10">
                                                    <h3 className="section-title">Documentation</h3>
                                                    <div>
                                                        <label className="input-label">Manual Link (Path)</label>
                                                        <input
                                                            value={formData.manualLink}
                                                            onChange={e => setFormData({ ...formData, manualLink: e.target.value })}
                                                            className="input-field"
                                                            placeholder="/knowledge/product-id"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. ATTRIBUTES */}
                                        {activeTab === 'attributes' && (
                                            <div className="space-y-6">
                                                <h3 className="section-title">Attributes</h3>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div><label className="input-label">Brand</label><input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="input-field" /></div>
                                                    <div><label className="input-label">Model</label><input value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} className="input-field" /></div>
                                                </div>
                                            </div>
                                        )}

                                    </form>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 bg-[#161616] flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-white/70 hover:text-white text-sm font-bold">Cancel</button>
                                <button onClick={(e) => document.getElementById('product-form').requestSubmit()} disabled={isLoading} className="px-8 py-2 bg-[#D4AF37] text-black rounded text-sm font-bold hover:bg-white">{isLoading ? 'Saving...' : 'Save & Publish'}</button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .section-title { font-size: 1.125rem; font-weight: 800; color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .input-label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 0.5rem; }
                .input-field { width: 100%; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; transition: all 0.2s; font-size: 0.875rem; }
                .input-field:focus { border-color: #D4AF37; outline: none; background-color: rgba(255, 255, 255, 0.08); }
            `}</style>
        </div>
    );
};

export default ProductManager;
