import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import logoImage from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const HeaderContainer = styled.header`
  background: rgba(0, 0, 0, 0.9);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 255, 157, 0.3);
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 25px;
  }
  
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    padding: 5px 0;
    position: relative;
    transition: color 0.3s;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #00ff9d;
      transition: width 0.3s;
    }
    
    &:hover {
      color: #00ff9d;
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-right: 10px;
`;

const SocialIcon = styled.a<{ colorhover?: string; bghover?: string }>`
  color: white;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:hover {
    color: ${({ colorhover }) => colorhover || '#00ff9d'};
    background: ${({ bghover }) => bghover || 'rgba(0,255,157,0.1)'};
    transform: translateY(-3px);
  }
`;

const CartIcon = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 157, 0.2);
    transform: translateY(-3px);
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3366;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 255, 157, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 157, 0.3);
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 157, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;

  &:hover, &:focus {
    background: rgba(0, 255, 157, 0.3);
  }
`;

const UserAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: #222;
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 110%;
  right: 0;
  background: #181818;
  border: 1px solid rgba(0,255,157,0.2);
  border-radius: 12px;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  z-index: 100;
  padding: 8px 0;
  animation: fadeIn 0.2s;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px);}
    to { opacity: 1; transform: translateY(0);}
  }
`;

const UserMenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  padding: 12px 20px;
  text-align: left;
  font-size: 0.97rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0,255,157,0.08);
    color: #00ff9d;
  }
`;

// Utilidad para la URL de la foto de perfil
function getProfilePicUrl(pic?: string): string {
  if (!pic) return '/logo192.png';
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/static')) return `http://localhost:8000${pic}`;
  return `http://localhost:8000/static/${pic.replace(/^\/?static\/?/, '')}`;
}

const Header: React.FC = () => {
  const { state: cartState } = useCart();
  const { openCartModal } = useModal();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleConfig = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        <Logo to="/">
          <LogoImage src={logoImage} alt="Logo" />
        </Logo>
        
        <Nav>
          <ul>
            <li><a href="#hero">{t('welcome')}</a></li>
            <li><a href="/#productos">{t('products')}</a></li>
            <li><a href="/#contacto">{t('contact')}</a></li>
          </ul>
        </Nav>
        
        <HeaderIcons>
          <SocialIcons>
            <SocialIcon
              href="https://www.instagram.com/perfumeriayjj/"
              target="_blank"
              rel="noopener noreferrer"
              colorhover="#E1306C"
              bghover="rgba(225, 48, 108, 0.1)"
              title="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </SocialIcon>
            <SocialIcon
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              colorhover="#1DA1F2"
              bghover="rgba(29, 161, 242, 0.1)"
              title="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </SocialIcon>
            <SocialIcon
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              colorhover="#1877F2"
              bghover="rgba(24, 119, 242, 0.1)"
              title="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </SocialIcon>
          </SocialIcons>
          
          <CartIcon onClick={openCartModal}>
            <FontAwesomeIcon icon={faShoppingCart} />
            {cartState.itemCount > 0 && (
              <CartCount>{cartState.itemCount}</CartCount>
            )}
          </CartIcon>

          {/* Selector de idioma a la derecha del carrito */}
          <LanguageSelector />

          {user ? (
            <UserMenuContainer ref={menuRef}>
              <UserButton onClick={() => setMenuOpen((v) => !v)}>
                {user.profile_pic && !avatarError ? (
                  <UserAvatar
                    src={getProfilePicUrl(user.profile_pic)}
                    alt={user.username}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
                <span>
                  {user.username}
                </span>
              </UserButton>
              {menuOpen && (
                <UserMenuDropdown>
                  <UserMenuItem onClick={handleConfig}>
                    <FontAwesomeIcon icon={faCog} />
                    {t('profile_config')}
                  </UserMenuItem>
                  <UserMenuItem onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {t('logout')}
                  </UserMenuItem>
                </UserMenuDropdown>
              )}
            </UserMenuContainer>
          ) : (
            <LoginButton to="/login">
              <i className="fas fa-user"></i>
              <span>{t('login')}</span>
            </LoginButton>
          )}
        </HeaderIcons>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;