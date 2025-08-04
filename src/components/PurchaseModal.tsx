import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import LicenseTypeSelector, { LicenseType } from './LicenseTypeSelector';
import { useTranslation } from 'react-i18next';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)`
  background: #181818;
  border-radius: 18px;
  padding: 32px 24px;
  min-width: 400px;
  max-width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.08);
`;

const Title = styled.h2`
  color: #00ff9d;
  margin-bottom: 18px;
  text-align: center;
`;

const ProductInfo = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #00ff9d33;
`;

const ProductName = styled.h3`
  color: #00ff9d;
  font-size: 1.2rem;
  margin-bottom: 8px;
`;

const ProductDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const PaymentSection = styled.div`
  margin-top: 20px;
`;

const PaymentTitle = styled.h3`
  color: #00ff9d;
  font-size: 1.1rem;
  margin-bottom: 12px;
`;

const PaymentMethod = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #00ff9d33;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 255, 157, 0.1);
  }
`;

const PaymentIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PaymentName = styled.div`
  color: #fff;
  font-weight: bold;
`;

const PaymentDescription = styled.div`
  color: #ccc;
  font-size: 0.8rem;
`;

const TotalSection = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid #00ff9d33;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const TotalLabel = styled.span`
  color: #ccc;
`;

const TotalValue = styled.span`
  color: #00ff9d;
  font-weight: bold;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: string }>`
  background: ${({ variant }) => variant === 'cancel' ? '#333' : 'linear-gradient(45deg, #00ff9d, #00cc7e)'};
  color: ${({ variant }) => variant === 'cancel' ? '#fff' : '#111'};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    opacity: 0.9;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.3);
  border-radius: 50%;
  border-top-color: #00ff9d;
  animation: spin 1s ease-in-out infinite;
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    description: string;
    image: string;
    price_one_week: number;
    price_one_month: number;
    price_three_months: number;
    price_lifetime: number;
    product_id?: number; // Added product_id to the interface
  };
  onPurchase: (orderData: {
    product_id: number;
    license_type: LicenseType;
    amount: number;
    payment_method: string;
  }) => Promise<void>;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  open,
  onClose,
  product,
  onPurchase
}) => {
  const { t } = useTranslation();
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType>(LicenseType.ONE_MONTH);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('mercadopago');
  const [isLoading, setIsLoading] = useState(false);

  const getPriceByLicenseType = (type: LicenseType): number => {
    switch (type) {
      case LicenseType.ONE_WEEK:
        return product.price_one_week;
      case LicenseType.ONE_MONTH:
        return product.price_one_month;
      case LicenseType.THREE_MONTHS:
        return product.price_three_months;
      case LicenseType.LIFETIME:
        return product.price_lifetime;
      default:
        return product.price_one_month;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      await onPurchase({
        product_id: product.product_id || product.id,
        license_type: selectedLicenseType,
        amount: getPriceByLicenseType(selectedLicenseType),
        payment_method: selectedPaymentMethod
      });
    } catch (error) {
      // Puedes mostrar un toast de error aquí si lo deseas
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: 'mercadopago',
      name: t('mercadopago'),
      description: t('mercadopago_desc'),
      icon: '/mercadopago.png'
    },
    {
      id: 'nequi',
      name: t('nequi'),
      description: t('nequi_desc'),
      icon: '/nequi.png'
    },
    {
      id: 'pse',
      name: t('pse'),
      description: t('pse_desc'),
      icon: '/pse.png'
    }
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <Title>{t('buy')} {product.name}</Title>
          <ProductInfo>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
          </ProductInfo>
          <LicenseTypeSelector
            product={product}
            selectedType={selectedLicenseType}
            onTypeChange={setSelectedLicenseType}
          />
          <PaymentSection>
            <PaymentTitle>{t('payment_method')}</PaymentTitle>
            {paymentMethods.map((method) => (
              <PaymentMethod
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                style={{
                  borderColor: selectedPaymentMethod === method.id ? '#00ff9d' : '#00ff9d33'
                }}
              >
                <PaymentIcon src={method.icon} alt={method.name} />
                <PaymentInfo>
                  <PaymentName>{method.name}</PaymentName>
                  <PaymentDescription>{method.description}</PaymentDescription>
                </PaymentInfo>
              </PaymentMethod>
            ))}
          </PaymentSection>
          <TotalSection>
            <TotalRow>
              <TotalLabel>{t('license_price')}:</TotalLabel>
              <TotalValue>{formatPrice(getPriceByLicenseType(selectedLicenseType))}</TotalValue>
            </TotalRow>
            <TotalRow>
              <TotalLabel>{t('total_to_pay')}:</TotalLabel>
              <TotalValue>{formatPrice(getPriceByLicenseType(selectedLicenseType))}</TotalValue>
            </TotalRow>
          </TotalSection>
          <ButtonRow>
            <Button type="button" variant="cancel" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button 
              type="button" 
              onClick={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  {t('processing')}
                </>
              ) : (
                `${t('buy_for')} ${formatPrice(getPriceByLicenseType(selectedLicenseType))}`
              )}
            </Button>
          </ButtonRow>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default PurchaseModal;