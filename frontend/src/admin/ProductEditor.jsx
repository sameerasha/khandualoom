import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductImageEditor from './ProductImageEditor';
import './ProductEditor.css';

export default function ProductEditor({ productId, onNavigate }) {
  const { addProduct, updateProduct, getProduct, categories } = useProducts();
  const isEditMode = !!productId;

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    fabric: '',
    weave: '',
    color: '',
    badge: '',
    image: '',
    images: ['', '', '', ''], // Holds up to 4 detail views (5 total images including cover)
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  // Load product if editing
  useEffect(() => {
    if (isEditMode) {
      const product = getProduct(Number(productId));
      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          description: product.description || '',
          fabric: product.fabric || '',
          weave: product.weave || '',
          color: product.color || '',
          badge: product.badge || '',
          image: product.image || '',
          images: product.images && product.images.length > 0 
            ? [product.images[0] || '', product.images[1] || '', product.images[2] || '', product.images[3] || '']
            : ['', '', '', ''],
        });
      } else {
        onNavigate('admin/products');
      }
    }
  }, [productId, isEditMode, getProduct, onNavigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    const priceVal = Number(formData.price);
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(priceVal) || priceVal <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.originalPrice) {
      const origPriceVal = Number(formData.originalPrice);
      if (isNaN(origPriceVal) || origPriceVal < priceVal) {
        newErrors.originalPrice = 'Original price must be greater than or equal to current price';
      }
    }

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.fabric.trim()) newErrors.fabric = 'Fabric description is required';
    if (!formData.weave.trim()) newErrors.weave = 'Weave description is required';
    if (!formData.color.trim()) newErrors.color = 'Color description is required';
    if (!formData.image) newErrors.image = 'A catalog cover image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
      images: formData.images.filter((img) => img.trim() !== ''),
    };

    if (isEditMode) {
      updateProduct(Number(productId), parsedData);
    } else {
      addProduct(parsedData);
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onNavigate('admin/products');
    }, 1200);
  };

  const badgeOptions = ['Bestseller', 'Premium', 'New Arrival', 'Trending', 'Heirloom', 'Popular'];

  return (
    <div className="product-editor">
      <div className="product-editor__header">
        <div>
          <h1 className="product-editor__title">
            {isEditMode ? 'Edit Saree Product' : 'Add New Saree Product'}
          </h1>
          <p className="product-editor__subtitle">
            {isEditMode ? 'Update information and catalog details' : 'Publish a new saree to the storefront'}
          </p>
        </div>
        <button className="product-editor__back-btn" onClick={() => onNavigate('admin/products')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to List
        </button>
      </div>

      <div className="product-editor__content">
        <form onSubmit={handleSubmit} className="product-editor__form" id="product-editor-form">
          
          <div className="product-editor__form-grid">
            
            {/* Left side inputs */}
            <div className="product-editor__form-main">
              <div className="product-editor__group">
                <label htmlFor="product-name" className="product-editor__label">Saree Name</label>
                <input
                  type="text"
                  id="product-name"
                  name="name"
                  className={`product-editor__input ${errors.name ? 'product-editor__input--error' : ''}`}
                  placeholder="e.g. Royal Banarasi Silk"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="product-editor__error">{errors.name}</span>}
              </div>

              <div className="product-editor__row-group">
                <div className="product-editor__group">
                  <label htmlFor="product-category" className="product-editor__label">Category</label>
                  <input
                    type="text"
                    id="product-category"
                    name="category"
                    className={`product-editor__input ${errors.category ? 'product-editor__input--error' : ''}`}
                    placeholder="e.g. Banarasi"
                    value={formData.category}
                    onChange={handleChange}
                    list="categories-list"
                  />
                  <datalist id="categories-list">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  {errors.category && <span className="product-editor__error">{errors.category}</span>}
                </div>

                <div className="product-editor__group">
                  <label htmlFor="product-badge" className="product-editor__label">Badge (Optional)</label>
                  <select
                    id="product-badge"
                    name="badge"
                    className="product-editor__select"
                    value={formData.badge}
                    onChange={handleChange}
                  >
                    <option value="">No Badge</option>
                    {badgeOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="product-editor__row-group">
                <div className="product-editor__group">
                  <label htmlFor="product-price" className="product-editor__label">Selling Price (₹)</label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    className={`product-editor__input ${errors.price ? 'product-editor__input--error' : ''}`}
                    placeholder="e.g. 24999"
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && <span className="product-editor__error">{errors.price}</span>}
                </div>

                <div className="product-editor__group">
                  <label htmlFor="product-originalPrice" className="product-editor__label">Original Price (₹ - Optional)</label>
                  <input
                    type="number"
                    id="product-originalPrice"
                    name="originalPrice"
                    className={`product-editor__input ${errors.originalPrice ? 'product-editor__input--error' : ''}`}
                    placeholder="e.g. 32999"
                    value={formData.originalPrice}
                    onChange={handleChange}
                  />
                  {errors.originalPrice && <span className="product-editor__error">{errors.originalPrice}</span>}
                </div>
              </div>

              <div className="product-editor__group">
                <label htmlFor="product-description" className="product-editor__label">Description</label>
                <textarea
                  id="product-description"
                  name="description"
                  rows="4"
                  className={`product-editor__textarea ${errors.description ? 'product-editor__textarea--error' : ''}`}
                  placeholder="Describe the weaving style, design details, motifs, and historical significance..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && <span className="product-editor__error">{errors.description}</span>}
              </div>

              <div className="product-editor__row-group">
                <div className="product-editor__group">
                  <label htmlFor="product-fabric" className="product-editor__label">Fabric Type</label>
                  <input
                    type="text"
                    id="product-fabric"
                    name="fabric"
                    className={`product-editor__input ${errors.fabric ? 'product-editor__input--error' : ''}`}
                    placeholder="e.g. Pure Georgette Silk"
                    value={formData.fabric}
                    onChange={handleChange}
                  />
                  {errors.fabric && <span className="product-editor__error">{errors.fabric}</span>}
                </div>

                <div className="product-editor__group">
                  <label htmlFor="product-weave" className="product-editor__label">Weave Style</label>
                  <input
                    type="text"
                    id="product-weave"
                    name="weave"
                    className={`product-editor__input ${errors.weave ? 'product-editor__input--error' : ''}`}
                    placeholder="e.g. Kadwa Weave Handloom"
                    value={formData.weave}
                    onChange={handleChange}
                  />
                  {errors.weave && <span className="product-editor__error">{errors.weave}</span>}
                </div>
              </div>

              <div className="product-editor__group">
                <label htmlFor="product-color" className="product-editor__label">Color Description</label>
                <input
                  type="text"
                  id="product-color"
                  name="color"
                  className={`product-editor__input ${errors.color ? 'product-editor__input--error' : ''}`}
                  placeholder="e.g. Emerald Green with Gold Zari"
                  value={formData.color}
                  onChange={handleChange}
                />
                {errors.color && <span className="product-editor__error">{errors.color}</span>}
              </div>

            </div>

            {/* Right side: Tabbed Product Image Editor (Max 5 Images) */}
            <div className="product-editor__form-sidebar">
              <ProductImageEditor
                image={formData.image}
                images={formData.images}
                onChange={({ image, images }) => {
                  setFormData(prev => ({ ...prev, image, images }));
                  if (errors.image && image) {
                    setErrors(prev => ({ ...prev, image: '' }));
                  }
                }}
              />
              {errors.image && <span className="product-editor__error" style={{ display: 'block', marginTop: '4px' }}>{errors.image}</span>}
            </div>

          </div>

          <div className="product-editor__actions">
            <button
              type="button"
              className="product-editor__btn product-editor__btn--cancel"
              onClick={() => onNavigate('admin/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="product-editor__btn product-editor__btn--submit"
              id="product-editor-submit"
            >
              {isEditMode ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>

        </form>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="product-editor__toast animate-fade-in">
          <div className="product-editor__toast-icon">✓</div>
          <span>Saree catalog updated successfully!</span>
        </div>
      )}
    </div>
  );
}
