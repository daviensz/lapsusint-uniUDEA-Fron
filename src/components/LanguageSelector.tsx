import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import esFlag from '../assets/es.png';
import enFlag from '../assets/en.png';
import frFlag from '../assets/fr.png';
import deFlag from '../assets/de.png';

const languages = [
  { code: 'es', label: 'Español', flag: esFlag },
  { code: 'en', label: 'English', flag: enFlag },
  { code: 'fr', label: 'Français', flag: frFlag },
  { code: 'de', label: 'Deutsch', flag: deFlag }
];

const SelectorContainer = styled.div`
  position: relative;
  margin-left: 12px;
`;

const SelectorButton = styled.button`
  background: rgba(0,255,157,0.15);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
  &:hover {
    background: rgba(0,255,157,0.25);
  }
`;

const FlagImg = styled.img`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 110%;
  right: 0;
  background: #181818;
  border: 1px solid rgba(0,255,157,0.2);
  border-radius: 12px;
  min-width: 140px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  z-index: 100;
  padding: 8px 0;
  margin: 0;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 8px 18px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  transition: background 0.2s;
  &:hover {
    background: rgba(0,255,157,0.08);
    color: #00ff9d;
  }
`;

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find(l => l.code === i18n.language) || languages[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lng', code);
    setOpen(false);
  };

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <SelectorContainer ref={ref}>
      <SelectorButton type="button" onClick={() => setOpen(o => !o)} aria-label="Seleccionar idioma">
        <FlagImg src={current.flag} alt={current.label} />
      </SelectorButton>
      {open && (
        <Dropdown>
          {languages.map(lang => (
            <DropdownItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                fontWeight: lang.code === i18n.language ? 'bold' : 'normal',
                color: lang.code === i18n.language ? '#00ff9d' : undefined
              }}
            >
              <FlagImg src={lang.flag} alt={lang.label} />
              <span>{lang.label}</span>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </SelectorContainer>
  );
};

export default LanguageSelector;