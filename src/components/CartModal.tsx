import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getImageUrl(image?: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/static')) return `http://localhost:8000${image}`;
  return `http://localhost:8000/static/${image.replace(/^\/?static\/?/, '')}`;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.95);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(0, 255, 157, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #00ff9d;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin: 0 0 20px 0;
  text-align: center;
`;

const CartItems = styled.div`
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 255, 157, 0.1);
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h4`
  color: white;
  margin: 0 0 5px 0;
  font-size: 1rem;
`;

const ItemKeyType = styled.div`
  color: #00ff9d;
  font-size: 0.95rem;
  margin-bottom: 2px;
`;

const ItemPrice = styled.p`
  color: #00ff9d;
  margin: 0;
  font-weight: bold;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityText = styled.span`
  color: white;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: rgba(255, 51, 102, 0.2);
  border: 1px solid rgba(255, 51, 102, 0.3);
  color: #ff3366;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 51, 102, 0.3);
  }
`;

const EmptyCart = styled.p`
  color: #ccc;
  text-align: center;
  font-style: italic;
  margin: 20px 0;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const PayButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
    background: linear-gradient(45deg, #00cc7e, #00ff9d);
  }
`;

const CartModal: React.FC = () => {
  const { t } = useTranslation();
  const { state: modalState, closeCartModal } = useModal();
  const { state: cartState, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Estado para expandir/cerrar descripción por producto
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});

  const handleClose = () => closeCartModal();
  const handleRemoveItem = (itemId: string) => removeFromCart(itemId);
  const handleClearCart = () => clearCart();
  const handlePay = () => {
    closeCartModal();
    navigate('/checkout');
  };
  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AnimatePresence>
      {modalState.isCartModalOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose}>&times;</CloseButton>
            <Title>🛒 {t('cart')}</Title>
            <CartItems>
              {cartState.items.length === 0 ? (
                <EmptyCart>{t('empty_cart')}</EmptyCart>
              ) : (
                cartState.items.map(item => {
                  const desc = item.product.description || '';
                  const shortDesc = desc.length > 60 ? desc.slice(0, 60) + '...' : desc;
                  const isExpanded = expanded[item.id];
                  return (
                    <CartItem key={item.id}>
                      <ItemImage src={getImageUrl(item.product.image_url || item.product.image)} alt={item.product.name || item.product.product_name} />
                      <ItemDetails>
                        <ItemTitle>{item.product.name || item.product.product_name}</ItemTitle>
                        {/* Descripción corta y botón mostrar más/menos */}
                        {desc && (
                          <div style={{ marginBottom: 4 }}>
                            {(isExpanded ? desc : shortDesc)
                              .split('\n')
                              .map((line, idx) => (
                                <span key={idx} style={{ color: '#ccc', fontSize: '0.92rem', display: 'block' }}>
                                  {line}
                                </span>
                              ))}
                            {desc.length > 60 && (
                              <button
                                onClick={() => toggleExpand(item.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#00ff9d',
                                  cursor: 'pointer',
                                  marginLeft: 8,
                                  fontSize: '0.92rem',
                                  textDecoration: 'underline',
                                  padding: 0
                                }}
                              >
                                {isExpanded ? t('show_less') : t('show_more')}
                              </button>
                            )}
                          </div>
                        )}
                        <ItemKeyType>{t('key_type')}: {t(item.product.keyType)}</ItemKeyType>
                        <ItemPrice>${item.product.keyPrice.toLocaleString('es-CO')}</ItemPrice>
                      </ItemDetails>
                      <ItemQuantity>
                        <QuantityText>{item.quantity}</QuantityText>
                      </ItemQuantity>
                      <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                        {t('remove')}
                      </RemoveButton>
                    </CartItem>
                  );
                })
              )}
            </CartItems>
            {cartState.items.length > 0 && (
              <ActionsRow>
                <RemoveButton onClick={handleClearCart}>{t('clear_cart')}</RemoveButton>
                <PayButton onClick={handlePay}>{t('pay')}</PayButton>
              </ActionsRow>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CartModal;