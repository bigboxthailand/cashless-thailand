import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Bu8JVBjn.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CY66lzGI.mjs';
import { s as supabase } from '../../chunks/supabase_BcyI2ayE.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export { renderers } from '../../renderers.mjs';

const ProductManager = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const initialFormState = {
    id: null,
    name: "",
    category: "Hardware Wallet",
    description: "",
    images: ["", "", "", "", ""],
    video: "",
    brand: "",
    model: "",
    condition: "New",
    // Sales - Single
    price: "",
    stock: "",
    sku: "",
    // Sales - Variants
    hasVariants: false,
    variantOptions: [],
    // [{ name: "Color", values: ["Red", "Blue"] }]
    variantCombinations: [],
    // [{ name: "Red", price: 100, stock: 10, sku: "..." }]
    // Shipping
    weight: "",
    width: "",
    length: "",
    height: "",
    subcategory: "",
    // New field
    // Marketing
    marketing: {
      headline: "",
      subheadline: "",
      benefits: []
      // { title, desc, icon }
    },
    // Tech Specs
    techSpecs: [],
    // { label, value }
    // Manual
    manualLink: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
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
  useEffect(() => {
    if (!formData.hasVariants || formData.variantOptions.length === 0) return;
  }, [formData.variantOptions]);
  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setActiveTab("basic");
    setIsModalOpen(true);
  };
  const openEditModal = (product) => {
    setIsEditing(true);
    setActiveTab("basic");
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
      variantOptions = [{ name: "Variation", values: variantCombinations.map((v) => v.name) }];
    }
    setFormData({
      id: product.id,
      name: product.name || product.title || meta.title || "",
      category: config.category || product.category || "Hardware Wallet",
      subcategory: config.subcategory || "",
      description: meta.description || "",
      images: [
        media.mainImage || product.image_url || "",
        ...media.gallery || ["", "", "", ""]
      ].slice(0, 5),
      video: media.video || "",
      brand: meta.brand || "",
      model: meta.model || "",
      condition: meta.condition || "New",
      // Single Sales
      price: pricing.basePrice || product.price || "",
      stock: inventory.stock || product.stock || "",
      sku: inventory.sku || "",
      // Variants
      hasVariants,
      variantOptions,
      variantCombinations,
      length: shipping.length || inventory.dimensions?.length || "",
      height: shipping.height || inventory.dimensions?.height || "",
      // Content
      marketing: config.marketing || { headline: "", subheadline: "", benefits: [] },
      techSpecs: config.techSpecs || [],
      manualLink: config.manualLink || ""
    });
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const slug = formData.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      let finalBasePrice = parseFloat(formData.price) || 0;
      if ((finalBasePrice === 0 || !formData.price) && formData.hasVariants && formData.variantCombinations.length > 0) {
        const prices = formData.variantCombinations.map((v) => parseFloat(v.price) || 0).filter((p) => p > 0);
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
          condition: formData.condition
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
          manualLink: formData.manualLink
        },
        media: {
          mainImage: formData.images[0] || "https://placehold.co/400",
          gallery: formData.images.slice(1).filter((url) => url),
          video: formData.video
        },
        pricing: {
          basePrice: finalBasePrice,
          currency: "THB"
        }
      };
      let error;
      if (isEditing) {
        const { data: updated, error: updateError } = await supabase.from("products").update(productPayload).eq("id", formData.id).select().single();
        if (!updateError && updated) {
          setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
        }
        error = updateError;
      } else {
        const newId = slug || `product-${Date.now()}`;
        const { data: inserted, error: insertError } = await supabase.from("products").insert([{ ...productPayload, id: newId }]).select().single();
        if (!insertError && inserted) {
          setProducts((prev) => [inserted, ...prev]);
        }
        error = insertError;
      }
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product: " + (err.message || JSON.stringify(err)));
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddVariantOption = () => {
    setFormData((prev) => ({
      ...prev,
      variantOptions: [...prev.variantOptions, { name: "", values: [] }]
    }));
  };
  const handleRemoveVariantOption = (index) => {
    const newOptions = [...formData.variantOptions];
    newOptions.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      variantOptions: newOptions
    }));
  };
  const handleOptionNameChange = (index, val) => {
    const newOptions = [...formData.variantOptions];
    newOptions[index].name = val;
    setFormData((prev) => ({ ...prev, variantOptions: newOptions }));
  };
  const handleAddOptionValue = (index, val) => {
    if (!val) return;
    const newOptions = [...formData.variantOptions];
    if (!newOptions[index].values.includes(val)) {
      newOptions[index].values.push(val);
      setFormData((prev) => ({ ...prev, variantOptions: newOptions }));
      updateCombinations(newOptions);
    }
  };
  const handleRemoveOptionValue = (optIndex, valIndex) => {
    const newOptions = [...formData.variantOptions];
    newOptions[optIndex].values.splice(valIndex, 1);
    setFormData((prev) => ({ ...prev, variantOptions: newOptions }));
    updateCombinations(newOptions);
  };
  const updateCombinations = (options) => {
    if (options.length === 0) {
      setFormData((prev) => ({ ...prev, variantCombinations: [] }));
      return;
    }
    const firstOption = options[0];
    const secondOption = options[1];
    let combos = [];
    if (secondOption && secondOption.values.length > 0) {
      firstOption.values.forEach((v1) => {
        secondOption.values.forEach((v2) => {
          combos.push({
            name: `${v1} - ${v2}`,
            price: formData.price || "",
            stock: formData.stock || "",
            sku: `${formData.sku}-${v1}-${v2}`.toUpperCase(),
            image: "",
            weight: formData.weight || ""
          });
        });
      });
    } else {
      firstOption.values.forEach((v1) => {
        combos.push({
          name: v1,
          price: formData.price || "",
          stock: formData.stock || "",
          sku: `${formData.sku}-${v1}`.toUpperCase(),
          image: "",
          weight: formData.weight || ""
        });
      });
    }
    setFormData((prev) => ({ ...prev, variantCombinations: combos }));
  };
  const updateCombinationField = (index, field, value) => {
    const newCombos = [...formData.variantCombinations];
    newCombos[index][field] = value;
    setFormData((prev) => ({ ...prev, variantCombinations: newCombos }));
  };
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
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };
  const filteredProducts = products.filter((p) => {
    const name = p.name || p.title || p.meta?.title || "";
    const category = p.config?.category || p.category || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || category.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const formatCurrency = (amount) => new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(amount);
  const tabs = [
    { id: "basic", label: "Basic Info", icon: "📝" },
    { id: "media", label: "Media", icon: "🖼️" },
    { id: "sales", label: "Sales Info", icon: "💰" },
    { id: "marketing", label: "Marketing & Specs", icon: "📢" },
    // { id: 'shipping', label: 'Shipping', icon: '🚚' },
    { id: "attributes", label: "Attributes", icon: "🏷️" }
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
              lastModified: Date.now()
            });
            resolve(resizedFile);
          }, file.type, 0.7);
        };
      };
    });
  };
  const handleImageUpload = async (e, index) => {
    let file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      try {
        file = await resizeImage(file);
      } catch (err) {
        console.error("Resize error:", err);
        alert("Failed to resize image. Please upload a smaller file.");
        return;
      }
    }
    try {
      setIsLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
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
      const fileExt = file.name.split(".").pop();
      const fileName = `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(filePath);
      updateCombinationField(comboIndex, "image", publicUrl);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleMarketingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      marketing: { ...prev.marketing, [field]: value }
    }));
  };
  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      marketing: {
        ...prev.marketing,
        benefits: [...prev.marketing.benefits || [], { title: "", desc: "", icon: "gift" }]
      }
    }));
  };
  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...formData.marketing.benefits || []];
    newBenefits[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      marketing: { ...prev.marketing, benefits: newBenefits }
    }));
  };
  const handleRemoveBenefit = (index) => {
    const newBenefits = [...formData.marketing.benefits || []];
    newBenefits.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      marketing: { ...prev.marketing, benefits: newBenefits }
    }));
  };
  const handleAddTechSpec = () => {
    setFormData((prev) => ({
      ...prev,
      techSpecs: [...prev.techSpecs || [], { label: "", value: "" }]
    }));
  };
  const handleTechSpecChange = (index, field, value) => {
    const newSpecs = [...formData.techSpecs || []];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, techSpecs: newSpecs }));
  };
  const handleRemoveTechSpec = (index) => {
    const newSpecs = [...formData.techSpecs || []];
    newSpecs.splice(index, 1);
    setFormData((prev) => ({ ...prev, techSpecs: newSpecs }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-white/50 text-sm mt-1", children: [
        products.length,
        " Products"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full md:w-auto gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex bg-black/10 backdrop-blur-md rounded border border-white/10 p-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("list"),
              className: `p-2 rounded ${viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`,
              children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
                /* @__PURE__ */ jsx("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
                /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
                /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "3.01", y2: "18" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setViewMode("grid"),
              className: `p-2 rounded ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white"}`,
              children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "7", height: "7" }),
                /* @__PURE__ */ jsx("rect", { x: "14", y: "3", width: "7", height: "7" }),
                /* @__PURE__ */ jsx("rect", { x: "14", y: "14", width: "7", height: "7" }),
                /* @__PURE__ */ jsx("rect", { x: "3", y: "14", width: "7", height: "7" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Search...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "bg-black/10 backdrop-blur-md border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] w-full md:w-64"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: openAddModal,
            className: "px-4 py-2 bg-[#D4AF37] text-black font-bold rounded text-sm hover:bg-white transition-colors flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx("span", { children: "+" }),
              " Add New"
            ]
          }
        )
      ] })
    ] }),
    viewMode === "list" ? (
      /* List View */
      /* List View */
      /* @__PURE__ */ jsx("div", { className: "bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden animate-in fade-in", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-white/70", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-white/5 text-white font-bold uppercase text-xs tracking-wider", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "p-4", children: "Product" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-center", children: "Category" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-center", children: "Stock" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-right", children: "Price" }),
          /* @__PURE__ */ jsx("th", { className: "p-4 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-white/5", children: filteredProducts.map((product) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/2 transition-colors", children: [
          /* @__PURE__ */ jsxs("td", { className: "p-4 flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: product.media?.mainImage || product.image_url || "https://placehold.co/100",
                alt: product.name,
                className: "w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-white font-bold text-base line-clamp-1", children: product.name || product.title || product.meta?.title }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-white/40 font-mono mt-1", children: [
                "ID: ",
                product.id.substring(0, 8)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded text-xs font-bold uppercase bg-white/5 text-white/70 border border-white/10", children: product.config?.category || product.category || "Uncategorized" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-center", children: /* @__PURE__ */ jsx("div", { className: `font-bold ${helperGetStockColor(helperGetStock(product))}`, children: helperGetStock(product) }) }),
          /* @__PURE__ */ jsx("td", { className: "p-4 text-right font-bold text-[#D4AF37]", children: formatCurrency(product.pricing?.basePrice || product.price || 0) }),
          /* @__PURE__ */ jsxs("td", { className: "p-4 text-right", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => openEditModal(product), className: "text-white/50 hover:text-white px-2 py-1", children: "Edit" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(product.id), className: "text-red-500/50 hover:text-red-500 px-2 py-1", children: "Del" })
          ] })
        ] }, product.id)) })
      ] }) }) })
    ) : (
      /* Grid View */
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in", children: filteredProducts.map((product) => /* @__PURE__ */ jsxs("div", { className: "bg-black/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all group relative flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-white/5 relative overflow-hidden", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: product.media?.mainImage || product.image_url || "https://placehold.co/400",
              alt: product.name,
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => openEditModal(product),
                className: "bg-white text-black px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#D4AF37] transition-colors",
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(product.id),
                className: "bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-600 transition-colors",
                children: "Del"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[10px] uppercase font-bold text-white/80 border border-white/10", children: product.config?.category || product.category || "Uncat" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-3 flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-white font-bold text-sm line-clamp-2 mb-1 min-h-[2.5rem]", children: product.name || product.title || product.meta?.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto flex justify-between items-end", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-white/40 uppercase font-bold mb-0.5", children: "Price" }),
              /* @__PURE__ */ jsx("div", { className: "text-[#D4AF37] font-bold text-sm", children: formatCurrency(product.pricing?.basePrice || product.price || 0) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-white/40 uppercase font-bold mb-0.5", children: "Stock" }),
              /* @__PURE__ */ jsx("div", { className: `text-xs font-bold ${helperGetStockColor(helperGetStock(product))}`, children: helperGetStock(product) })
            ] })
          ] })
        ] })
      ] }, product.id)) })
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isModalOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setIsModalOpen(false),
          className: "fixed inset-0 bg-black/80 backdrop-blur-sm"
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { scale: 0.95, opacity: 0, y: 20 },
          animate: { scale: 1, opacity: 1, y: 0 },
          exit: { scale: 0.95, opacity: 0, y: 20 },
          className: "bg-[#111] border border-white/10 rounded-xl w-full max-w-5xl h-[90vh] flex flex-col relative z-20 shadow-2xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-white/10 flex justify-between items-center bg-[#161616]", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: isEditing ? "Edit Product" : "Add New Product" }),
              /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), className: "text-white/50 hover:text-white", children: "✕" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "w-1/5 bg-[#0A0A0A] border-r border-white/5 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col p-2 gap-1", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveTab(tab.id),
                  className: `text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${activeTab === tab.id ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { children: tab.icon }),
                    tab.label
                  ]
                },
                tab.id
              )) }) }),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-8 bg-[#111]", children: /* @__PURE__ */ jsxs("form", { id: "product-form", onSubmit: handleSave, className: "space-y-8 max-w-4xl", children: [
                activeTab === "basic" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Basic Information" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Product Name *" }),
                      /* @__PURE__ */ jsx("input", { required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "input-field" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Category *" }),
                      /* @__PURE__ */ jsx(
                        "select",
                        {
                          value: formData.category,
                          onChange: (e) => setFormData({ ...formData, category: e.target.value, subcategory: "" }),
                          className: "input-field",
                          children: Object.keys(CATEGORY_DATA).map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Subcategory" }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          value: formData.subcategory,
                          onChange: (e) => setFormData({ ...formData, subcategory: e.target.value }),
                          className: "input-field",
                          disabled: !formData.category,
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "Select Subcategory" }),
                            formData.category && CATEGORY_DATA[formData.category]?.map((sub) => /* @__PURE__ */ jsx("option", { value: sub, children: sub }, sub))
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "input-label", children: "Description" }),
                    /* @__PURE__ */ jsx("textarea", { rows: "5", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), className: "input-field resize-none" })
                  ] })
                ] }),
                activeTab === "media" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Product Media" }),
                  /* @__PURE__ */ jsxs("div", { className: "hidden", children: [
                    /* @__PURE__ */ jsx("input", { type: "file", id: "cover-upload", accept: "image/*", onChange: (e) => handleImageUpload(e, 0) }),
                    [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("input", { type: "file", id: `gallery-upload-${i}`, accept: "image/*", onChange: (e) => handleImageUpload(e, i) }, i))
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "w-1/3", children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Cover Image" }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          onClick: () => document.getElementById("cover-upload").click(),
                          className: "aspect-square bg-white/5 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden mb-2 cursor-pointer hover:border-[#D4AF37] hover:bg-white/10 transition-colors group",
                          children: formData.images[0] ? /* @__PURE__ */ jsx("img", { src: formData.images[0], className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("span", { className: "text-2xl mb-1", children: "📷" }),
                            /* @__PURE__ */ jsx("span", { className: "text-white/30 text-xs font-bold uppercase group-hover:text-white", children: "Upload" })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsx("input", { type: "url", placeholder: "Or paste URL...", value: formData.images[0], onChange: (e) => updateImage(0, e.target.value), className: "input-field text-xs" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Gallery" }),
                      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            onClick: () => document.getElementById(`gallery-upload-${i}`).click(),
                            className: "aspect-video bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center overflow-hidden mb-1 cursor-pointer hover:border-[#D4AF37] hover:bg-white/10 group",
                            children: formData.images[i] ? /* @__PURE__ */ jsx("img", { src: formData.images[i], className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "text-white/30 text-xl group-hover:text-white", children: "+" })
                          }
                        ),
                        /* @__PURE__ */ jsx("input", { type: "url", placeholder: "URL", value: formData.images[i] || "", onChange: (e) => updateImage(i, e.target.value), className: "input-field text-xs py-1" })
                      ] }, i)) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-white/10", children: [
                    /* @__PURE__ */ jsx("label", { className: "input-label", children: "Product Video (YouTube URL)" }),
                    /* @__PURE__ */ jsx("input", { type: "url", value: formData.video, onChange: (e) => setFormData({ ...formData, video: e.target.value }), className: "input-field", placeholder: "https://youtube.com/..." })
                  ] })
                ] }),
                activeTab === "sales" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Sales Information" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/10 mb-6", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-sm font-bold text-white flex-1", children: "Enable Variations?" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFormData({ ...formData, hasVariants: !formData.hasVariants }),
                        className: `w-12 h-6 rounded-full transition-colors relative ${formData.hasVariants ? "bg-[#D4AF37]" : "bg-white/20"}`,
                        children: /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${formData.hasVariants ? "left-7" : "left-1"}` })
                      }
                    )
                  ] }),
                  !formData.hasVariants ? (
                    // SINGLE MODE
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-6 animate-in fade-in", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "input-label", children: "Price" }),
                        /* @__PURE__ */ jsx("input", { type: "number", value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }), className: "input-field" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "input-label", children: "Stock" }),
                        /* @__PURE__ */ jsx("input", { type: "number", value: formData.stock, onChange: (e) => setFormData({ ...formData, stock: e.target.value }), className: "input-field" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "input-label", children: "SKU" }),
                        /* @__PURE__ */ jsx("input", { type: "text", value: formData.sku, onChange: (e) => setFormData({ ...formData, sku: e.target.value }), className: "input-field" })
                      ] })
                    ] })
                  ) : (
                    // VARIANT MODE
                    /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in fade-in", children: [
                      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                        formData.variantOptions.map((opt, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-4 rounded-lg border border-white/10 relative group", children: [
                          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemoveVariantOption(idx), className: "absolute top-2 right-2 text-white/30 hover:text-red-500", children: "×" }),
                          /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
                            /* @__PURE__ */ jsx("label", { className: "input-label", children: "Variation Name (e.g. Color)" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                value: opt.name,
                                onChange: (e) => handleOptionNameChange(idx, e.target.value),
                                className: "input-field",
                                placeholder: "Color, Size, etc."
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("label", { className: "input-label", children: "Options (Press Enter)" }),
                            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: opt.values.map((val, vIdx) => /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded border border-[#D4AF37]/30 flex items-center gap-2", children: [
                              val,
                              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemoveOptionValue(idx, vIdx), className: "hover:text-white", children: "×" })
                            ] }, vIdx)) }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "text",
                                placeholder: "Add option...",
                                onKeyDown: (e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddOptionValue(idx, e.target.value);
                                    e.target.value = "";
                                  }
                                },
                                className: "input-field text-xs"
                              }
                            )
                          ] })
                        ] }, idx)),
                        formData.variantOptions.length < 2 && /* @__PURE__ */ jsx("button", { type: "button", onClick: handleAddVariantOption, className: "w-full py-2 border border-dashed border-white/20 text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37] rounded-lg text-sm", children: "+ Add Variation Tier" })
                      ] }),
                      formData.variantCombinations.length > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border border-white/10 rounded-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm text-white/70", children: [
                        /* @__PURE__ */ jsx("thead", { className: "bg-white/10 font-bold uppercase text-xs", children: /* @__PURE__ */ jsxs("tr", { children: [
                          /* @__PURE__ */ jsx("th", { className: "p-3 w-16 text-center", children: "Image" }),
                          /* @__PURE__ */ jsx("th", { className: "p-3", children: "Variation" }),
                          /* @__PURE__ */ jsx("th", { className: "p-3 w-40", children: "Price" }),
                          /* @__PURE__ */ jsx("th", { className: "p-3 w-32", children: "Stock" }),
                          /* @__PURE__ */ jsx("th", { className: "p-3 w-40", children: "SKU" }),
                          /* @__PURE__ */ jsx("th", { className: "p-3 w-28", children: "Weight" })
                        ] }) }),
                        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-white/5", children: formData.variantCombinations.map((combo, idx) => /* @__PURE__ */ jsxs("tr", { children: [
                          /* @__PURE__ */ jsxs("td", { className: "p-3", children: [
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "file",
                                id: `variant-upload-${idx}`,
                                className: "hidden",
                                accept: "image/*",
                                onChange: (e) => handleVariantImageUpload(e, idx)
                              }
                            ),
                            /* @__PURE__ */ jsxs(
                              "div",
                              {
                                onClick: () => document.getElementById(`variant-upload-${idx}`).click(),
                                className: "w-10 h-10 bg-white/5 rounded border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#D4AF37] overflow-hidden relative group",
                                children: [
                                  combo.image ? /* @__PURE__ */ jsx("img", { src: combo.image, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "text-white/30 text-xs", children: "+" }),
                                  combo.image && /* @__PURE__ */ jsx(
                                    "button",
                                    {
                                      onClick: (e) => {
                                        e.stopPropagation();
                                        updateCombinationField(idx, "image", "");
                                      },
                                      className: "absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold",
                                      children: "DEL"
                                    }
                                  )
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsx("td", { className: "p-3 text-white", children: combo.name }),
                          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx("input", { type: "number", value: combo.price, onChange: (e) => updateCombinationField(idx, "price", e.target.value), className: "input-field py-1" }) }),
                          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx("input", { type: "number", value: combo.stock, onChange: (e) => updateCombinationField(idx, "stock", e.target.value), className: "input-field py-1" }) }),
                          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx("input", { type: "text", value: combo.sku, onChange: (e) => updateCombinationField(idx, "sku", e.target.value), className: "input-field py-1" }) }),
                          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx("input", { type: "number", placeholder: "kg", value: combo.weight, onChange: (e) => updateCombinationField(idx, "weight", e.target.value), className: "input-field py-1" }) })
                        ] }, idx)) })
                      ] }) })
                    ] })
                  )
                ] }),
                activeTab === "marketing" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Marketing Copy" }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "input-label", children: "Headline" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            value: formData.marketing?.headline || "",
                            onChange: (e) => handleMarketingChange("headline", e.target.value),
                            className: "input-field",
                            placeholder: "e.g. Why Basic?"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "input-label", children: "Subheadline" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            value: formData.marketing?.subheadline || "",
                            onChange: (e) => handleMarketingChange("subheadline", e.target.value),
                            className: "input-field",
                            placeholder: "e.g. จุดเริ่มต้นของการเป็น Bitcoiner"
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-2", children: [
                      /* @__PURE__ */ jsx("h3", { className: "section-title mb-0 border-0 pb-0", children: "Key Benefits" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: handleAddBenefit, className: "text-[#D4AF37] text-xs font-bold hover:underline", children: "+ Add Benefit" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      (formData.marketing?.benefits || []).map((benefit, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-4 rounded-lg border border-white/10 relative group", children: [
                        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemoveBenefit(idx), className: "absolute top-2 right-2 text-white/30 hover:text-red-500", children: "×" }),
                        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("label", { className: "input-label", children: "Title" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                value: benefit.title,
                                onChange: (e) => handleBenefitChange(idx, "title", e.target.value),
                                className: "input-field",
                                placeholder: "e.g. Minimal Design"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("label", { className: "input-label", children: "Icon (Phosphor/FontAwesome name)" }),
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                value: benefit.icon,
                                onChange: (e) => handleBenefitChange(idx, "icon", e.target.value),
                                className: "input-field",
                                placeholder: "e.g. gift, chart, shop"
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                            /* @__PURE__ */ jsx("label", { className: "input-label", children: "Description" }),
                            /* @__PURE__ */ jsx(
                              "textarea",
                              {
                                rows: "2",
                                value: benefit.desc,
                                onChange: (e) => handleBenefitChange(idx, "desc", e.target.value),
                                className: "input-field resize-none",
                                placeholder: "Benefit description..."
                              }
                            )
                          ] })
                        ] })
                      ] }, idx)),
                      (formData.marketing?.benefits || []).length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg", children: "No benefits added." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-white/10 pb-2", children: [
                      /* @__PURE__ */ jsx("h3", { className: "section-title mb-0 border-0 pb-0", children: "Tech Specs" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: handleAddTechSpec, className: "text-[#D4AF37] text-xs font-bold hover:underline", children: "+ Add Spec" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      (formData.techSpecs || []).map((spec, idx) => /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-start", children: [
                        /* @__PURE__ */ jsx("div", { className: "w-1/3", children: /* @__PURE__ */ jsx(
                          "input",
                          {
                            value: spec.label,
                            onChange: (e) => handleTechSpecChange(idx, "label", e.target.value),
                            className: "input-field",
                            placeholder: "Label (e.g. CPU)"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                          "input",
                          {
                            value: spec.value,
                            onChange: (e) => handleTechSpecChange(idx, "value", e.target.value),
                            className: "input-field",
                            placeholder: "Value (e.g. Dual-core...)"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemoveTechSpec(idx), className: "p-2 text-white/30 hover:text-red-500", children: "×" })
                      ] }, idx)),
                      (formData.techSpecs || []).length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-lg", children: "No specs added." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-white/10", children: [
                    /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Documentation" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Manual Link (Path)" }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          value: formData.manualLink,
                          onChange: (e) => setFormData({ ...formData, manualLink: e.target.value }),
                          className: "input-field",
                          placeholder: "/knowledge/product-id"
                        }
                      )
                    ] })
                  ] })
                ] }),
                activeTab === "attributes" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "section-title", children: "Attributes" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Brand" }),
                      /* @__PURE__ */ jsx("input", { value: formData.brand, onChange: (e) => setFormData({ ...formData, brand: e.target.value }), className: "input-field" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "input-label", children: "Model" }),
                      /* @__PURE__ */ jsx("input", { value: formData.model, onChange: (e) => setFormData({ ...formData, model: e.target.value }), className: "input-field" })
                    ] })
                  ] })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 border-t border-white/10 bg-[#161616] flex justify-end gap-3 shrink-0", children: [
              /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "px-6 py-2 text-white/70 hover:text-white text-sm font-bold", children: "Cancel" }),
              /* @__PURE__ */ jsx("button", { onClick: (e) => document.getElementById("product-form").requestSubmit(), disabled: isLoading, className: "px-8 py-2 bg-[#D4AF37] text-black rounded text-sm font-bold hover:bg-white", children: isLoading ? "Saving..." : "Save & Publish" })
            ] })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
                .section-title { font-size: 1.125rem; font-weight: 800; color: white; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .input-label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); margin-bottom: 0.5rem; }
                .input-field { width: 100%; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 0.625rem 0.875rem; color: white; transition: all 0.2s; font-size: 0.875rem; }
                .input-field:focus { border-color: #D4AF37; outline: none; background-color: rgba(255, 255, 255, 0.08); }
            ` })
  ] });
};

const $$Products = createComponent(async ($$result, $$props, $$slots) => {
  const { data: products, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Products" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div class="flex justify-between items-center"> <div> <h1 class="text-3xl font-black text-white uppercase tracking-wider">
Products Inventory
</h1>   </div>  </div> ${renderComponent($$result2, "ProductManager", ProductManager, { "client:load": true, "initialProducts": products, "client:component-hydration": "load", "client:component-path": "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/components/admin/ProductManager.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/products.astro", void 0);

const $$file = "/Users/natthapongsuwanjit/Desktop/CashlessThailand/cashlessthailand/src/pages/admin/products.astro";
const $$url = "/admin/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Products,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
