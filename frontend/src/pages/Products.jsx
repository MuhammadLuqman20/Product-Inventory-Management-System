import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { 
  Search, 
  Plus, 
  Package,
  FileSpreadsheet, 
  UploadCloud, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  AlertCircle,
  TrendingUp,
  FileDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Products = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & filter states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Form states
  const [formValues, setFormValues] = useState({
    name: '',
    sku: '',
    description: '',
    unitPrice: '',
    quantityInStock: '',
    category: '',
    supplier: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CSV Import state
  const [importFile, setImportFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, sups] = await Promise.all([
          api.getCategories(),
          api.getSuppliers()
        ]);
        setCategories(cats.data || []);
        setSuppliers(sups.data || []);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch products when filters/page change
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts({
        search,
        category: categoryFilter,
        supplier: supplierFilter,
        status: statusFilter,
        page,
        pageSize
      });
      setProducts(res.data || []);
      setPagination(res.pagination || { totalPages: 1, totalItems: 0 });
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not retrieve products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, supplierFilter, statusFilter, page]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // reset to first page on search
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormValues({
      name: '',
      sku: '',
      description: '',
      unitPrice: '',
      quantityInStock: '',
      category: categories[0]?._id || '',
      supplier: suppliers[0]?._id || ''
    });
    setFormErrors({});
    setSelectedProduct(null);
    setIsAddEditOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setFormValues({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      unitPrice: product.unitPrice,
      quantityInStock: product.quantityInStock,
      category: product.category?._id || product.category || '',
      supplier: product.supplier?._id || product.supplier || ''
    });
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim() || formValues.name.length < 3) {
      errors.name = 'Product name is required (min 3 chars)';
    }
    if (!formValues.sku.trim() || formValues.sku.length < 3) {
      errors.sku = 'SKU is required (min 3 chars)';
    }
    if (formValues.unitPrice === '' || Number(formValues.unitPrice) < 0) {
      errors.unitPrice = 'Unit price must be a non-negative number';
    }
    if (formValues.quantityInStock === '' || !Number.isInteger(Number(formValues.quantityInStock)) || Number(formValues.quantityInStock) < 0) {
      errors.quantityInStock = 'Quantity must be a non-negative integer';
    }
    if (!formValues.category) {
      errors.category = 'Category selection is required';
    }
    if (!formValues.supplier) {
      errors.supplier = 'Supplier selection is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Create / Update Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    try {
      if (selectedProduct) {
        await api.updateProduct(selectedProduct._id, formValues);
        setSuccessMsg('Product updated successfully.');
      } else {
        await api.createProduct(formValues);
        setSuccessMsg('Product created successfully.');
      }
      setIsAddEditOpen(false);
      fetchProducts();
      // Auto-clear success banner
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      if (err.data?.error?.code === 'DUPLICATE_VALUE') {
        setFormErrors(prev => ({ ...prev, sku: 'SKU already exists.' }));
      } else {
        setError(err.message || 'Failed to save product details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      await api.deleteProduct(selectedProduct._id);
      setSuccessMsg('Product deleted successfully.');
      setIsDeleteOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete product.');
      setIsDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Export CSV
  const handleExportCSV = async () => {
    try {
      const blob = await api.exportProducts({
        search,
        category: categoryFilter,
        supplier: supplierFilter,
        status: statusFilter
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      setError('Could not export products list to CSV.');
    }
  };

  // Handle CSV Import File Change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  // Handle CSV Import Submit
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setIsSubmitting(true);
    setImportResults(null);
    setError('');
    
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const res = await api.importProducts(formData);
      setImportResults(res);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to process CSV file.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stock status badge renderer
  const renderStockBadge = (qty) => {
    if (qty === 0) return <span className="badge out-of-stock">Out of stock</span>;
    if (qty < 10) return <span className="badge low-stock">{qty} - Low stock</span>;
    return <span className="badge in-stock">{qty} - In stock</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Messages */}
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

      {/* Filter / Search Bar */}
      <div className="filter-bar">
        <div className="filters-left">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="input-field search-input" 
              placeholder="Search by name or SKU..." 
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          <select 
            className="input-field select-filter"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <select 
            className="input-field select-filter"
            value={supplierFilter}
            onChange={(e) => { setSupplierFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Suppliers</option>
            {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>

          <select 
            className="input-field select-filter"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock (&lt; 10)</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" title="Export as CSV">
            <FileDown size={18} />
            <span>Export</span>
          </button>
          
          {isAdmin && (
            <>
              <button onClick={() => { setImportFile(null); setImportResults(null); setIsImportOpen(true); }} className="btn btn-secondary" title="Import from CSV">
                <UploadCloud size={18} />
                <span>Import</span>
              </button>

              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={18} />
                <span>Add Product</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <Loader message="Fetching product directory..." />
      ) : products.length === 0 ? (
        <div className="empty-card">
          <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No products found</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>Try resetting your search query or filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Unit Price</th>
                <th>Stock Level</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{product.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={product.description}>
                        {product.description || 'No description'}
                      </span>
                    </div>
                  </td>
                  <td><code style={{ fontSize: '13px' }}>{product.sku}</code></td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>{product.supplier?.name || 'N/A'}</td>
                  <td><strong style={{ color: 'var(--text-primary)' }}>${product.unitPrice.toFixed(2)}</strong></td>
                  <td>{renderStockBadge(product.quantityInStock)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Link to={`/products/${product._id}`} className="btn btn-secondary btn-icon-only btn-sm" title="View details & Stock History">
                        <Eye size={15} />
                      </Link>
                      
                      {isAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(product)} className="btn btn-secondary btn-icon-only btn-sm" title="Edit details">
                            <Edit3 size={15} />
                          </button>
                          <button onClick={() => handleOpenDelete(product)} className="btn btn-danger btn-icon-only btn-sm" title="Delete product">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination component */}
      {!loading && products.length > 0 && (
        <div className="pagination">
          <span className="pagination-info">
            Showing Page <strong>{page}</strong> of {pagination.totalPages} ({pagination.totalItems} total items)
          </span>
          <div className="pagination-actions">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setPage(p => Math.max(p - 1, 1))} 
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))} 
              disabled={page === pagination.totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal 
        isOpen={isAddEditOpen} 
        onClose={() => setIsAddEditOpen(false)}
        title={selectedProduct ? 'Edit Product Details' : 'Register New Product'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddEditOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleFormSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="form-name">Product Name</label>
            <input 
              id="form-name"
              type="text" 
              name="name" 
              className={`input-field ${formErrors.name ? 'input-error' : ''}`}
              placeholder="e.g. Mechanical Keyboard"
              value={formValues.name}
              onChange={handleFormChange}
              required
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-sku">SKU Code</label>
            <input 
              id="form-sku"
              type="text" 
              name="sku" 
              className={`input-field ${formErrors.sku ? 'input-error' : ''}`}
              placeholder="e.g. KEY001"
              value={formValues.sku}
              onChange={handleFormChange}
              required
              disabled={!!selectedProduct} // Locks SKU edit as per standard business guidelines
            />
            {formErrors.sku && <span className="error-text">{formErrors.sku}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="form-desc">Description</label>
            <textarea 
              id="form-desc"
              name="description" 
              className="input-field"
              placeholder="Provide a short product description..."
              value={formValues.description}
              onChange={handleFormChange}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="form-price">Unit Price ($)</label>
              <input 
                id="form-price"
                type="number" 
                name="unitPrice" 
                step="0.01"
                className={`input-field ${formErrors.unitPrice ? 'input-error' : ''}`}
                placeholder="0.00"
                value={formValues.unitPrice}
                onChange={handleFormChange}
                required
              />
              {formErrors.unitPrice && <span className="error-text">{formErrors.unitPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="form-qty">Quantity in Stock</label>
              <input 
                id="form-qty"
                type="number" 
                name="quantityInStock" 
                className={`input-field ${formErrors.quantityInStock ? 'input-error' : ''}`}
                placeholder="0"
                value={formValues.quantityInStock}
                onChange={handleFormChange}
                required
                disabled={!!selectedProduct} // Updates should happen via StockMovement transaction (atomic)
              />
              {formErrors.quantityInStock && <span className="error-text">{formErrors.quantityInStock}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label htmlFor="form-cat">Category</label>
              <select 
                id="form-cat"
                name="category" 
                className={`input-field ${formErrors.category ? 'input-error' : ''}`}
                value={formValues.category}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {formErrors.category && <span className="error-text">{formErrors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="form-sup">Supplier</label>
              <select 
                id="form-sup"
                name="supplier" 
                className={`input-field ${formErrors.supplier ? 'input-error' : ''}`}
                value={formValues.supplier}
                onChange={handleFormChange}
                required
              >
                <option value="" disabled>Select Supplier</option>
                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              {formErrors.supplier && <span className="error-text">{formErrors.supplier}</span>}
            </div>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
          <Trash2 size={40} style={{ color: 'var(--danger)', marginBottom: '8px' }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>Are you sure you want to delete this product?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            This will permanently delete the product <strong style={{ color: 'var(--text-primary)' }}>{selectedProduct?.name}</strong> (SKU: {selectedProduct?.sku}) and all of its associated stock movement records. This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* CSV IMPORT MODAL */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Bulk Import Products via CSV"
        wide={importResults !== null}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsImportOpen(false)} disabled={isSubmitting}>
              {importResults ? 'Close' : 'Cancel'}
            </button>
            {!importResults && (
              <button className="btn btn-primary" onClick={handleImportSubmit} disabled={!importFile || isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Process Import'}
              </button>
            )}
          </>
        }
      >
        {!importResults ? (
          <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Upload a `.csv` file. The headers must contain: 
              <br />
              <code style={{ fontSize: '12px' }}>name, sku, description, unitPrice, quantityInStock, category, supplier</code>
            </p>

            <div 
              className="drop-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
              <p style={{ fontSize: '14px', fontWeight: 500 }}>
                {importFile ? importFile.name : 'Click to select CSV File'}
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center' }}>
              <div style={{ padding: '16px', background: 'var(--success-bg)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h4 style={{ color: 'var(--success)', margin: '0 0 4px', fontSize: '18px' }}>{importResults.imported}</h4>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Successfully Imported</span>
              </div>
              <div style={{ padding: '16px', background: importResults.failed > 0 ? 'var(--danger-bg)' : 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ color: importResults.failed > 0 ? 'var(--danger)' : 'var(--text-primary)', margin: '0 0 4px', fontSize: '18px' }}>{importResults.failed}</h4>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Failed Rows</span>
              </div>
            </div>

            {importResults.errors && importResults.errors.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Row-Level Validation Errors:</h4>
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.2)',
                  fontSize: '13px'
                }}>
                  {importResults.errors.map((err, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        padding: '10px 14px', 
                        borderBottom: i === importResults.errors.length - 1 ? 'none' : '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <span style={{ color: 'var(--text-secondary)' }}>Row: {err.row || 'N/A'} {err.sku ? `(SKU: ${err.sku})` : ''}</span>
                      <span style={{ color: 'var(--danger)', fontWeight: 500 }}>{err.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Products;
