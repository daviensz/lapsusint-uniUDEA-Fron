import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  min-width: 340px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #00ff9d33;
  background: #222;
  color: #fff;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #00ff9d33;
  background: #222;
  color: #fff;
  font-size: 1rem;
  min-height: 70px;
`;

const PriceSection = styled.div`
  border: 1px solid #00ff9d33;
  border-radius: 8px;
  padding: 16px;
  background: #1a1a1a;
`;

const PriceSectionTitle = styled.h3`
  color: #00ff9d;
  margin-bottom: 12px;
  font-size: 1rem;
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const PriceInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceLabel = styled.label`
  color: #ccc;
  font-size: 0.9rem;
`;

const PriceInputField = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #00ff9d33;
  background: #222;
  color: #fff;
  font-size: 0.9rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: string }>`
  background: ${({ variant }) => variant === 'cancel' ? '#333' : 'linear-gradient(45deg, #00ff9d, #00cc7e)'};
  color: ${({ variant }) => variant === 'cancel' ? '#fff' : '#111'};
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    opacity: 0.9;
  }
`;

interface ProductFormData {
  name: string;
  price: number;
  short_description: string;
  details: string;
  requirements: string;
  version: string;
  platform: string;
  description: string;  // (Legacy)
  price_one_week: number;
  price_one_month: number;
  price_three_months: number;
  price_lifetime: number;
  image?: File | null;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: {
    name: string;
    price: number;
    short_description?: string;
    details?: string;
    requirements?: string;
    version?: string;
    platform?: string;
    description?: string;  // (Legacy)
    price_one_week?: number;
    price_one_month?: number;
    price_three_months?: number;
    price_lifetime?: number;
    image?: string;
  };
  mode: 'add' | 'edit';
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open, onClose, onSubmit, initialData, mode
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || '');
  const [details, setDetails] = useState(initialData?.details || '');
  const [requirements, setRequirements] = useState(initialData?.requirements || '');
  const [version, setVersion] = useState(initialData?.version || '');
  const [platform, setPlatform] = useState(initialData?.platform || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priceOneWeek, setPriceOneWeek] = useState(initialData?.price_one_week?.toString() || '');
  const [priceOneMonth, setPriceOneMonth] = useState(initialData?.price_one_month?.toString() || '');
  const [priceThreeMonths, setPriceThreeMonths] = useState(initialData?.price_three_months?.toString() || '');
  const [priceLifetime, setPriceLifetime] = useState(initialData?.price_lifetime?.toString() || '');
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (open && initialData && mode === 'edit') {
      console.log('=== INITIALIZING EDIT MODE ===');
      console.log('Initial data:', initialData);
      
      setName(initialData.name || '');
      setPrice(initialData.price?.toString() || '');
      setShortDescription(initialData.short_description || '');
      setDetails(initialData.details || '');
      setRequirements(initialData.requirements || '');
      setVersion(initialData.version || '');
      setPlatform(initialData.platform || '');
      setDescription(initialData.description || '');
      setPriceOneWeek(initialData.price_one_week?.toString() || '');
      setPriceOneMonth(initialData.price_one_month?.toString() || '');
      setPriceThreeMonths(initialData.price_three_months?.toString() || '');
      setPriceLifetime(initialData.price_lifetime?.toString() || '');
      setImage(null);
      setFileName(initialData.image || "");
      
      console.log('Form initialized with:', {
        name: initialData.name,
        price: initialData.price,
        price_one_week: initialData.price_one_week,
        price_one_month: initialData.price_one_month,
        price_three_months: initialData.price_three_months,
        price_lifetime: initialData.price_lifetime
      });
    } else if (open && mode === 'add') {
      console.log('=== INITIALIZING ADD MODE ===');
      setName('');
      setPrice('');
      setShortDescription('');
      setDetails('');
      setRequirements('');
      setVersion('');
      setPlatform('');
      setDescription('');
      setPriceOneWeek('');
      setPriceOneMonth('');
      setPriceThreeMonths('');
      setPriceLifetime('');
      setImage(null);
      setFileName("");
    }
  }, [open, initialData, mode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    setFileName(file ? file.name : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    
    console.log('=== SUBMITTING FORM ===');
    console.log('Mode:', mode);
    console.log('Form data:', {
      name,
      price: Number(price),
      short_description: shortDescription,
      details,
      requirements,
      version,
      platform,
      description,
      price_one_week: Number(priceOneWeek) || 0,
      price_one_month: Number(priceOneMonth) || 0,
      price_three_months: Number(priceThreeMonths) || 0,
      price_lifetime: Number(priceLifetime) || 0,
      image
    });
    
    onSubmit({
      name,
      price: Number(price),
      short_description: shortDescription,
      details,
      requirements,
      version,
      platform,
      description,
      price_one_week: Number(priceOneWeek) || 0,
      price_one_month: Number(priceOneMonth) || 0,
      price_three_months: Number(priceThreeMonths) || 0,
      price_lifetime: Number(priceLifetime) || 0,
      image
    });
  };

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
          <Title>{mode === 'add' ? t('add_product') : t('edit_product')}</Title>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder={t('product_name')}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder={t('base_price')}
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              min={0}
            />
            <Input
              type="text"
              placeholder={t('short_description')}
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
            />
            <TextArea
              placeholder={t('details')}
              value={details}
              onChange={e => setDetails(e.target.value)}
            />
            <TextArea
              placeholder={t('requirements')}
              value={requirements}
              onChange={e => setRequirements(e.target.value)}
            />
            <Input
              type="text"
              placeholder={t('version')}
              value={version}
              onChange={e => setVersion(e.target.value)}
            />
            <Input
              type="text"
              placeholder={t('platform')}
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            />
            <TextArea
              placeholder={t('description')}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <PriceSection>
              <PriceSectionTitle>{t('prices_by_license_type')}</PriceSectionTitle>
              <PriceGrid>
                <PriceInput>
                  <PriceLabel>{t('one_week')}</PriceLabel>
                  <PriceInputField
                    type="number"
                    placeholder="0"
                    value={priceOneWeek}
                    onChange={e => setPriceOneWeek(e.target.value)}
                    min={0}
                  />
                </PriceInput>
                <PriceInput>
                  <PriceLabel>{t('one_month')}</PriceLabel>
                  <PriceInputField
                    type="number"
                    placeholder="0"
                    value={priceOneMonth}
                    onChange={e => setPriceOneMonth(e.target.value)}
                    min={0}
                  />
                </PriceInput>
                <PriceInput>
                  <PriceLabel>{t('three_months')}</PriceLabel>
                  <PriceInputField
                    type="number"
                    placeholder="0"
                    value={priceThreeMonths}
                    onChange={e => setPriceThreeMonths(e.target.value)}
                    min={0}
                  />
                </PriceInput>
                <PriceInput>
                  <PriceLabel>{t('lifetime')}</PriceLabel>
                  <PriceInputField
                    type="number"
                    placeholder="0"
                    value={priceLifetime}
                    onChange={e => setPriceLifetime(e.target.value)}
                    min={0}
                  />
                </PriceInput>
              </PriceGrid>
            </PriceSection>
            <div style={{ marginBottom: 12 }}>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="product-image" style={{ cursor: "pointer" }}>
                <Button as="span" style={{ marginRight: 12 }}>
                  {t('select_file')}
                </Button>
                <span style={{ color: "#fff" }}>
                  {fileName || t('no_file_selected')}
                </span>
              </label>
            </div>
            <ButtonRow>
              <Button type="button" variant="cancel" onClick={onClose}>{t('cancel')}</Button>
              <Button type="submit">{mode === 'add' ? t('add') : t('save_changes')}</Button>
            </ButtonRow>
          </Form>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default ProductFormModal;