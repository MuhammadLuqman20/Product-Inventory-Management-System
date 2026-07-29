import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { Plus, Edit3, Trash2, Users, AlertCircle, Info, Mail, Phone, MapPin } from 'lucide-react';

const Suppliers = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Form states
  const [formValues, setFormValues] = useState({
    name: '',
    contactEmail: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.getSuppliers();
      setSuppliers(res.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve suppliers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedSupplier(null);
    setFormValues({ name: '', contactEmail: '', phone: '', address: '' });
    setFormErrors({});
    setIsOpen(true);
  };

  const handleOpenEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setFormValues({
      name: supplier.name,
      contactEmail: supplier.contactEmail,
      phone: supplier.phone,
      address: supplier.address
    });
    setFormErrors({});
    setIsOpen(true);
  };

  const handleOpenDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.name.trim() || formValues.name.length < 3) {
      errors.name = 'Supplier name must be at least 3 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.contactEmail.trim() || !emailRegex.test(formValues.contactEmail)) {
      errors.contactEmail = 'A valid contact email is required.';
    }
    if (!formValues.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }
    if (!formValues.address.trim()) {
      errors.address = 'Address is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    try {
      if (selectedSupplier) {
        await api.updateSupplier(selectedSupplier._id, formValues);
        setSuccessMsg('Supplier updated successfully.');
      } else {
        await api.createSupplier(formValues);
        setSuccessMsg('Supplier created successfully.');
      }
      setIsOpen(false);
      fetchSuppliers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;
    setIsSubmitting(true);
    setError('');
    try {
      await api.deleteSupplier(selectedSupplier._id);
      setSuccessMsg('Supplier deleted successfully.');
      setIsDeleteOpen(false);
      fetchSuppliers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setIsDeleteOpen(false);
      if (err.status === 409 || err.data?.error?.code === 'SUPPLIER_IN_USE') {
        setError('Cannot delete supplier: It is currently assigned to one or more products.');
      } else {
        setError(err.message || 'Failed to delete supplier.');
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
            <span>Add Supplier</span>
          </button>
        )}
      </div>

      {loading ? (
        <Loader message="Loading suppliers directory..." />
      ) : suppliers.length === 0 ? (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: '12px',
          padding: '80px 20px',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No suppliers registered</h3>
          <p style={{ fontSize: '14px', marginTop: '6px' }}>Click the button above to register your first supplier partner.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact Info</th>
                <th>Address</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier._id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {supplier.name}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                        <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                        <a href={`mailto:${supplier.contactEmail}`} style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                          {supplier.contactEmail}
                        </a>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                        {supplier.phone}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                      {supplier.address}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleOpenEdit(supplier)} className="btn btn-secondary btn-icon-only btn-sm" title="Edit Supplier">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleOpenDelete(supplier)} className="btn btn-danger btn-icon-only btn-sm" title="Delete Supplier">
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
        title={selectedSupplier ? 'Edit Supplier Partner' : 'Add Supplier Partner'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Supplier'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sup-name">Supplier Name</label>
            <input 
              id="sup-name"
              type="text" 
              name="name"
              className={`input-field ${formErrors.name ? 'input-error' : ''}`}
              placeholder="e.g. LogiTech Distributors"
              value={formValues.name}
              onChange={handleFormChange}
              required
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sup-email">Contact Email</label>
            <input 
              id="sup-email"
              type="email" 
              name="contactEmail"
              className={`input-field ${formErrors.contactEmail ? 'input-error' : ''}`}
              placeholder="e.g. contact@supplier.com"
              value={formValues.contactEmail}
              onChange={handleFormChange}
              required
            />
            {formErrors.contactEmail && <span className="error-text">{formErrors.contactEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sup-phone">Phone Number</label>
            <input 
              id="sup-phone"
              type="text" 
              name="phone"
              className={`input-field ${formErrors.phone ? 'input-error' : ''}`}
              placeholder="e.g. +1 555-0199"
              value={formValues.phone}
              onChange={handleFormChange}
              required
            />
            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="sup-address">Office Address</label>
            <input 
              id="sup-address"
              type="text" 
              name="address"
              className={`input-field ${formErrors.address ? 'input-error' : ''}`}
              placeholder="e.g. 102 Science Park, Boston"
              value={formValues.address}
              onChange={handleFormChange}
              required
            />
            {formErrors.address && <span className="error-text">{formErrors.address}</span>}
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Supplier Deletion"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Supplier'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
          <Trash2 size={40} style={{ color: 'var(--danger)', marginBottom: '8px' }} />
          <p style={{ fontWeight: 600, fontSize: '16px' }}>Are you sure you want to delete this supplier?</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            This will delete the supplier partner <strong style={{ color: 'var(--text-primary)' }}>{selectedSupplier?.name}</strong>.
            <br />
            <span style={{ display: 'block', marginTop: '8px', color: 'var(--warning)', fontWeight: 500 }}>
              Note: This action is only allowed if no products are currently assigned to this supplier.
            </span>
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default Suppliers;
