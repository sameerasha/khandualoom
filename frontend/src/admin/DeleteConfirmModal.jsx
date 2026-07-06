import './DeleteConfirmModal.css';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName }) {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div 
        className="delete-modal animate-scale-in" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className="delete-modal__header">
          <div className="delete-modal__icon-wrap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 id="delete-modal-title" className="delete-modal__title">Confirm Deletion</h2>
        </div>
        
        <div className="delete-modal__body">
          <p>Are you sure you want to delete <strong>{productName}</strong>?</p>
          <p className="delete-modal__warning">This action is permanent and cannot be undone. It will remove this saree from the storefront catalog immediately.</p>
        </div>

        <div className="delete-modal__actions">
          <button 
            type="button"
            className="delete-modal__btn delete-modal__btn--cancel" 
            onClick={onClose}
            id="delete-modal-cancel"
          >
            Cancel
          </button>
          <button 
            type="button"
            className="delete-modal__btn delete-modal__btn--confirm" 
            onClick={onConfirm}
            id="delete-modal-confirm"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
