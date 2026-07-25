import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const { getToken } = useAuth();

  // Load products from backend REST API
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products from backend:', e);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const badges = ['All', ...new Set(products.map((p) => p.badge).filter(Boolean))];
  const weaves = ['All', ...new Set(products.map((p) => p.weave).filter(Boolean))];
  const fabrics = ['All', ...new Set(products.map((p) => p.fabric).filter(Boolean))];

  const addProduct = useCallback(async (product) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      }
    } catch (error) {
      console.error('Failed to add product to backend:', error);
    }
    return null;
  }, [getToken]);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
        );
        return updatedProduct;
      }
    } catch (error) {
      console.error('Failed to update product on backend:', error);
    }
    return null;
  }, [getToken]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (error) {
      console.error('Failed to delete product on backend:', error);
    }
    return false;
  }, [getToken]);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const resetProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        badges,
        weaves,
        fabrics,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        resetProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
