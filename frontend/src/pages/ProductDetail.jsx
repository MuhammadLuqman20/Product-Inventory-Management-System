import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Plus, 
  AlertCircle, 
  Info,
  Layers,
  Building2,
  Mail,
  Calendar,
  Layers3
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Transaction modal state
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [moveType, setMoveType] = useState('IN'); // 'IN' or 'OUT'
  const [moveQty, setMoveQty] = useState('');
  const [moveReason, setMoveReason] = useState('');
  const [moveError, setMoveError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductAndHistory = async () => {
    try {
      setLoading(true);
      const [prodRes, histRes] = await Promise.all([
        api.getProductById(id),
        api.getStockMovements(id)
      ]);
      setProduct(prodRes.data);
      setHistory(histRes.history || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndHistory();
  }, [id]);

  const handleOpenMovement = (type) => {
    setMoveType(type);
    setMoveQty('');
    setMoveReason('');
    setMoveError('');
    setIsMoveOpen(true);
  };

  const handleMoveSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(moveQty, 10);
    
    if (isNaN(qty) || qty <= 0) {
      setMoveError('Quantity must be a positive integer.');
      return;
    }
    
    if (moveType === 'OUT' && qty > product.quantityInStock) {
      setMoveError(`Insufficient stock. Only ${product.quantityInStock} items remaining.`);
      return;
    }

    if (!moveReason.trim()) {
      setMoveError('Reason is required.');
      return;
    }

    setIsSubmitting(true);
    setMoveError('');
    try {
      await api.createStockMovement(id, {
        type: moveType,
        quantity: qty,
        reason: moveReason.trim()
      });
      
      setSuccessMsg(`Stock ${moveType === 'IN' ? 'added' : 'removed'} successfully.`);
      setIsMoveOpen(false);
      
      // Reload product details and transaction history
      await fetchProductAndHistory();
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setMoveError(err.message || 'Failed to record stock movement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader message="Retrieving product ledger..." />;

  if (error || !product) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="alert-banner danger">
          <AlertCircle size={18} />
          <span>{error || 'Product not found'}</span>
        </div>
        <Link to="/products" className="btn btn-secondary" style={{ width: 'fit-content' }}>
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Navigation */}
      <div>
        <Link to="/products" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} />
          Back to list
        </Link>
      </div>

      {/* Message banners */}
      {successMsg && (
        <div className="alert-banner success">
          <Info size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Product Overview Panels */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Product Profile */}
        <div className="card-panel" style={{ gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                color: 'var(--accent-secondary)',
                letterSpacing: '1px'
              }}>
                Product Ledger
              </span>
              <h2 style={{ fontSize: '24px', margin: 0 }}>{product.name}</h2>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                SKU: <code style={{ fontSize: '13px' }}>{product.sku}</code>
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Available Quantity</span>
              <span style={{ 
                fontSize: '32px', 
                fontWeight: 700, 
                color: product.quantityInStock === 0 ? 'var(--danger)' : product.quantityInStock < 10 ? 'var(--warning)' : 'var(--success)'
              }}>
                {product.quantityInStock}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {product.description || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No product description added.</span>}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            borderTop: '1px solid var(--border)', 
            paddingTop: '20px' 
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--accent-secondary)' }}>
                <Layers size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Category</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{product.category?.name || 'Unassigned'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--accent-secondary)' }}>
                <Building2 size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Supplier</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{product.supplier?.name || 'Unassigned'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--accent-secondary)' }}>
                <Layers3 size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Unit Cost</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>${product.unitPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick stock change widget */}
        <div className="card-panel" style={{ gap: '16px' }}>
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          
          <button 
            onClick={() => handleOpenMovement('IN')} 
            className="btn btn-primary" 
            style={{ width: '100%', gap: '10px' }}
          >
            <TrendingUp size={18} />
            Record Stock IN
          </button>

          <button 
            onClick={() => handleOpenMovement('OUT')} 
            className="btn btn-secondary" 
            style={{ width: '100%', gap: '10px', borderColor: 'var(--border)' }}
          >
            <TrendingDown size={18} />
            Record Stock OUT
          </button>

          {product.supplier && (
            <div style={{ 
              marginTop: '12px',
              padding: '14px', 
              borderRadius: '8px', 
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Supplier Contact</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{product.supplier.name}</span>
              <a 
                href={`mailto:${product.supplier.contactEmail}`} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  fontSize: '12px', 
                  color: 'var(--accent-secondary)', 
                  textDecoration: 'none',
                  marginTop: '4px'
                }}
              >
                <Mail size={12} />
                {product.supplier.contactEmail}
              </a>
            </div>
          )}
        </div>

      </div>

      {/* Stock Transaction Ledger History */}
      <div className="card-panel">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} style={{ color: 'var(--accent-secondary)' }} />
            <h2>Stock Transaction History</h2>
          </div>
        </div>

        {history.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-secondary)', 
            padding: '60px 20px'
          }}>
            <Calendar size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ fontSize: '14px' }}>No stock movements have been recorded for this product yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Activity Type</th>
                  <th>Quantity</th>
                  <th>Running Balance</th>
                  <th>Authorized Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.map((mov) => (
                  <tr key={mov.id}>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(mov.date).toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge ${mov.type === 'IN' ? 'in-stock' : 'out-of-stock'}`}>
                        {mov.type === 'IN' ? 'STOCK IN' : 'STOCK OUT'}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: mov.type === 'IN' ? 'var(--success)' : 'var(--danger)' }}>
                        {mov.type === 'IN' ? '+' : '-'}{mov.quantity}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{mov.balance} units</span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={mov.reason}>
                      {mov.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RECORD MOVEMENT MODAL */}
      <Modal
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        title={`Record Stock ${moveType === 'IN' ? 'IN (Receive)' : 'OUT (Release)'}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsMoveOpen(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" onClick={handleMoveSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Submit Transaction'}
            </button>
          </>
        }
      >
        {moveError && (
          <div className="alert-banner danger" style={{ padding: '8px 12px', fontSize: '13px' }}>
            <AlertCircle size={16} />
            <span>{moveError}</span>
          </div>
        )}

        <form onSubmit={handleMoveSubmit}>
          <div className="form-group">
            <label htmlFor="move-qty">Quantity to Move</label>
            <input 
              id="move-qty"
              type="number" 
              className="input-field"
              placeholder="e.g. 25"
              value={moveQty}
              onChange={(e) => { setMoveQty(e.target.value); setMoveError(''); }}
              min="1"
              required
              disabled={isSubmitting}
            />
            {moveType === 'OUT' && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Remaining Limit: {product.quantityInStock} units
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="move-reason">Reason / Memo</label>
            <input 
              id="move-reason"
              type="text" 
              className="input-field"
              placeholder={moveType === 'IN' ? 'e.g. Received shipment from supplier' : 'e.g. Order fulfillment #8209'}
              value={moveReason}
              onChange={(e) => { setMoveReason(e.target.value); setMoveError(''); }}
              required
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProductDetail;
