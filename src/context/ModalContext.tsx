import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';

interface ModalState {
  isProductModalOpen: boolean;
  isCartModalOpen: boolean;
  selectedProduct?: Product;
}

interface ModalContextType {
  state: ModalState;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  openCartModal: () => void;
  closeCartModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ModalState>({ isProductModalOpen: false, isCartModalOpen: false });

  const openProductModal = (product: Product) =>
    setState((prev) => ({ ...prev, isProductModalOpen: true, selectedProduct: product }));
  const closeProductModal = () =>
    setState((prev) => ({ ...prev, isProductModalOpen: false, selectedProduct: undefined }));

  const openCartModal = () =>
    setState((prev) => ({ ...prev, isCartModalOpen: true }));
  const closeCartModal = () =>
    setState((prev) => ({ ...prev, isCartModalOpen: false }));

  return (
    <ModalContext.Provider
      value={{
        state,
        openProductModal,
        closeProductModal,
        openCartModal,
        closeCartModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};