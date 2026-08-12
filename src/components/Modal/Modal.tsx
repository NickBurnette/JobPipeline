import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  // A side effect: subscribing to a browser-level keydown event and
  // locking page scroll. Neither of these is "rendering" — they're
  // interactions with the outside world — which is exactly what useEffect is for.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // prevent background scroll while open

    // Cleanup: runs when the modal unmounts. Without this, the keydown
    // listener would stick around forever, and scrolling would stay locked.
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the modal doesn't bubble up
          to the overlay's onClick and close it */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
