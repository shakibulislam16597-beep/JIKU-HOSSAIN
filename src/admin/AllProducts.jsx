import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logAction } from '../lib/audit';
import { clearStorefrontCache } from '../lib/storefrontData';
import { MOCK_PRODUCTS } from '../data/products';
import { formatBDT } from '../utils/currency';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  AlertTriangle,
  DownloadCloud,
  CheckCircle2,
  Package,
  X,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Delete Action
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Fetch Products
      const prodSnap = await getDocs(collection(db, 'products'));
      const fetchedProds = [];
      prodSnap.forEach((docSnap) => {
        fetchedProds.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(fetchedProds);

      // Fetch Categories
      const catSnap = await getDocs(collection(db, 'categories'));
      const fetchedCats = [];
      catSnap.forEach((docSnap) => {
        fetchedCats.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCategories(fetchedCats);
    } catch (err) {
      console.error('Error loading products from Firestore:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Firestore permission denied. Please check security rules or re-authenticate.');
      } else {
        setErrorMessage(`Failed to load products: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete product
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await deleteDoc(doc(db, 'products', productToDelete.id));
      await logAction('DELETE_PRODUCT', productToDelete.id, {
        productName: productToDelete.name || productToDelete.title
      });
      clearStorefrontCache();
      setSuccessMessage(`Product "${productToDelete.name || productToDelete.title}" deleted successfully.`);
      setProductToDelete(null);
      await fetchProductsAndCategories();
    } catch (err) {
      console.error('Error deleting product:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied when deleting product.');
      } else {
        setErrorMessage(`Failed to delete product: ${err?.message || 'Error occurred'}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Import Sample Products (when collection is empty)
  const handleImportSamples = async () => {
    setIsImporting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const batch = writeBatch(db);

      // 1. Unique Categories
      const categoryNames = [
        ...new Set(MOCK_PRODUCTS.map((p) => p.category).filter(Boolean))
      ];
      const categoryMap = {};

      categoryNames.forEach((catName) => {
        const catRef = doc(collection(db, 'categories'));
        categoryMap[catName] = catRef.id;
        batch.set(catRef, {
          name: catName,
          slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: `${catName} collection fragrances`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      // 2. Default Brand
      const brandRef = doc(collection(db, 'brands'));
      const defaultBrandId = brandRef.id;
      const defaultBrandName = 'Extrovat Signature';
      batch.set(brandRef, {
        name: defaultBrandName,
        slug: 'extrovat-signature',
        description: 'Flagship luxury artisanal perfume house',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 3. Products
      MOCK_PRODUCTS.forEach((p) => {
        const prodRef = doc(collection(db, 'products'));
        const name = p.title;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const categoryId = categoryMap[p.category] || '';
        const sizesFormatted = Array.isArray(p.sizes)
          ? p.sizes.map((s) => (typeof s === 'string' ? { label: s, price: p.price } : s))
          : [{ label: '12ml', price: p.price }];

        batch.set(prodRef, {
          name,
          slug,
          description: p.description || '',
          categoryId,
          categoryName: p.category || 'Attar',
          brandId: defaultBrandId,
          brandName: defaultBrandName,
          price: p.price,
          oldPrice: p.oldPrice || null,
          stock: p.stockCount || 10,
          lowStockThreshold: 5,
          sizes: sizesFormatted,
          badge: p.badge || '',
          status: 'active',
          images: [p.image],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      await logAction('IMPORT_SAMPLES', 'products', {
        count: MOCK_PRODUCTS.length,
        categoriesCount: categoryNames.length
      });

      clearStorefrontCache();
      setSuccessMessage(`Successfully imported ${MOCK_PRODUCTS.length} sample products and categories!`);
      await fetchProductsAndCategories();
    } catch (err) {
      console.error('Error importing sample products:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied: cannot write sample products to Firestore.');
      } else {
        setErrorMessage(`Import failed: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setIsImporting(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((prod) => {
    const nameStr = (prod.name || prod.title || '').toLowerCase();
    const catStr = prod.categoryName || prod.category || '';
    const matchesSearch = nameStr.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || catStr === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || (prod.status || 'active') === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high-low') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'stock-low-high') return (a.stock || 0) - (b.stock || 0);
    // Newest default (using createdAt or fallback)
    return 0;
  });

  const uniqueCategoryNames = [
    ...new Set([
      ...categories.map((c) => c.name),
      ...products.map((p) => p.categoryName || p.category).filter(Boolean)
    ])
  ];

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330]">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold uppercase text-[#0E1330] flex items-center gap-2">
            <Package className="w-6 h-6 text-[#2436F5]" /> All Products
          </h1>
          <p className="text-xs font-sans text-[#5B6079] mt-0.5">
            Manage store product catalog, prices, inventory stock levels, and active status.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={fetchProductsAndCategories}
            title="Reload products"
            className="p-2.5 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl font-heading font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="#/admin/products/new"
            className="px-4 py-2.5 bg-[#2436F5] hover:bg-[#1122D0] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] flex items-center gap-2 transition-all active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FFC933]" /> Add Product
          </a>
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
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="p-1 hover:bg-green-100 rounded-lg text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Empty State Banner with Import Sample Products Button */}
      {!loading && products.length === 0 && (
        <div className="bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] p-8 text-center shadow-[4px_4px_0px_#0E1330] space-y-4">
          <div className="w-16 h-16 bg-[#FFC933] border-2 border-[#0E1330] rounded-full flex items-center justify-center mx-auto shadow-[2px_2px_0px_#0E1330]">
            <Package className="w-8 h-8 text-[#0E1330]" />
          </div>

          <div>
            <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
              No products found in Firestore
            </h3>
            <p className="text-xs font-sans text-[#5B6079] max-w-md mx-auto mt-1">
              Your Firestore <code className="bg-[#F7F8FC] px-1 py-0.5 border border-[#0E1330] rounded">products</code> collection is currently empty. You can add a new product or seed default sample products.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleImportSamples}
              disabled={isImporting}
              className="px-5 py-3 bg-[#FFC933] hover:bg-[#e6b42d] text-[#0E1330] font-heading font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <DownloadCloud className={`w-4 h-4 ${isImporting ? 'animate-bounce' : ''}`} />
              <span>{isImporting ? 'Importing sample catalog...' : 'Import sample products'}</span>
            </button>

            <a
              href="#/admin/products/new"
              className="px-5 py-3 bg-[#2436F5] hover:bg-[#1122D0] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FFC933]" /> Create First Product
            </a>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Row */}
      <div className="bg-[#FFFFFF] p-4 rounded-[20px] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5B6079] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl px-3 py-1.5">
          <Filter className="w-4 h-4 text-[#5B6079] shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-[#0E1330] focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {uniqueCategoryNames.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl px-3 py-1.5">
          <Package className="w-4 h-4 text-[#5B6079] shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-[#0E1330] focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl px-3 py-1.5">
          <ArrowUpDown className="w-4 h-4 text-[#5B6079] shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-[#0E1330] focus:outline-none cursor-pointer"
          >
            <option value="newest">Sort by Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="stock-low-high">Stock: Low to High</option>
          </select>
        </div>
      </div>

      {/* Main Content View (Table / Cards / Spinner) */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px]">
          <div className="w-8 h-8 border-4 border-[#2436F5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-heading font-bold text-[#5B6079]">Loading catalog products from Firestore...</p>
        </div>
      ) : sortedProducts.length === 0 && products.length > 0 ? (
        <div className="bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] p-8 text-center space-y-2">
          <p className="text-sm font-heading font-bold text-[#0E1330]">
            No products match your selected search or filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-4 py-2 bg-[#2436F5] text-[#FFFFFF] font-heading font-bold text-xs rounded-full border-2 border-[#0E1330]"
          >
            Reset Filters
          </button>
        </div>
      ) : sortedProducts.length > 0 ? (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] shadow-[4px_4px_0px_#0E1330] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F8FC] border-b-2 border-[#0E1330] text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#0E1330]">
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (৳)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#0E1330]/10 text-xs font-sans text-[#0E1330]">
                  {sortedProducts.map((prod) => {
                    const name = prod.name || prod.title || 'Untitled';
                    const category = prod.categoryName || prod.category || 'Attar';
                    const image = (Array.isArray(prod.images) && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3';
                    const price = prod.price || 0;
                    const stock = typeof prod.stock === 'number' ? prod.stock : (prod.stockCount ?? 10);
                    const threshold = prod.lowStockThreshold ?? 5;
                    const isLowStock = stock <= threshold;
                    const status = prod.status || 'active';

                    return (
                      <tr key={prod.id} className="hover:bg-[#F7F8FC] transition-colors">
                        {/* Product Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-[#0E1330] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-xs text-[#0E1330] truncate max-w-xs">
                                {name}
                              </p>
                              {prod.badge && (
                                <span className="inline-block px-2 py-0.5 text-[9px] font-heading font-bold bg-[#FFC933] border border-[#0E1330] rounded-md mt-0.5">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 font-bold text-[#5B6079]">
                          {category}
                        </td>

                        {/* Price */}
                        <td className="p-4 font-heading font-extrabold text-[#0E1330]">
                          {formatBDT(price)}
                          {prod.oldPrice && (
                            <span className="block text-[10px] line-through text-[#5B6079]">
                              {formatBDT(prod.oldPrice)}
                            </span>
                          )}
                        </td>

                        {/* Stock & Low Stock Badge */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">{stock} units</span>
                            {isLowStock && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-[#0E1330] rounded-md text-[10px] font-heading font-extrabold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" /> Low stock
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-heading font-extrabold uppercase tracking-wider ${
                              status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                                : 'bg-gray-100 text-gray-700 border-gray-400'
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`#/admin/products/edit?id=${prod.id}`}
                              className="p-2 bg-[#FFFFFF] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl font-bold text-xs transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(prod)}
                              className="p-2 bg-[#FFFFFF] hover:bg-red-100 text-red-600 border-2 border-[#0E1330] rounded-xl font-bold text-xs transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden space-y-3">
            {sortedProducts.map((prod) => {
              const name = prod.name || prod.title || 'Untitled';
              const category = prod.categoryName || prod.category || 'Attar';
              const image = (Array.isArray(prod.images) && prod.images[0]) || prod.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3';
              const price = prod.price || 0;
              const stock = typeof prod.stock === 'number' ? prod.stock : (prod.stockCount ?? 10);
              const threshold = prod.lowStockThreshold ?? 5;
              const isLowStock = stock <= threshold;
              const status = prod.status || 'active';

              return (
                <div
                  key={prod.id}
                  className="bg-[#FFFFFF] p-4 rounded-[20px] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={image}
                      alt={name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-[#0E1330] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#5B6079] uppercase">
                          {category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[9px] font-heading font-extrabold uppercase ${
                            status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                              : 'bg-gray-100 text-gray-700 border-gray-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <h3 className="font-heading font-extrabold text-sm text-[#0E1330] truncate mt-0.5">
                        {name}
                      </h3>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-heading font-extrabold text-sm text-[#2436F5]">
                          {formatBDT(price)}
                        </span>
                        {isLowStock && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-[#0E1330] rounded text-[9px] font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Low stock ({stock})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t-2 border-[#0E1330]/10 flex items-center justify-between text-xs font-bold">
                    <span className="text-[#5B6079]">Stock: {stock} units</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`#/admin/products/edit?id=${prod.id}`}
                        className="px-3 py-1.5 bg-[#F7F8FC] hover:bg-[#FFC933] border-2 border-[#0E1330] rounded-xl text-[#0E1330] flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => setProductToDelete(prod)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-[#0E1330] rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {/* Delete Confirmation Dialog Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative space-y-4 text-[#0E1330]">
            <button
              type="button"
              onClick={() => setProductToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-red-100 border-2 border-[#0E1330] rounded-2xl flex items-center justify-center text-red-600 shadow-[2px_2px_0px_#0E1330]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
                Delete Product Confirmation
              </h3>
              <p className="text-xs font-sans text-[#5B6079] mt-1">
                Are you sure you want to delete <strong className="text-[#0E1330]">"{productToDelete.name || productToDelete.title}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Product'}
              </button>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 bg-[#F7F8FC] hover:bg-gray-200 text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
