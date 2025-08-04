import React, { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import paypalLogo from '../assets/paypal.png';
import mercadopagoLogo from '../assets/mercadopago.png';
import cardLogo from '../assets/card.png';
import stripeLogo from '../assets/stripe.png'; // Debes agregar stripe.png
import applepayLogo from '../assets/applepay.png'; // Debes agregar applepay.png
import googlepayLogo from '../assets/googlepay.png'; // Debes agregar googlepay.png
import skrillLogo from '../assets/skrill.png'; // Debes agregar skrill.png
import netellerLogo from '../assets/neteller.png'; // Debes agregar neteller.png
import amazonpayLogo from '../assets/amazonpay.png'; // Debes agregar amazonpay.png
import alipayLogo from '../assets/alipay.png'; // Debes agregar alipay.png
import wechatpayLogo from '../assets/wechatpay.png'; // Debes agregar wechatpay.png

const Container = styled.div`
  min-height: 100vh;
  background: transparent;
  padding: 40px 20px;
`;

const Content = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #00ff9d;
  font-size: 2.2rem;
  margin-bottom: 24px;
  text-align: center;
`;

const Card = styled.div`
  background: rgba(24, 24, 24, 0.7);
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1.5px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.08);
  backdrop-filter: blur(2px);
`;

const ProductItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px;
  background: rgba(26, 26, 26, 0.7);
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid rgba(0, 255, 157, 0.15);
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  flex: 1;
`;

const ProductName = styled.h3`
  color: #00ff9d;
  font-size: 1.1rem;
  margin-bottom: 6px;
`;

const ProductInfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 4px;
`;

const InfoLabel = styled.span`
  color: #ccc;
  font-size: 0.95rem;
`;

const Quantity = styled.span`
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  margin-left: 8px;
`;

const Price = styled.div`
  color: #00ff9d;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 6px;
`;

const LicenseButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 0 0;
  max-width: 100%;
`;

const LicenseButton = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? 'rgba(0,255,157,0.15)' : 'rgba(255,255,255,0.05)')};
  border: 2px solid ${({ selected }) => (selected ? '#00ff9d' : '#333')};
  color: ${({ selected }) => (selected ? '#00ff9d' : '#fff')};
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.95rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  min-width: 100px;
  max-width: 100%;
  white-space: nowrap;
  &:hover {
    border-color: #00ff9d;
    background: rgba(0,255,157,0.08);
    color: #00ff9d;
  }
`;

const ShowMoreButton = styled.button`
  background: none;
  border: none;
  color: #00ff9d;
  cursor: pointer;
  font-size: 0.95rem;
  margin: 0;
  padding: 0;
  text-decoration: underline;
`;

const DescriptionModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescriptionModalContent = styled.div`
  background: rgba(24, 24, 24, 0.95);
  border-radius: 16px;
  padding: 32px 24px;
  max-width: 400px;
  color: #fff;
  border: 2px solid #00ff9d;
  box-shadow: 0 8px 32px rgba(0,255,157,0.12);
  position: relative;
`;

const CloseDescButton = styled.button`
  position: absolute;
  top: 10px; right: 14px;
  background: none;
  border: none;
  color: #00ff9d;
  font-size: 1.5rem;
  cursor: pointer;
`;

const EmptyCart = styled.p`
  color: #ccc;
  text-align: center;
  font-style: italic;
  margin: 20px 0;
`;

const PayButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 14px 0;
  border-radius: 14px;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 18px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
    background: linear-gradient(45deg, #00cc7e, #00ff9d);
  }
`;

const PaymentMethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px 18px;
  margin: 28px 0 18px 0;
  justify-items: center;
  align-items: stretch;
  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 14px 8px;
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

const PaymentButton = styled.button<{ selected: boolean }>`
  background: ${({ selected }) => (selected ? 'rgba(0,255,157,0.18)' : 'rgba(255,255,255,0.03)')};
  border: 2px solid ${({ selected }) => (selected ? '#00ff9d' : 'rgba(0,255,157,0.13)')};
  border-radius: 12px;
  padding: 12px 4px 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.18s;
  box-shadow: ${({ selected }) => (selected ? '0 0 10px #00ff9d33' : 'none')};
  outline: none;
  min-width: 90px;
  max-width: 120px;
  min-height: 80px;
  &:hover {
    border-color: #00ff9d;
    background: rgba(0,255,157,0.09);
  }
`;

const PaymentLogo = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-bottom: 6px;
`;

const PaymentName = styled.span`
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  word-break: break-word;
`;

const CardFormContainer = styled.div`
  background: rgba(0,255,157,0.07);
  border: 1px solid #00ff9d33;
  border-radius: 10px;
  padding: 12px 10px 8px 10px;
  margin: 0 0 14px 0;
  box-shadow: 0 1px 4px rgba(0,255,157,0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
  width: 100%;
  box-sizing: border-box;
`;

const CardInput = styled.input`
  background: #181818;
  border: 1px solid #00ff9d33;
  border-radius: 7px;
  color: #fff;
  padding: 7px 10px;
  font-size: 0.98rem;
  outline: none;
  transition: border 0.18s;
  height: 34px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    border-color: #00ff9d;
  }
`;

const CardLabel = styled.label`
  color: #00ff9d;
  font-size: 0.93rem;
  margin-bottom: 1px;
`;

const ErrorMsg = styled.div`
  color: #ff3366;
  font-size: 0.98rem;
  margin-bottom: 8px;
`;

function getImageUrl(image?: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/static')) return `http://localhost:8000${image}`;
  return `http://localhost:8000/static/${image.replace(/^\/?static\/?/, '')}`;
}

function getPriceByType(product: any, type: string) {
  if (!product) return 0;
  
  console.log('=== CHECKOUT PRICE DEBUG ===');
  console.log('Product:', product);
  console.log('Type:', type);
  
  // Obtener el precio específico del tipo de licencia
  let price = 0;
  switch (type) {
    case 'one_week': 
      price = product.price_one_week || 0; 
      break;
    case 'one_month': 
      price = product.price_one_month || 0; 
      break;
    case 'three_months': 
      price = product.price_three_months || 0; 
      break;
    case 'lifetime': 
      price = product.price_lifetime || 0; 
      break;
    default: 
      price = product.price_one_month || product.price || 0; 
      break;
  }
  
  console.log('Price for type', type, ':', price);
  
  // Si no hay precio específico, usar el precio base
  if (!price || price <= 0) {
    price = product.price || 0;
    console.log('Using base price:', price);
  }
  
  return price;
}

const licenseOptions = [
  { key: 'one_week', labelKey: 'license_one_week' },
  { key: 'one_month', labelKey: 'license_one_month' },
  { key: 'three_months', labelKey: 'license_three_months' },
  { key: 'lifetime', labelKey: 'license_lifetime' },
];

const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  const { token } = useAuth();
  // Inicializar selectedLicenses con el keyType guardado en el carrito
  const [selectedLicenses, setSelectedLicenses] = useState<{ [key: string]: string }>(
    Object.fromEntries(cartState.items.map(item => [item.id, item.product.keyType]))
  );
  const [showDesc, setShowDesc] = useState<{ [key: string]: boolean }>({});
  const [paying, setPaying] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card'); // Por defecto PayPal
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  });
  const [cardError, setCardError] = useState('');

  // Declarar paymentMethods aquí para que esté en el scope
  const paymentMethods = [
    { key: 'paypal', name: 'PayPal', logo: paypalLogo },
    { key: 'stripe', name: 'Stripe', logo: stripeLogo },
    { key: 'mercadopago', name: 'MercadoPago', logo: mercadopagoLogo },
    { key: 'applepay', name: 'Apple Pay', logo: applepayLogo },
    { key: 'googlepay', name: 'Google Pay', logo: googlepayLogo },
    { key: 'skrill', name: 'Skrill', logo: skrillLogo },
    { key: 'neteller', name: 'Neteller', logo: netellerLogo },
    { key: 'amazonpay', name: 'Amazon Pay', logo: amazonpayLogo },
    { key: 'alipay', name: 'Alipay', logo: alipayLogo },
    { key: 'wechatpay', name: 'WeChat Pay', logo: wechatpayLogo },
    { key: 'card', name: t('card'), logo: cardLogo },
  ];

  const handlePay = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setCardError('');
      
      if (!token) {
        alert('Debes iniciar sesión para realizar la compra');
        navigate('/login');
        return;
      }

      if (selectedPayment === 'card') {
        // Validación básica
        if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
          setCardError('Por favor completa todos los campos de la tarjeta.');
          return;
        }
        if (cardData.number.replace(/\s/g, '').length < 13) {
          setCardError('El número de tarjeta no es válido.');
          return;
        }
        if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
          setCardError('La fecha de vencimiento debe tener el formato MM/AA.');
          return;
        }
        if (cardData.cvv.length < 3) {
          setCardError('El CVV debe tener al menos 3 dígitos.');
          return;
        }
      }

      setPaying(true);

      // Validar que hay productos en el carrito
      if (!cartState.items || cartState.items.length === 0) {
        throw new Error('No hay productos en el carrito');
      }

      console.log('=== INICIANDO PROCESO DE PAGO ===');
      console.log('Cart state:', cartState);
      console.log('Selected licenses:', selectedLicenses);
      console.log('Token present:', !!token);

      // Probar conectividad con el backend
      console.log('Probando conectividad con el backend...');
      try {
        const testResponse = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/debug/test-checkout`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('Backend connectivity test successful:', testData);
        } else {
          console.warn('Backend connectivity test failed:', testResponse.status);
        }
      } catch (testError) {
        console.warn('Backend connectivity test error:', testError);
      }

      // Crear orden para cada producto en el carrito
      for (const item of cartState.items) {
        // Validar que el item tiene los datos necesarios
        if (!item || !item.product) {
          throw new Error('Datos del producto inválidos');
        }

        const licenseType = selectedLicenses[item.id] || item.product.keyType;
        const price = getPriceByType(item.product, licenseType);

        console.log('=== PROCESANDO ITEM ===');
        console.log('Item:', item);
        console.log('License type:', licenseType);
        console.log('Price:', price);
        console.log('Product ID:', item.product.product_id || item.product.id);

        // Validar que tenemos un precio válido
        if (!price || price <= 0) {
          throw new Error(`Precio inválido para el producto: ${item.product.name || item.product.product_name}`);
        }

        const orderData = {
          product_id: item.product.product_id || item.product.id,
          quantity: item.quantity || 1,
          total_amount: price * (item.quantity || 1),
          payment_method_id: selectedPayment
        };

        console.log('Order data to send:', orderData);

        // Crear la orden
        console.log('Enviando petición para crear orden...');
        const orderResponse = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/licenses/orders`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
          }
        );

        console.log('Respuesta de creación de orden:', {
          status: orderResponse.status,
          ok: orderResponse.ok,
          statusText: orderResponse.statusText
        });

        let order;
        try {
          order = await orderResponse.json();
          console.log('Datos de la orden:', order);
        } catch (e) {
          console.error('Error parseando respuesta de orden:', e);
          const errorText = await orderResponse.text();
          console.error('Error text:', errorText);
          throw new Error(`Error al crear la orden: ${errorText}`);
        }

        if (!orderResponse.ok) {
          console.error('Error en creación de orden:', order);
          throw new Error(order.detail || 'Error al crear la orden');
        }

        console.log('Orden creada exitosamente, completando compra...');

        // Completar la compra y generar licencia
        console.log('Enviando petición para completar orden...');
        const completeResponse = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/licenses/orders/${order.order_id}/complete`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Respuesta de completar compra:', {
          status: completeResponse.status,
          ok: completeResponse.ok,
          statusText: completeResponse.statusText
        });

        let purchaseData;
        try {
          purchaseData = await completeResponse.json();
          console.log('Datos de la compra completada:', purchaseData);
        } catch (e) {
          console.error('Error parseando respuesta de compra:', e);
          const errorText = await completeResponse.text();
          console.error('Error text:', errorText);
          throw new Error(`Error al completar la compra: ${errorText}`);
        }

        if (!completeResponse.ok) {
          console.error('Error en completar compra:', purchaseData);
          throw new Error(purchaseData.detail || 'Error al completar la compra');
        }

        console.log('Compra completada exitosamente, redirigiendo...');

        // Redirigir a la página de descarga con la primera orden
        if (cartState.items.indexOf(item) === 0) {
          clearCart();
          navigate(`/download/${order.order_id}`);
          return;
        }
      }

      // Si llegamos aquí, limpiar carrito y mostrar mensaje
      clearCart();
      alert(t('payment_success'));
      navigate('/');

    } catch (error: any) {
      console.error('Error en el proceso de pago:', error);
      
      // Manejo robusto de errores
      let errorMessage = 'Error al procesar el pago. Por favor intenta de nuevo.';
      
      try {
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error && typeof error === 'object') {
          // Intentar extraer mensaje de error de diferentes propiedades
          if (error.detail) {
            errorMessage = String(error.detail);
          } else if (error.message) {
            errorMessage = String(error.message);
          } else if (error.error) {
            errorMessage = String(error.error);
          } else if (error.status) {
            errorMessage = `Error ${error.status}: ${error.statusText || 'Error del servidor'}`;
          } else {
            // Si es un objeto complejo, intentar serializarlo
            const errorStr = JSON.stringify(error, null, 2);
            if (errorStr && errorStr !== '{}') {
              errorMessage = `Error del servidor: ${errorStr.substring(0, 200)}...`;
            } else {
              errorMessage = 'Error desconocido en el proceso de pago';
            }
          }
        }
      } catch (parseError) {
        console.error('Error parseando el error:', parseError);
        errorMessage = 'Error al procesar el pago. Por favor intenta de nuevo.';
      }
      
      console.error('Mensaje de error final:', errorMessage);
      
      // Mostrar error de manera más amigable
      alert(`Error en el pago:\n\n${errorMessage}\n\nPor favor verifica los datos e intenta de nuevo.`);
      setPaying(false);
    }
  };

  const total = cartState.items.reduce(
    (sum: number, item: any) => {
      const licenseType = selectedLicenses[item.id] || item.product.keyType;
      const price = getPriceByType(item.product, licenseType);
      return sum + (price * item.quantity);
    },
    0
  );

  return (
    <Container>
      <Content>
        <Title>{t('checkout')}</Title>
        <Card>
          {cartState.items.length === 0 ? (
            <EmptyCart>{t('empty_cart')}</EmptyCart>
          ) : (
            <form onSubmit={handlePay}>
              {cartState.items.map(item => {
                const type = selectedLicenses[item.id] || item.product.keyType;
                const price = getPriceByType(item.product, type);
                return (
                  <ProductItem key={item.id}>
                    <ProductImage src={getImageUrl(item.product.image_url || item.product.image)} alt={item.product.name || item.product.product_name} />
                    <ProductDetails>
                      <ProductName>{item.product.name || item.product.product_name}</ProductName>
                      <ProductInfoRow>
                        <InfoLabel>{t('type_license')}: </InfoLabel>
                        <LicenseButtonGroup>
                          {licenseOptions.map(opt => (
                            <LicenseButton
                              key={opt.key}
                              selected={type === opt.key}
                              onClick={() => setSelectedLicenses(prev => ({ ...prev, [item.id]: opt.key }))}
                              type="button"
                            >
                              {t(opt.labelKey)}
                            </LicenseButton>
                          ))}
                        </LicenseButtonGroup>
                        <InfoLabel>{t('quantity')}:</InfoLabel>
                        <Quantity>{item.quantity}</Quantity>
                      </ProductInfoRow>
                      <ShowMoreButton onClick={() => setShowDesc(prev => ({ ...prev, [item.id]: true }))}>
                        {t('show_more')}
                      </ShowMoreButton>
                      <Price>${price.toLocaleString('es-CO')}</Price>
                      {showDesc[item.id] && (
                        <DescriptionModalOverlay>
                          <DescriptionModalContent>
                            <CloseDescButton onClick={() => setShowDesc(prev => ({ ...prev, [item.id]: false }))}>
                              &times;
                            </CloseDescButton>
                            <h3 style={{ color: '#00ff9d', marginBottom: 12 }}>{t('full_description')}</h3>
                            <div style={{ color: '#fff', whiteSpace: 'pre-line' }}>
                              {item.product.description || item.product.details}
                            </div>
                          </DescriptionModalContent>
                        </DescriptionModalOverlay>
                      )}
                    </ProductDetails>
                  </ProductItem>
                );
              })}
              <Price style={{ textAlign: 'right', fontSize: '1.3rem' }}>
                {t('total')}: ${total.toLocaleString('es-CO')}
              </Price>
              <PaymentMethodsGrid>
                {paymentMethods.map((method: any) => (
                  <PaymentButton
                    key={method.key}
                    type="button"
                    selected={selectedPayment === method.key}
                    onClick={() => {
                      if (method.key === 'card') {
                        setShowCardForm((prev) => selectedPayment === 'card' ? !prev : true);
                        setSelectedPayment('card');
                      } else {
                        setSelectedPayment(method.key);
                        setShowCardForm(false);
                      }
                    }}
                    aria-label={method.name}
                  >
                    <PaymentLogo src={method.logo} alt={method.name} />
                    <PaymentName>{method.name}</PaymentName>
                  </PaymentButton>
                ))}
              </PaymentMethodsGrid>
              {showCardForm && selectedPayment === 'card' && (
                <CardFormContainer>
                  {cardError && <ErrorMsg>{cardError}</ErrorMsg>}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 4, width: '100%' }}>
                    <div style={{ flex: 1, width: '100%' }}>
                      <CardLabel htmlFor="cardName">{t('card_name')}</CardLabel>
                      <CardInput
                        id="cardName"
                        type="text"
                        placeholder={t('card_name_placeholder')}
                        value={cardData.name}
                        onChange={e => setCardData({ ...cardData, name: e.target.value })}
                        autoComplete="cc-name"
                      />
                    </div>
                    <div style={{ flex: 1, width: '100%' }}>
                      <CardLabel htmlFor="cardNumber">{t('card_number')}</CardLabel>
                      <CardInput
                        id="cardNumber"
                        type="text"
                        placeholder={t('card_number_placeholder')}
                        value={cardData.number}
                        onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/[^0-9 ]/g, '') })}
                        maxLength={19}
                        autoComplete="cc-number"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    <div style={{ flex: 1, width: '100%' }}>
                      <CardLabel htmlFor="cardExpiry">{t('card_expiry')}</CardLabel>
                      <CardInput
                        id="cardExpiry"
                        type="text"
                        placeholder={t('card_expiry_placeholder')}
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: e.target.value.replace(/[^0-9/]/g, '') })}
                        maxLength={5}
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div style={{ flex: 1, width: '100%' }}>
                      <CardLabel htmlFor="cardCVV">{t('card_cvv')}</CardLabel>
                      <CardInput
                        id="cardCVV"
                        type="text"
                        placeholder={t('card_cvv_placeholder')}
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                        maxLength={4}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </CardFormContainer>
              )}
              <PayButton type="submit" disabled={paying}>
                {paying ? t('processing') : t('pay')}
              </PayButton>
            </form>
          )}
        </Card>
      </Content>
    </Container>
  );
};

export default Checkout;