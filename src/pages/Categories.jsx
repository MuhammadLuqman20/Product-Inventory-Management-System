import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { Plus, Edit3, Trash2, Tags, AlertCircle, Info } from 'lucide-react';

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setName('');
    setDescription('');
    setNameError('');
    setIsOpen(true);
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setNameError('');
    setIsOpen(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const data = { name, description };
      if (selectedCategory) {
        await api.updateCategory(selectedCategory._id, data);
        setSuccessMsg('Category updated successfully.');
      } else {
        await api.createCategory(data);
        setSuccessMsg('Category created successfully.');
      }
      setIsOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      if (err.data?.error?.code === 'DUPLICATE_VALUE') {
        setNameError('Category name must be unique.');
      } else {
        setError(err.message || 'An error occurred while saving.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.deleteCategory(selectedCategory._id);
      setSuccessMsg('Category deleted successfully.');
      setIsDeleteOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setIsDeleteOpen(false);
      if (err.status === 409 || err.data?.error?.code === 'CATEGORY_IN_USE') {
        setError('Cannot delete category: It is currently assigned to one or more products.');
      } else {
        setError(err.message || 'Failed to delete category.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {successMsg && (
        <div className="alert-banner success">
          <Info size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="alert-banner danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="filter-bar" style={{ justifyContent: 'flex-end' }}>
        {isAdmin && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={18} />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {loading ? (
        <Loader message="Loading categories..." />
      ) : categories.length === 0 ? (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: '12px',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Tags size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No categories registered</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>Click the button above to register your first category.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {category.name}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {category.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided</span>}
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleOpenEdit(category)} className="btn btn-secondary btn-icon-only btn-sm" title="Edit Category">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleOpenDelete(category)} className="btn btn-danger btn-icon-only btn-sm" title="Delete Category">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cat-name">Category Name</label>
            <input 
              id="cat-name"
              type="text" 
              className={`input-field ${nameError ? 'input-error' : ''}`}
              placeholder="e.g. Office Stationery"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              required
            />
            {nameError && <span className="error-text">{nameError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cat-desc">Description</label>
            <textarea 
              id="cat-desc"
              className="input-field"
              placeholder="Provide a description for this product group..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Category Deletion"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Category'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
          <Trash2 size={40} style={{ color: 'var(--danger)', marginBottom: '8px' }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>Are you sure you want to delete this category?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            This will delete the category <strong style={{ color: 'var(--text-primary)' }}>{selectedCategory?.name}</strong>.
            <br />
            <span style={{ display: 'block', marginTop: '8px', color: 'var(--warning)', fontWeight: 500 }}>
              Note: This action is only allowed if no products are currently assigned to this category.
            </span>
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default Categories;
