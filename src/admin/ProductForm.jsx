import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logAction } from '../lib/audit';
import { clearStorefrontCache } from '../lib/storefrontData';
import { formatBDT } from '../utils/currency';
import {
  ArrowLeft,
  Save,
  Package,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function ProductForm() {
  // Extract product ID from URL hash if editing: #/admin/products/edit?id=xyz
  const hash = window.location.hash;
  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
  const editId = urlParams.get('id');
  const isEditMode = Boolean(editId);

  // Categories & Brands list options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form Fields State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugUserModified, setIsSlugUserModified] = useState(false);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [badge, setBadge] = useState('');
  const [status, setStatus] = useState('active');

  // Sizes Editor
  const [sizes, setSizes] = useState([
    { label: '6ml', price: '' },
    { label: '12ml', price: '' }
  ]);

  // Image URLs (up to 4) & error tracking
  const [images, setImages] = useState(['', '', '', '']);
  const [imageErrors, setImageErrors] = useState({});

  // Form Submission & Messages
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDropdownsAndProductData();
  }, [editId]);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugUserModified) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugUserModified(true);
  };

  const fetchDropdownsAndProductData = async () => {
    setLoadingInitial(true);
    setErrorMessage('');
    try {
      // 1. Fetch Categories
      const catSnap = await getDocs(collection(db, 'categories'));
      const cats = [];
      catSnap.forEach((docSnap) => cats.push({ id: docSnap.id, ...docSnap.data() }));
      setCategories(cats);

      // 2. Fetch Brands
      const brandSnap = await getDocs(collection(db, 'brands'));
      const brs = [];
      brandSnap.forEach((docSnap) => brs.push({ id: docSnap.id, ...docSnap.data() }));
      setBrands(brs);

      // 3. If Edit Mode, fetch existing product
      if (isEditMode && editId) {
        const prodDocRef = doc(db, 'products', editId);
        const prodSnap = await getDoc(prodDocRef);

        if (prodSnap.exists()) {
          const data = prodSnap.data();
          setName(data.name || data.title || '');
          setSlug(data.slug || slugify(data.name || data.title || ''));
          setIsSlugUserModified(true);
          setDescription(data.description || '');
          setCategoryId(data.categoryId || '');
          setBrandId(data.brandId || '');
          setPrice(data.price !== undefined ? String(data.price) : '');
          setOldPrice(data.oldPrice !== undefined && data.oldPrice !== null ? String(data.oldPrice) : '');
          setStock(data.stock !== undefined ? String(data.stock) : '10');
          setLowStockThreshold(data.lowStockThreshold !== undefined ? String(data.lowStockThreshold) : '5');
          setBadge(data.badge || '');
          setStatus(data.status || 'active');

          // Sizes
          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            setSizes(
              data.sizes.map((s) =>
                typeof s === 'string'
                  ? { label: s, price: String(data.price || '') }
                  : { label: s.label || '12ml', price: s.price !== undefined ? String(s.price) : '' }
              )
            );
          }

          // Images
          const existingImgs = Array.isArray(data.images)
            ? data.images
            : data.image
            ? [data.image]
            : [];
          const paddedImgs = ['', '', '', ''];
          existingImgs.slice(0, 4).forEach((img, idx) => {
            paddedImgs[idx] = img;
          });
          setImages(paddedImgs);
        } else {
          setErrorMessage(`Product with ID "${editId}" was not found.`);
        }
      }
    } catch (err) {
      console.error('Error fetching initial product form data:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied loading product or dropdown options.');
      } else {
        setErrorMessage(`Error loading form data: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setLoadingInitial(false);
    }
  };

  // Image change handler
  const handleImageChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
    // Reset error state for modified image
    setImageErrors((prev) => ({ ...prev, [index]: false }));
  };

  // Size row handlers
  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  const handleAddSizeRow = () => {
    setSizes((prev) => [...prev, { label: '', price: price || '' }]);
  };

  const handleRemoveSizeRow = (index) => {
    setSizes((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!slug.trim()) newErrors.slug = 'Product slug is required';

    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }

    const numStock = Number(stock);
    if (stock === '' || isNaN(numStock) || numStock < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    const numLowStock = Number(lowStockThreshold);
    if (lowStockThreshold === '' || isNaN(numLowStock) || numLowStock < 0) {
      newErrors.lowStockThreshold = 'Low stock threshold must be a non-negative number';
    }

    const validImages = images.filter((img) => img && img.trim().length > 0);
    if (validImages.length === 0) {
      newErrors.images = 'At least 1 valid image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setErrorMessage('Please fix all form validation errors before saving.');
      return;
    }

    setIsSaving(true);

    try {
      // Find Category & Brand Name
      const selectedCatObj = categories.find((c) => c.id === categoryId);
      const categoryName = selectedCatObj ? selectedCatObj.name : 'Attar';

      const selectedBrandObj = brands.find((b) => b.id === brandId);
      const brandName = selectedBrandObj ? selectedBrandObj.name : 'Extrovat Signature';

      // Clean images array
      const cleanedImages = images.filter((img) => img && img.trim().length > 0);

      // Clean sizes array
      const cleanedSizes = sizes
        .filter((s) => s.label && s.label.trim().length > 0)
        .map((s) => ({
          label: s.label.trim(),
          price: s.price && !isNaN(Number(s.price)) ? Number(s.price) : Number(price)
        }));

      const productPayload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        categoryId: categoryId || '',
        categoryName,
        brandId: brandId || '',
        brandName,
        price: Number(price),
        oldPrice: oldPrice && !isNaN(Number(oldPrice)) ? Number(oldPrice) : null,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        sizes: cleanedSizes.length > 0 ? cleanedSizes : [{ label: '12ml', price: Number(price) }],
        badge: badge.trim(),
        status,
        images: cleanedImages,
        updatedAt: serverTimestamp()
      };

      if (isEditMode && editId) {
        // Update product
        await updateDoc(doc(db, 'products', editId), productPayload);
        await logAction('UPDATE_PRODUCT', editId, { name: name.trim() });
        setSuccessMessage(`Product "${name}" updated successfully! Redirecting...`);
      } else {
        // Create product
        const newDocRef = await addDoc(collection(db, 'products'), {
          ...productPayload,
          createdAt: serverTimestamp()
        });
        await logAction('CREATE_PRODUCT', newDocRef.id, { name: name.trim() });
        setSuccessMessage(`Product "${name}" created successfully! Redirecting...`);
      }

      clearStorefrontCache();

      // Redirect after 1 second
      setTimeout(() => {
        window.location.hash = '#/admin/products';
      }, 1000);
    } catch (err) {
      console.error('Error saving product:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied: Firestore security rules blocked product save.');
      } else {
        setErrorMessage(`Failed to save product: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-12 text-center space-y-3 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px]">
        <div className="w-8 h-8 border-4 border-[#2436F5] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-heading font-bold text-[#5B6079]">
          Loading product configuration form...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330]">
        <div className="flex items-center gap-3">
          <a
            href="#/admin/products"
            className="p-2 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl transition-colors cursor-pointer"
            title="Back to All Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-xl font-heading font-extrabold uppercase text-[#0E1330]">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-xs font-sans text-[#5B6079]">
              {isEditMode
                ? 'Update pricing, images, stock inventory, and product properties.'
                : 'Fill details below to add a new fragrance to Extrovat store.'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border-2 border-[#0E1330] rounded-2xl flex items-center justify-between text-xs font-bold text-red-700 shadow-[2px_2px_0px_#0E1330]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="p-1 hover:bg-red-100 rounded-lg text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-green-50 border-2 border-[#0E1330] rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800 shadow-[2px_2px_0px_#0E1330]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Details */}
        <div className="bg-[#FFFFFF] p-6 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] space-y-4">
          <h2 className="text-sm font-heading font-extrabold uppercase text-[#0E1330] border-b-2 border-[#0E1330] pb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#2436F5]" /> General Information
          </h2>

          {/* Product Name */}
          <div className="space-y-1">
            <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Extrovat Royal White Musk Signature Attar"
              className={`w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] ${
                errors.name ? 'border-red-500' : 'border-[#0E1330]'
              }`}
            />
            {errors.name && <p className="text-[11px] font-bold text-red-600">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g. extrovat-royal-white-musk-attar"
              className={`w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 rounded-xl text-xs font-mono text-[#0E1330] focus:outline-none focus:border-[#2436F5] ${
                errors.slug ? 'border-red-500' : 'border-[#0E1330]'
              }`}
            />
            {errors.slug && <p className="text-[11px] font-bold text-red-600">{errors.slug}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe scent notes, bottle details, and key features..."
              className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-sans text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
            />
          </div>

          {/* Category & Brand Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] cursor-pointer"
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Brand
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] cursor-pointer"
              >
                <option value="">Select Brand...</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-[#FFFFFF] p-6 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] space-y-4">
          <h2 className="text-sm font-heading font-extrabold uppercase text-[#0E1330] border-b-2 border-[#0E1330] pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFC933]" /> Pricing & Stock Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Regular Price */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1350"
                className={`w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] ${
                  errors.price ? 'border-red-500' : 'border-[#0E1330]'
                }`}
              />
              {errors.price && <p className="text-[11px] font-bold text-red-600">{errors.price}</p>}
            </div>

            {/* Old Price */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Old Price (৳) <span className="text-[#5B6079] font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="e.g. 1650"
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
              />
            </div>

            {/* Current Stock */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 10"
                className={`w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] ${
                  errors.stock ? 'border-red-500' : 'border-[#0E1330]'
                }`}
              />
              {errors.stock && <p className="text-[11px] font-bold text-red-600">{errors.stock}</p>}
            </div>

            {/* Low Stock Threshold */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Low Stock Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                placeholder="e.g. 5"
                className={`w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5] ${
                  errors.lowStockThreshold ? 'border-red-500' : 'border-[#0E1330]'
                }`}
              />
              {errors.lowStockThreshold && (
                <p className="text-[11px] font-bold text-red-600">{errors.lowStockThreshold}</p>
              )}
            </div>
          </div>

          {/* Badge & Status Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Badge */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Promotional Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller, ৳300 Off, Limited Edition"
                className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
              />
            </div>

            {/* Status Radio Toggle */}
            <div className="space-y-1">
              <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                Publish Status
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 font-heading font-bold text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="w-4 h-4 text-[#2436F5] focus:ring-0"
                  />
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-600 uppercase text-[10px] font-black">
                    Active
                  </span>
                </label>

                <label className="flex items-center gap-2 font-heading font-bold text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={() => setStatus('draft')}
                    className="w-4 h-4 text-[#2436F5] focus:ring-0"
                  />
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-400 uppercase text-[10px] font-black">
                    Draft
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Sizes Editor */}
        <div className="bg-[#FFFFFF] p-6 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#0E1330] pb-2">
            <h2 className="text-sm font-heading font-extrabold uppercase text-[#0E1330] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2436F5]" /> Available Product Sizes & Options
            </h2>
            <button
              type="button"
              onClick={handleAddSizeRow}
              className="px-3 py-1.5 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl font-heading font-extrabold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Size Row
            </button>
          </div>

          <div className="space-y-2">
            {sizes.map((sizeRow, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={sizeRow.label}
                  onChange={(e) => handleSizeChange(idx, 'label', e.target.value)}
                  placeholder="Size (e.g. 6ml, 12ml, 50ml)"
                  className="flex-1 px-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                />
                <input
                  type="number"
                  min="0"
                  value={sizeRow.price}
                  onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                  placeholder={`Price in ৳ (default ${price || 0})`}
                  className="flex-1 px-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                />
                {sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSizeRow(idx)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-[#0E1330] rounded-xl cursor-pointer"
                    title="Remove size option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Image URLs with Live Previews & Failure Handling */}
        <div className="bg-[#FFFFFF] p-6 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] space-y-4">
          <h2 className="text-sm font-heading font-extrabold uppercase text-[#0E1330] border-b-2 border-[#0E1330] pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#2436F5]" /> Product Images (Up to 4 URLs)
          </h2>

          {errors.images && <p className="text-xs font-bold text-red-600">{errors.images}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((imgUrl, idx) => {
              const hasUrl = Boolean(imgUrl && imgUrl.trim().length > 0);
              const hasError = imageErrors[idx];

              return (
                <div
                  key={idx}
                  className="p-3 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-2xl space-y-2"
                >
                  <label className="block text-[11px] font-heading font-extrabold uppercase text-[#0E1330]">
                    Image #{idx + 1} {idx === 0 && <span className="text-[#2436F5]">(Primary)</span>}
                  </label>

                  <input
                    type="url"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-xl text-xs font-mono text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                  />

                  {/* Thumbnail Preview Area */}
                  <div className="h-28 rounded-xl border-2 border-dashed border-[#0E1330]/30 bg-[#FFFFFF] overflow-hidden flex items-center justify-center relative">
                    {hasUrl && !hasError ? (
                      <img
                        src={imgUrl}
                        alt={`Preview #${idx + 1}`}
                        onError={() => setImageErrors((prev) => ({ ...prev, [idx]: true }))}
                        className="w-full h-full object-cover"
                      />
                    ) : hasUrl && hasError ? (
                      <div className="text-center p-2 text-red-600 space-y-1">
                        <AlertCircle className="w-5 h-5 mx-auto" />
                        <p className="text-[10px] font-bold">Image failed to load</p>
                        <p className="text-[9px] text-[#5B6079]">Please verify image URL</p>
                      </div>
                    ) : (
                      <div className="text-center text-[#5B6079] space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto opacity-40" />
                        <p className="text-[10px] font-bold">No image URL entered</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <a
            href="#/admin/products"
            className="px-5 py-3 bg-[#F7F8FC] hover:bg-gray-200 text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330]"
          >
            Cancel
          </a>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#2436F5] hover:bg-[#1122D0] text-[#FFFFFF] font-heading font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving Product...' : isEditMode ? 'Update Product' : 'Save New Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
