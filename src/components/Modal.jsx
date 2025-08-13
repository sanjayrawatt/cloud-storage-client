// src/components/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, children, modalClassName = '' }) => {
  if (!isOpen) return null;

  // This function prevents the modal from closing when you click inside it
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // The base classes for the modal content panel
  const baseClasses = 'relative p-6 rounded-2xl shadow-xl m-4 max-w-lg w-full';
  
  // This is the key: it combines the base styles with our new themed class
  const combinedClasses = `${baseClasses} ${modalClassName}`;

  return (
    // This is the dark, blurry backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md"
      onClick={onClose} // Close the modal if the user clicks the backdrop
    >
      {/* This is the main modal panel */}
      <div 
        className={combinedClasses}
        onClick={handleContentClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
