import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  margin: 20px 0;
`;

const Title = styled.h3`
  color: #00ff9d;
  font-size: 1.2rem;
  margin-bottom: 16px;
  text-align: center;
`;

const LicenseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const LicenseCard = styled(motion.div)<{ selected: boolean }>`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.selected ? '#00ff9d' : '#333'};
  background: ${props => props.selected ? 'rgba(0, 255, 157, 0.1)' : '#1a1a1a'};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    border-color: #00ff9d;
    background: rgba(0, 255, 157, 0.05);
  }
`;

const LicenseTitle = styled.h4`
  color: #00ff9d;
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: bold;
`;

const LicenseDescription = styled.p`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const LicensePrice = styled.div`
  color: #00ff9d;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
`;

const SelectedBadge = styled.div`
  background: #00ff9d;
  color: #000;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
`;

export enum LicenseType {
  ONE_WEEK = "one_week",
  ONE_MONTH = "one_month",
  THREE_MONTHS = "three_months",
  LIFETIME = "lifetime"
}

interface LicenseOption {
  type: LicenseType;
  labelKey: string;
  descriptionKey: string;
  price: number;
}

interface LicenseTypeSelectorProps {
  product: {
    name: string;
    price_one_week: number;
    price_one_month: number;
    price_three_months: number;
    price_lifetime: number;
  };
  selectedType: LicenseType;
  onTypeChange: (type: LicenseType) => void;
}

const LicenseTypeSelector: React.FC<LicenseTypeSelectorProps> = ({
  product,
  selectedType,
  onTypeChange
}) => {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const licenseOptions: LicenseOption[] = [
    {
      type: LicenseType.ONE_WEEK,
      labelKey: 'license_one_week',
      descriptionKey: 'license_one_week_desc',
      price: product.price_one_week
    },
    {
      type: LicenseType.ONE_MONTH,
      labelKey: 'license_one_month',
      descriptionKey: 'license_one_month_desc',
      price: product.price_one_month
    },
    {
      type: LicenseType.THREE_MONTHS,
      labelKey: 'license_three_months',
      descriptionKey: 'license_three_months_desc',
      price: product.price_three_months
    },
    {
      type: LicenseType.LIFETIME,
      labelKey: 'license_lifetime',
      descriptionKey: 'license_lifetime_desc',
      price: product.price_lifetime
    }
  ];

  return (
    <Container>
      <Title>{t('select_license_type', { product: product.name })}</Title>
      <LicenseGrid>
        {licenseOptions.map((option) => (
          <LicenseCard
            key={option.type}
            selected={selectedType === option.type}
            onClick={() => onTypeChange(option.type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LicenseTitle>{t(option.labelKey)}</LicenseTitle>
            <LicenseDescription>{t(option.descriptionKey)}</LicenseDescription>
            <LicensePrice>{formatPrice(option.price)}</LicensePrice>
            {selectedType === option.type && (
              <SelectedBadge>✓ {t('selected')}</SelectedBadge>
            )}
          </LicenseCard>
        ))}
      </LicenseGrid>
    </Container>
  );
};

export default LicenseTypeSelector;