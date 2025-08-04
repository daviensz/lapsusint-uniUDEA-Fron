import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const DownloadCard = styled(motion.div)`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(0,255,157,0.05), transparent);
    border-radius: 20px;
    pointer-events: none;
  }
`;

const Title = styled.h1`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(0,255,157,0.5);
  font-weight: bold;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: #111;
  box-shadow: 0 0 20px rgba(0,255,157,0.5);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const ProductInfo = styled.div`
  background: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #00ff9d33;
`;

const ProductName = styled.h3`
  color: #00ff9d;
  margin-bottom: 10px;
`;

const LicenseInfo = styled.div`
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #00ff9d33;
`;

const LicenseKey = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border: 1px solid #00ff9d33;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #00ff9d;
  text-align: center;
  position: relative;
  margin-bottom: 10px;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const HiddenLicenseKey = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border: 1px solid #00ff9d33;
  border-radius: 8px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  position: relative;
  margin-bottom: 10px;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const RevealButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  color: #111;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,255,157,0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const CopyButton = styled.button`
  background: rgba(0,255,157,0.1);
  border: 1px solid #00ff9d;
  border-radius: 6px;
  padding: 6px 12px;
  color: #00ff9d;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(0,255,157,0.2);
  }
`;

const DownloadSection = styled.div`
  background: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #00ff9d33;
`;

const DownloadButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #111;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
  width: 100%;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,255,157,0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,255,157,0.4);
  }
`;

const SecondaryButton = styled.button`
  background: rgba(51, 51, 51, 0.8);
  color: #fff;
  border: 1px solid #00ff9d33;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(68, 68, 68, 0.8);
    border-color: #00ff9d66;
    transform: translateY(-1px);
  }
`;

const Message = styled.div`
  color: #00ff9d;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
  text-shadow: 0 0 5px rgba(0,255,157,0.3);
`;

interface DownloadData {
  order_id: string;
  license_key: string;
  download_url: string;
  product_name: string;
  license_type: string;
}

const Download: React.FC = () => {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [showLicenseKey, setShowLicenseKey] = useState(false);

  // Efecto Matrix específico para la página Download
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&=+-_';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff9d';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDownloadData = async () => {
      try {
        console.log('=== FETCHING DOWNLOAD DATA ===');
        console.log('Order ID:', orderId);
        console.log('Token:', token ? 'Present' : 'Missing');
        
        // Obtener la información de descarga específica para esta orden
        const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/licenses/download/${orderId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('Download data received:', data);
          
          setDownloadData({
            order_id: data.order_id,
            license_key: data.license_key,
            download_url: data.download_url,
            product_name: data.product_name,
            license_type: data.license_type
          });
        } else {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          setMessage(t('error_processing_purchase'));
        }
      } catch (error) {
        console.error('Error fetching download data:', error);
        setMessage(t('connection_error'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchDownloadData();
    }
  }, [orderId, token, navigate]);

  const copyLicenseKey = async () => {
    if (downloadData?.license_key) {
      try {
        await navigator.clipboard.writeText(downloadData.license_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        setMessage(t('error_copying_key'));
      }
    }
  };

  const downloadApp = () => {
    // Simular descarga de la aplicación
    setMessage(t('downloading_app'));
    // Aquí iría la lógica real de descarga
    setTimeout(() => {
      setMessage(t('download_completed'));
    }, 2000);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <Container>
        <DownloadCard>
          <Title>{t('processing_purchase')}</Title>
          <div style={{ textAlign: 'center', color: '#00ff9d' }}>
            {t('please_wait')}...
          </div>
        </DownloadCard>
      </Container>
    );
  }

  if (!downloadData) {
    return (
      <Container>
        <DownloadCard>
          <Title>{t('error')}</Title>
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
            {message || t('purchase_not_found')}
          </div>
          <SecondaryButton onClick={() => navigate('/')}>
            {t('go_home')}
          </SecondaryButton>
        </DownloadCard>
      </Container>
    );
  }

  return (
    <Container>
      <DownloadCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SuccessIcon>✓</SuccessIcon>
        <Title>{t('purchase_successful')}</Title>

        <ProductInfo>
          <ProductName>{downloadData.product_name}</ProductName>
          <div style={{ color: '#ccc' }}>
            {t('license_type')}: {t(downloadData.license_type)}
          </div>
        </ProductInfo>

        <LicenseInfo>
          <h4 style={{ color: '#00ff9d', marginBottom: '10px' }}>
            {t('your_license_key')}
          </h4>
          
          {showLicenseKey ? (
            <LicenseKey>
              <span>{downloadData.license_key}</span>
              <CopyButton onClick={copyLicenseKey}>
                {copied ? t('copied') : t('copy')}
              </CopyButton>
            </LicenseKey>
          ) : (
            <HiddenLicenseKey>
              <span>••••-••••-••••-••••-••••-••</span>
              <RevealButton onClick={() => setShowLicenseKey(true)}>
                {t('reveal_key') || 'Revelar Key'}
              </RevealButton>
            </HiddenLicenseKey>
          )}
          
          <div style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>
            {showLicenseKey ? t('save_key_safely') : (t('click_to_reveal') || 'Haz clic para revelar tu clave de licencia')}
          </div>
        </LicenseInfo>

        <DownloadSection>
          <h4 style={{ color: '#00ff9d', marginBottom: '15px' }}>
            {t('download_app')}
          </h4>
          <DownloadButton onClick={downloadApp}>
            {t('download_desktop_app')}
          </DownloadButton>
          <div style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
            {t('app_description')}
          </div>
        </DownloadSection>

        {message && <Message>{message}</Message>}

        <SecondaryButton onClick={goToProfile}>
          {t('view_my_licenses')}
        </SecondaryButton>
      </DownloadCard>
    </Container>
  );
};

export default Download; 