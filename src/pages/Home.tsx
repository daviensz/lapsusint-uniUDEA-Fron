import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../context/AuthContext';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const HeroSection = styled.section`
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
  padding: 40px 0;
  @media (max-width: 768px) {
    min-height: 40vh;
    padding: 20px 0;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2.8rem;
  margin-bottom: 20px;
  color: white;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #ccc;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButton = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  padding: 15px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
  }
  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 1rem;
  }
`;

const ProductsSection = styled.section`
  padding: 60px 0 40px 0;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 10px;
  padding-right: 10px;
  @media (max-width: 768px) {
    padding: 30px 0 20px 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 40px;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%); 
    width: 100px;
    height: 3px;
    background: linear-gradient(45deg, #00ff9d, #00cc7e);
  }
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 25px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 20px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const AdminActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const AddProductButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
  &:hover {
    background: linear-gradient(45deg, #00cc7e, #00ff9d);
    box-shadow: 0 5px 15px rgba(0,255,157,0.2);
  }
`;

const SocialIcons = styled.div`
  margin-top: 25px;
  display: flex;
  gap: 18px;
  align-items: center;
  font-size: 2rem;
  justify-content: flex-start;
  @media (max-width: 480px) {
    justify-content: center;
    margin-top: 15px;
  }
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.9);
  padding: 40px 0 20px;
  margin-top: 60px;
  border-top: 1px solid rgba(0, 255, 157, 0.3);
  @media (max-width: 768px) {
    padding: 25px 0 10px;
    margin-top: 30px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ContactInfo = styled.div`
  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 20px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 2px;
      background: #00ff9d;
    }
  }
  p {
    color: #ccc;
    margin-bottom: 10px;
    font-size: 0.95rem;
  }
  a {
    color: #00ff9d;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Location = styled.div`
  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 20px;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 2px;
      background: #00ff9d;
    }
  }
  iframe {
    width: 100%;
    height: 200px;
    border-radius: 10px;
    border: 1px solid rgba(0, 255, 157, 0.3);
  }
`;

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'dev';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editProduct, setEditProduct] = useState<any | null>(null);

  // Notificaciones y confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      toast.error(t('error_loading_products'));
    }
    setLoading(false);
  };

  const handleAddProduct = () => {
    setModalMode('add');
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    console.log('=== EDIT PRODUCT DEBUG ===');
    console.log('Product to edit:', product);
    console.log('Product ID:', product.product_id || product.id);
    console.log('Product name:', product.name || product.product_name);
    
    if (!product.product_id && !product.id) {
      console.error('No product ID found!');
      toast.error('Error: No se pudo identificar el producto');
      return;
    }
    
    setModalMode('edit');
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    console.log('=== DELETE PRODUCT DEBUG ===');
    console.log('Product to delete:', product);
    console.log('Product ID:', product.product_id || product.id);
    console.log('Product name:', product.name || product.product_name);
    
    if (!product.product_id && !product.id) {
      console.error('No product ID found!');
      toast.error('Error: No se pudo identificar el producto');
      return;
    }
    
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    const deleteId = productToDelete.product_id || productToDelete.id;
    console.log('=== CONFIRM DELETE DEBUG ===');
    console.log('Deleting product with ID:', deleteId);
    console.log('Product name:', productToDelete.name || productToDelete.product_name);
    
    try {
      const response = await deleteProduct(token, deleteId);
      console.log('Delete response:', response);
      
      setProducts(products.filter((p) => (p.product_id || p.id) !== deleteId));
      toast.success(t('product_deleted'));
    } catch (error: any) {
      console.error('Error deleting product:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response
      });
      toast.error(t('error_deleting_product'));
    }
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleSubmit = async (data: any) => {
    console.log('=== SUBMIT PRODUCT DEBUG ===');
    console.log('Mode:', modalMode);
    console.log('Data:', data);
    
    try {
      if (modalMode === 'add') {
        console.log('Creating new product...');
        const newProduct = await createProduct(token, data);
        console.log('New product created:', newProduct);
        setProducts([...products, newProduct]);
        toast.success(t('product_added'));
      } else if (modalMode === 'edit') {
        const editId = editProduct.product_id || editProduct.id;
        console.log('Updating product with ID:', editId);
        console.log('Edit product data:', editProduct);
        console.log('Update data:', data);
        
        const updatedProduct = await updateProduct(token, editId, data);
        console.log('Product updated:', updatedProduct);
        
        setProducts(products.map((p) => (p.product_id || p.id) === editId ? updatedProduct : p));
        toast.success(t('product_updated'));
      }
      setModalOpen(false);
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        response: error?.response
      });
      toast.error(t('error_saving_product'));
    }
  };

  return (
    <>
      <HeroSection id="hero">
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t('hero_title')}
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('hero_subtitle')}
          </HeroSubtitle>
          <HeroButton
            href="#productos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('see_products')}
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <ProductsSection id="productos">
        <SectionTitle>{t('products')}</SectionTitle>
        {isAdmin && (
          <AdminActions>
            <AddProductButton onClick={handleAddProduct}>
              + {t('add_product')}
            </AddProductButton>
          </AdminActions>
        )}
        {loading ? (
          <div style={{ color: '#00ff9d', textAlign: 'center', margin: '40px 0' }}>
            {t('loading_products')}
          </div>
        ) : (
          <ProductGrid>
            {products.map((product, index) => (
              <motion.div
                key={product.product_id || product.id || `product-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </motion.div>
            ))}
          </ProductGrid>
        )}
      </ProductsSection>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editProduct}
        mode={modalMode}
      />

      <ConfirmModal
        open={confirmOpen}
        title={t('delete_product_title')}
        message={t('delete_product_message')}
        onConfirm={confirmDeleteProduct}
        onCancel={() => { setConfirmOpen(false); setProductToDelete(null); }}
      />

      <Footer id="contacto">
        <FooterContainer>
          <ContactInfo>
            <h3>{t('contact_us')}</h3>
            <p><strong>{t('support')}:</strong> <a href="mailto:Soporte@lapsusint.org">Soporte@lapsusint.org</a></p>
            <p><strong>{t('admin')}:</strong> <a href="mailto:Administracion@lapsusint.org">Administracion@lapsusint.org</a></p>
            <p><strong>{t('phones')}:</strong> 320-6231768 / 666-770-37</p>
            <SocialIcons>
              <a
                href="https://www.instagram.com/perfumeriayjj/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://x.com/perfumeriayjj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="https://facebook.com/perfumeriayjj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </SocialIcons>
          </ContactInfo>
          
          <Location>
            <h3>{t('our_location')}</h3>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.123456789012!2d-75.5000000!3d6.0000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4a1234567890ab%3A0x1234567890abcdef!2sCra.%2017%2C%20La%20Ceja%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1616161616161" 
              allowFullScreen 
              loading="lazy"
              title={t('location')}
            />
          </Location>
        </FooterContainer>
      </Footer>
    </>
  );
};

export default Home;