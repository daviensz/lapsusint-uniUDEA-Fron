import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: #181818;
  border-radius: 16px;
  padding: 32px 24px;
  max-width: 350px;
  color: #fff;
  border: 2px solid #00ff9d;
  box-shadow: 0 8px 32px rgba(0,255,157,0.12);
  text-align: center;
`;

const Title = styled.h3`
  color: #00ff9d;
  margin-bottom: 18px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled.button<{ danger?: boolean }>`
  background: ${({ danger }) => (danger ? '#ff3366' : 'linear-gradient(45deg, #00ff9d, #00cc7e)')};
  color: ${({ danger }) => (danger ? '#fff' : '#000')};
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  
  if (!open) return null;
  
  return (
    <Overlay>
      <Modal>
        <Title>{title || t('confirm_action')}</Title>
        <div>{message}</div>
        <ButtonRow>
          <Button onClick={onCancel}>{t('cancel')}</Button>
          <Button danger onClick={onConfirm}>{t('confirm')}</Button>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default ConfirmModal;