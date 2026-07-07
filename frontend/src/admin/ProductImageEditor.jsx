import { useState } from 'react';
import './ProductImageEditor.css';

export default function ProductImageEditor({ image, images, onChange }) {
  const [activeTab, setActiveTab] = useState(0); // 0 = Main Cover, 1-4 = Detail Angles
  const [dragging, setDragging] = useState(false);

  // Combine main image and details list into a single unified array of 5 slots
  const allImages = [
    image || '',
    images[0] || '',
    images[1] || '',
    images[2] || '',
    images[3] || '',
  ];

  const handleFileChange = (file, index) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      propagateChanges(base64String, index);
    };
    reader.readAsDataURL(file);
  };

  const propagateChanges = (val, index) => {
    const updatedAll = [...allImages];
    updatedAll[index] = val;

    // Split back into main image and details array
    const newMain = updatedAll[0];
    const newDetails = updatedAll.slice(1);

    onChange({
      image: newMain,
      images: newDetails,
    });
  };

  const clearImage = (index) => {
    propagateChanges('', index);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file, index);
  };

  const tabLabels = [
    'Main Cover',
    'Angle 1',
    'Angle 2',
    'Angle 3',
    'Angle 4',
  ];

  const activeImageUrl = allImages[activeTab];

  return (
    <div className="product-image-editor card-glow animate-fade-in">
      <label className="product-image-editor__title-label">
        Product Gallery Showcase (Max 5 Images)
      </label>

      {/* Tabs list */}
      <div className="product-image-editor__tabs">
        {tabLabels.map((label, idx) => (
          <button
            key={idx}
            type="button"
            className={`product-image-editor__tab ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="tab-indicator-dot"></span>
            <span>{label}</span>
            {allImages[idx] && <span className="tab-badge-uploaded">✓</span>}
          </button>
        ))}
      </div>

      {/* Active tab content editor */}
      <div className="product-image-editor__content-pane">
        <div 
          className={`product-image-editor__dropzone ${dragging ? 'dragging' : ''} ${activeImageUrl ? 'has-preview' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, activeTab)}
        >
          {activeImageUrl ? (
            <div className="product-image-editor__preview-container">
              <img src={activeImageUrl} alt={`Preview for ${tabLabels[activeTab]}`} />
              <div className="product-image-editor__preview-overlay">
                <span className="overlay-text">Drag & drop to replace</span>
                <button
                  type="button"
                  className="product-image-editor__clear-btn"
                  onClick={() => clearImage(activeTab)}
                  title="Clear Image"
                >
                  Remove File
                </button>
              </div>
            </div>
          ) : (
            <div className="product-image-editor__prompt animate-scale-in">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="prompt-header">Upload {tabLabels[activeTab]}</span>
              <span className="prompt-sub">Drag & drop file or click to choose</span>
              <span className="prompt-limit">Max size: 2MB</span>
              <input
                type="file"
                className="product-image-editor__file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0], activeTab)}
              />
            </div>
          )}
        </div>

        {/* Text fallback input */}
        <div className="product-image-editor__url-fallback">
          <label htmlFor={`image-url-${activeTab}`}>Or paste image URL link:</label>
          <input
            id={`image-url-${activeTab}`}
            type="text"
            className="product-image-editor__url-input"
            placeholder="e.g. /images/saree_detail.png"
            value={activeImageUrl.startsWith('data:') ? '' : activeImageUrl}
            onChange={(e) => propagateChanges(e.target.value, activeTab)}
          />
        </div>
      </div>
    </div>
  );
}
