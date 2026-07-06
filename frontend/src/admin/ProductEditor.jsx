import { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
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
  });

  const [imagePreview, setImagePreview] = useState('');
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
        });
        setImagePreview(product.image || '');
      } else {
        // Product not found, go back
        onNavigate('admin/products');
      }
    }
  }, [productId, isEditMode, getProduct, onNavigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Image Upload (convert to Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size should be less than 2MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: 'Failed to read file' }));
    };
    reader.readAsDataURL(file);
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
    if (!formData.fabric.trim()) newErrors.fabric = 'Fabric description is required (e.g. Pure Silk)';
    if (!formData.weave.trim()) newErrors.weave = 'Weave description is required (e.g. Handloom)';
    if (!formData.color.trim()) newErrors.color = 'Color description is required';
    if (!formData.image) newErrors.image = 'An image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
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

            {/* Right side Image Upload panel */}
            <div className="product-editor__form-sidebar">
              <div className="product-editor__group">
                <label className="product-editor__label">Product Image</label>
                
                <div className={`product-editor__image-upload-zone ${errors.image ? 'product-editor__image-upload-zone--error' : ''}`}>
                  {imagePreview ? (
                    <div className="product-editor__preview-wrap">
                      <img src={imagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="product-editor__remove-image"
                        onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setImagePreview(''); }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="product-editor__upload-prompt">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="product-editor__upload-text">Drag & drop or click to upload</span>
                      <span className="product-editor__upload-limit">Max size: 2MB</span>
                      <input
                        type="file"
                        className="product-editor__file-input"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="product-image-file"
                      />
                    </div>
                  )}
                </div>
                {errors.image && <span className="product-editor__error">{errors.image}</span>}
              </div>

              {/* URL fallback option for images */}
              <div className="product-editor__group">
                <label htmlFor="product-image-url" className="product-editor__label">Or Image URL (Fallback)</label>
                <input
                  type="text"
                  id="product-image-url"
                  name="image"
                  className="product-editor__input"
                  placeholder="e.g. /images/saree_green.png"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, image: val }));
                    setImagePreview(val);
                    if (errors.image && val) setErrors(prev => ({ ...prev, image: '' }));
                  }}
                />
              </div>
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
