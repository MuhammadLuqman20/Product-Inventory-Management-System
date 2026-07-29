const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Auto attach content-type if not form data
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  // For CSV export, handle blob response
  if (url.includes('/export') && response.ok) {
    return response.blob();
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.message || data.error?.message || 'Something went wrong';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return request(`/api/products?${query.toString()}`);
  },
  getProductById: (id) => request(`/api/products/${id}`),
  createProduct: (productData) => request('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  updateProduct: (id, productData) => request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  deleteProduct: (id) => request(`/api/products/${id}`, {
    method: 'DELETE',
  }),
  exportProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        query.append(key, params[key]);
      }
    });
    return request(`/api/products/export?${query.toString()}`);
  },
  importProducts: (formData) => request('/api/products/import', {
    method: 'POST',
    body: formData, // FormData gets appropriate multipart header automatically
  }),

  // Stock Movements
  createStockMovement: (productId, movementData) => request(`/api/products/${productId}/stock-movements`, {
    method: 'POST',
    body: JSON.stringify(movementData),
  }),
  getStockMovements: (productId) => request(`/api/products/${productId}/stock-movements`),

  // Categories
  getCategories: () => request('/api/categories'),
  getCategoryById: (id) => request(`/api/categories/${id}`),
  createCategory: (categoryData) => request('/api/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  updateCategory: (id, categoryData) => request(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  deleteCategory: (id) => request(`/api/categories/${id}`, {
    method: 'DELETE',
  }),

  // Suppliers
  getSuppliers: () => request('/api/suppliers'),
  getSupplierById: (id) => request(`/api/suppliers/${id}`),
  createSupplier: (supplierData) => request('/api/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplierData),
  }),
  updateSupplier: (id, supplierData) => request(`/api/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(supplierData),
  }),
  deleteSupplier: (id) => request(`/api/suppliers/${id}`, {
    method: 'DELETE',
  }),
};
