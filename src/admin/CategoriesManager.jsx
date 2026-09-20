import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { logAction } from '../lib/audit';
import { clearStorefrontCache } from '../lib/storefrontData';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Search
} from 'lucide-react';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null for create, doc for edit

  // Modal Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Blocking / Confirmation Modal
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [blockedDeleteCount, setBlockedDeleteCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const slugify = (str) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      const fetchedCats = [];
      catSnap.forEach((docSnap) => {
        fetchedCats.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCategories(fetchedCats);

      const prodSnap = await getDocs(collection(db, 'products'));
      const fetchedProds = [];
      prodSnap.forEach((docSnap) => {
        fetchedProds.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(fetchedProds);
    } catch (err) {
      console.error('Error fetching categories or products:', err);
      if (err?.code === 'permission-denied') {
        setErrorMessage('Permission denied accessing Firestore categories.');
      } else {
        setErrorMessage(`Failed to load categories: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    setEditingCategory(cat);
    if (cat) {
      setName(cat.name || '');
      setSlug(cat.slug || slugify(cat.name || ''));
      setDescription(cat.description || '');
    } else {
      setName('');
      setSlug('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Category name is required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const cleanSlug = slug.trim() || slugify(name);
      const catPayload = {
        name: name.trim(),
        slug: cleanSlug,
        description: description.trim(),
        updatedAt: serverTimestamp()
      };

      if (editingCategory) {
        // Edit / Rename
        await updateDoc(doc(db, 'categories', editingCategory.id), catPayload);
        await logAction('UPDATE_CATEGORY', editingCategory.id, { name: name.trim() });
        setSuccessMessage(`Category "${name}" updated successfully.`);
      } else {
        // Add
        const newRef = await addDoc(collection(db, 'categories'), {
          ...catPayload,
          createdAt: serverTimestamp()
        });
        await logAction('CREATE_CATEGORY', newRef.id, { name: name.trim() });
        setSuccessMessage(`Category "${name}" created successfully.`);
      }

      clearStorefrontCache();
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMessage(`Failed to save category: ${err?.message || 'Error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Check usage before delete
  const handleInitiateDelete = (cat) => {
    // Count products using this category
    const count = products.filter(
      (p) => p.categoryId === cat.id || p.categoryName === cat.name || p.category === cat.name
    ).length;

    setBlockedDeleteCount(count);
    setCategoryToDelete(cat);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete || blockedDeleteCount > 0) return;

    setIsDeleting(true);
    setErrorMessage('');
    try {
      await deleteDoc(doc(db, 'categories', categoryToDelete.id));
      await logAction('DELETE_CATEGORY', categoryToDelete.id, { name: categoryToDelete.name });
      clearStorefrontCache();
      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting category:', err);
      setErrorMessage(`Failed to delete category: ${err?.message || 'Error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330]">
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-extrabold uppercase text-[#0E1330] flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-[#2436F5]" /> Store Categories
          </h1>
          <p className="text-xs font-sans text-[#5B6079] mt-0.5">
            Organize products into categories. Categories used by active products cannot be deleted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            title="Reload categories"
            className="p-2.5 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal(null)}
            className="px-4 py-2.5 bg-[#2436F5] hover:bg-[#1122D0] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FFC933]" /> Add Category
          </button>
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
            className="p-1 hover:bg-red-100 rounded-lg text-red-700 cursor-pointer"
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
            className="p-1 hover:bg-green-100 rounded-lg text-emerald-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-[#FFFFFF] p-4 rounded-[20px] border-2 border-[#0E1330] shadow-[3px_3px_0px_#0E1330] max-w-md">
        <div className="relative">
          <Search className="w-4 h-4 text-[#5B6079] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category by name..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
          />
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px]">
          <div className="w-8 h-8 border-4 border-[#2436F5] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-heading font-bold text-[#5B6079]">Loading categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-[#FFFFFF] border-2 border-[#0E1330] rounded-[24px] p-8 text-center space-y-2">
          <p className="text-sm font-heading font-bold text-[#0E1330]">No categories found.</p>
          <button
            type="button"
            onClick={() => handleOpenModal(null)}
            className="px-4 py-2 bg-[#2436F5] text-[#FFFFFF] font-heading font-bold text-xs rounded-full border-2 border-[#0E1330]"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const usageCount = products.filter(
              (p) => p.categoryId === cat.id || p.categoryName === cat.name || p.category === cat.name
            ).length;

            return (
              <div
                key={cat.id}
                className="bg-[#FFFFFF] p-5 rounded-[24px] border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading font-extrabold text-base text-[#0E1330]">
                      {cat.name}
                    </h3>
                    <span className="px-2.5 py-1 bg-[#FFC933] text-[#0E1330] border border-[#0E1330] rounded-full text-[10px] font-heading font-black">
                      {usageCount} product{usageCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-[#5B6079] mt-0.5">/{cat.slug || slugify(cat.name)}</p>

                  {cat.description && (
                    <p className="text-xs font-sans text-[#5B6079] mt-2 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-[#0E1330]/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(cat)}
                    className="px-3 py-1.5 bg-[#F7F8FC] hover:bg-[#FFC933] text-[#0E1330] border-2 border-[#0E1330] rounded-xl font-heading font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Rename/Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInitiateDelete(cat)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-[#0E1330] rounded-xl font-heading font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative space-y-4 text-[#0E1330]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Attar"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-bold text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. attar"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-mono text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-heading font-extrabold uppercase text-[#0E1330]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full px-3.5 py-2.5 bg-[#F7F8FC] border-2 border-[#0E1330] rounded-xl text-xs font-sans text-[#0E1330] focus:outline-none focus:border-[#2436F5]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#2436F5] hover:bg-[#1122D0] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 bg-[#F7F8FC] hover:bg-gray-200 text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Blocked Delete Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E1330]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] max-w-md w-full p-6 border-2 border-[#0E1330] shadow-[4px_4px_0px_#0E1330] relative space-y-4 text-[#0E1330]">
            <button
              type="button"
              onClick={() => setCategoryToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#0E1330] bg-[#FFFFFF] hover:bg-[#F7F8FC] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className={`w-12 h-12 border-2 border-[#0E1330] rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_#0E1330] ${
                blockedDeleteCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-600'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            {blockedDeleteCount > 0 ? (
              // BLOCKED DELETION MESSAGE
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
                  Cannot Delete Category
                </h3>
                <p className="text-xs font-sans text-[#5B6079] leading-relaxed">
                  Cannot delete category <strong className="text-[#0E1330]">"{categoryToDelete.name}"</strong> because it is currently assigned to <strong className="text-[#2436F5]">{blockedDeleteCount} product(s)</strong>. Please reassign or delete those products first before deleting this category.
                </p>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="w-full py-2.5 bg-[#2436F5] text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] cursor-pointer"
                  >
                    Got It
                  </button>
                </div>
              </div>
            ) : (
              // ALLOWED DELETION CONFIRMATION
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-extrabold text-[#0E1330]">
                  Confirm Delete Category
                </h3>
                <p className="text-xs font-sans text-[#5B6079]">
                  Are you sure you want to delete category <strong className="text-[#0E1330]">"{categoryToDelete.name}"</strong>? This action cannot be undone.
                </p>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-[#FFFFFF] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] shadow-[2px_2px_0px_#0E1330] disabled:opacity-50 cursor-pointer"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Category'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 py-2.5 bg-[#F7F8FC] hover:bg-gray-200 text-[#0E1330] font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl border-2 border-[#0E1330] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
