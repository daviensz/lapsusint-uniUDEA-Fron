import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  getSystemStatistics,
  getAllUsers,
  updateUserRole,
  getUserDetails,
  deleteUserLicense,
  deleteUser,
  getUserLicenses,
  debugGetUserDetails,
  debugDeleteUserLicense,
  debugGetStatistics
} from '../api/auth';
import MatrixBackground from '../components/MatrixBackground';
import ConfirmModal from '../components/ConfirmModal';

const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  position: relative;
  z-index: 10;
`;

const Sidebar = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
  height: fit-content;
`;

const MenuItem = styled.div<{ active: boolean }>`
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#00ff9d' : '#fff'};
  background: ${props => props.active ? 'rgba(0,255,157,0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? '#00ff9d44' : 'transparent'};

  &:hover {
    background: rgba(0,255,157,0.05);
    border-color: #00ff9d44;
  }
`;

const MainContent = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
`;

const Title = styled.h2`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.8rem;
`;

const SectionTitle = styled.h3`
  color: #00ff9d;
  margin-bottom: 20px;
  font-size: 1.4rem;
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 18px auto;
  display: block;
  background: #222;
`;

const InputGroup = styled.div`
  margin-bottom: 18px;
  label {
    color: #fff;
    font-size: 0.97rem;
    margin-bottom: 6px;
    display: block;
  }
  input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(0,255,157,0.2);
    background: rgba(255,255,255,0.07);
    color: #fff;
    font-size: 1rem;
    margin-top: 4px;
    outline: none;
    transition: border 0.2s;
    &:focus {
      border: 1.5px solid #00ff9d;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 13px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,255,157,0.3);
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMsg = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
`;

const SuccessMsg = styled.div`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(0, 255, 157, 0.1);
  border-radius: 8px;
`;

const PaymentSection = styled.div`
  margin-top: 32px;
`;

const PaymentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
`;

const PaymentItem = styled.li`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(0,255,157,0.13);
  border-radius: 8px;
  padding: 12px 10px;
  margin-bottom: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.97rem;
`;

const DeleteBtn = styled.button`
  background: #ff3366;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s;
  &:hover {
    background: #ff1744;
  }
`;

const LicenseSection = styled.div`
  margin-top: 32px;
`;

const LicenseList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 18px 0;
`;

const LicenseItem = styled.li`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(0,255,157,0.13);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  color: #fff;
`;

const LicenseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const LicenseProduct = styled.h4`
  color: #00ff9d;
  margin: 0;
  font-size: 1rem;
`;

const LicenseType = styled.span`
  background: rgba(0,255,157,0.2);
  color: #00ff9d;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const LicenseKey = styled.div`
  background: #111;
  border: 1px solid #00ff9d;
  border-radius: 6px;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #00ff9d;
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CopyButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #111;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DeleteLicenseButton = styled.button`
  background: linear-gradient(45deg, #ff3366, #ff1744);
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 8px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ExpiryDate = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-top: 8px;
`;

const PasswordModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PasswordModalContent = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
  max-width: 400px;
  width: 90%;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(0,255,157,0.2);
  background: rgba(255,255,255,0.07);
  color: #fff;
  font-size: 1rem;
  margin-bottom: 20px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #00ff9d;
  }
`;

const ModalButton = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #111;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,255,157,0.4);
  }
`;

const CancelButton = styled.button`
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

// Panel de gestión para usuarios DEV
const DevPanel = styled.div`
  margin-top: 30px;
`;

const UserCard = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid #00ff9d33;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ff9d66;
    transform: translateY(-2px);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  color: #fff;
`;

const Username = styled.h4`
  color: #00ff9d;
  margin: 0;
  font-size: 1.1rem;
`;

const UserEmail = styled.p`
  color: #888;
  margin: 5px 0;
  font-size: 0.9rem;
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  background: ${props => {
    switch (props.role) {
      case 'dev': return 'linear-gradient(45deg, #ff6b6b, #ff1744)';
      case 'admin': return 'linear-gradient(45deg, #ff9800, #ff5722)';
      case 'user': return 'linear-gradient(45deg, #00ff9d, #00cc7e)';
      default: return '#666';
    }
  }};
`;

const RoleSelect = styled.select`
  background: rgba(17, 17, 17, 0.9);
  border: 1px solid #00ff9d;
  border-radius: 6px;
  padding: 8px 12px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00ff9d;
    box-shadow: 0 0 5px rgba(0,255,157,0.3);
  }
`;

const StatsCard = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #00ff9d33;
`;

const StatTitle = styled.h4`
  color: #00ff9d;
  margin: 0 0 10px 0;
  font-size: 1rem;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatDescription = styled.p`
  color: #888;
  font-size: 0.8rem;
  margin: 0;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChartCard = styled.div`
  background: rgba(17, 17, 17, 0.9);
  border: 1px solid #00ff9d33;
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
`;

const ChartTitle = styled.h3`
  color: #00ff9d;
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  text-align: center;
`;

const ProductChart = styled.div`
  height: 300px;
  display: flex;
  align-items: end;
  gap: 10px;
  padding: 20px 0;
`;

const ChartBar = styled.div`
  flex: 1;
  background: linear-gradient(to top, #00ff9d, #00cc7e);
  border-radius: 5px 5px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  padding: 10px 5px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
  }
`;

const BarLabel = styled.div`
  color: #fff;
  font-size: 0.7rem;
  text-align: center;
  margin-bottom: 5px;
  font-weight: bold;
`;

const BarValue = styled.div`
  color: #00ff9d;
  font-size: 0.9rem;
  font-weight: bold;
`;

const PaymentChart = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 20px 0;
`;

const PaymentSegment = styled.div`
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const SegmentLabel = styled.div`
  color: #fff;
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 5px;
  font-weight: bold;
`;

const SegmentValue = styled.div`
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    color: #00ff9d;
    margin: 20px 0 10px 0;
  }
  
  p {
    color: #888;
    margin: 0;
  }
`;

const LicensesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LicenseCard = styled.div`
  background: rgba(17, 17, 17, 0.9);
  border: 1px solid #00ff9d33;
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
`;



function getProfilePicUrl(pic?: string): string {
  if (!pic) return '/logo192.png';
  if (pic.startsWith('http')) return pic;
  if (pic.startsWith('/static')) return `http://localhost:8000${pic}`;
  return `http://localhost:8000/static/${pic.replace(/^\/?static\/?/, '')}`;
}

// Utilidad para obtener la URL de la imagen del producto
function getProductImageUrl(product: { image?: string; name?: string } | undefined) {
  if (!product) return '/logo.png';
  if (product.image) {
    if (product.image.startsWith('http')) return product.image;
    if (product.image.startsWith('/static')) return `http://localhost:8000${product.image}`;
    return `http://localhost:8000/static/${product.image.replace(/^\/static\/?/, '')}`;
  }
  // Fallback: buscar por nombre
  return `/static/${product.name?.toLowerCase().replace(/\s/g, '') || 'logo'}.png`;
}

// Utilidad para traducir y mostrar bonito el tipo de licencia
function getLicenseTypeLabel(type: string): { label: string; color: string } {
  switch (type) {
    case 'one_week':
      return { label: '1 Semana', color: '#00ff9d' };
    case 'one_month':
      return { label: '1 Mes', color: '#4ecdc4' };
    case 'three_months':
      return { label: '3 Meses', color: '#ff9800' };
    case 'lifetime':
      return { label: 'De por vida', color: '#ff3366' };
    default:
      return { label: type, color: '#888' };
  }
}

// Utilidad para calcular días restantes
function getDaysLeft(expiry: string | Date | undefined): number | null {
  if (!expiry) return null;
  const now = new Date();
  const exp = new Date(expiry);
  const diff = exp.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Utilidad para calcular el tiempo restante en formato días:horas:minutos:segundos
function getTimeLeft(expiry: string | Date | undefined): string | null {
  if (!expiry) return null;
  const now = new Date();
  const exp = new Date(expiry);
  let diff = exp.getTime() - now.getTime();
  
  if (diff < 0) {
    return "Expirada";
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  // Formato mejorado
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

const Profile: React.FC = () => {
  const { user, token, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmError, setPmError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  
  // Estados para el panel DEV
  const [users, setUsers] = useState<any[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());
  const [statistics, setStatistics] = useState<any>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  
  // Estados para gestión avanzada de usuarios
  const [userDetails, setUserDetails] = useState<{[key: string]: any}>({});
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [loadingUserDetails, setLoadingUserDetails] = useState<Set<string>>(new Set());
  
  // Estados para la foto de perfil
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewPic, setPreviewPic] = useState(user?.profile_pic || '');
  const [loading, setLoading] = useState(false);
  
  // Estado para forzar actualización del contador cada segundo
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Estados para confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Estados para mostrar contraseñas de usuarios
  const [showUserPasswordModal, setShowUserPasswordModal] = useState(false);
  const [selectedUserPassword, setSelectedUserPassword] = useState<string | null>(null);
  const [userPasswordInput, setUserPasswordInput] = useState('');
  const [visibleUserPasswords, setVisibleUserPasswords] = useState<Set<string>>(new Set());
  const [masterPassword, setMasterPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showMasterPasswordModal, setShowMasterPasswordModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'dev') {
      loadUsers();
      loadStatistics();
    }
  }, [user]);

  useEffect(() => {
    setPreviewPic(user?.profile_pic || '');
    setDisplayName(user?.display_name || '');
  }, [user]);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewPic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('display_name', displayName);
      if (profilePic) formData.append('profile_pic', profilePic);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://127.0.0.1:8000"}/profile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error(t('error_updating_profile'));
      setSuccess(t('profile_updated'));
      setProfilePic(null);
      await refreshUser();
      setTimeout(() => {
        setPreviewPic(user?.profile_pic || '');
      }, 300);
    } catch (err: any) {
      setError(err.message || t('error_updating_profile'));
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const usersData = await getAllUsers(token);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadStatistics = async () => {
    console.log('📊 loadStatistics llamado');
    console.log('📋 token disponible:', token ? 'Sí' : 'No');
    console.log('📋 user role:', user?.role);
    
    try {
      setLoadingStats(true);
      console.log('📡 Llamando a debugGetStatistics API...');
      // Temporalmente usar la función de debug sin autenticación
      const stats = await debugGetStatistics();
      console.log('✅ Estadísticas obtenidas:', stats);
      setStatistics(stats);
    } catch (err: any) {
      console.error('❌ Error al cargar estadísticas:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      setLoadingStats(false);
      console.log('📊 loadStatistics completado');
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.add(Number(userId));
        return newSet;
      });
      await updateUserRole(token, userId, newRole);
      
      // Actualizar la lista de usuarios
      setUsers(prev => prev.map(user => 
        user.id === Number(userId) ? { ...user, role: newRole, is_admin: newRole === 'admin' || newRole === 'dev' } : user
      ));
      
      setSuccess('Rol actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar rol');
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(Number(userId));
        return newSet;
      });
    }
  };

  const handleDeleteLicense = async (licenseId: number) => {
    try {
      console.log('📡 Llamando a deleteUserLicense API...');
      await deleteUserLicense(token, licenseId);
      console.log('✅ Licencia eliminada exitosamente');
      setLicenses(prev => prev.filter(license => license.id !== licenseId));
      setSuccess('Licencia eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar licencia');
    }
  };

  const handleCopyLicense = async (licenseKey: string) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setSuccess('Clave copiada al portapapeles');
      setTimeout(() => setSuccess(null), 3000);
      setShowPasswordModal(false);
      setPassword('');
      setSelectedLicense(null);
    } catch (err: any) {
      setError('Error al copiar la clave');
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentMethod.trim()) return;
    
    try {
      setPmLoading(true);
      // await addPaymentMethod(token, { card_number: newPaymentMethod }); // This line was removed as per the edit hint
      setNewPaymentMethod('');
      setSuccess('Método de pago agregado');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setPmError(err.message || 'Error al agregar método de pago');
    } finally {
      setPmLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId: number) => {
    try {
      // await deletePaymentMethod(token, methodId); // This line was removed as per the edit hint
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      setSuccess('Método de pago eliminado');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setPmError(err.message || 'Error al eliminar método de pago');
    }
  };

  // Funciones para gestión avanzada de usuarios
  const handleUserExpand = async (userId: string) => {
    console.log('🔍 handleUserExpand llamado');
    console.log('📋 userId:', userId, 'tipo:', typeof userId);
    
    // Los UUIDs son strings, no los convertimos a number
    const userIdStr = String(userId);
    console.log('📋 userIdStr:', userIdStr);
    console.log('📋 userDetails actuales:', userDetails);
    console.log('📋 ¿userIdStr existe en userDetails?', userIdStr in userDetails);
    
    if (userDetails[userIdStr]) {
      console.log('✅ Usuario ya tiene detalles cargados, solo expandiendo/contrayendo');
      setExpandedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(userIdStr)) {
          console.log('📉 Contrayendo usuario:', userIdStr);
          newSet.delete(userIdStr);
        } else {
          console.log('📈 Expandiendo usuario:', userIdStr);
          newSet.add(userIdStr);
        }
        console.log('🔄 Nuevo expandedUsers:', Array.from(newSet));
        return newSet;
      });
      return;
    }

    console.log('📡 Cargando detalles del usuario desde API...');
    setLoadingUserDetails(prev => new Set([...Array.from(prev), userIdStr]));
    
    try {
      console.log('📡 Llamando a debugGetUserDetails API...');
      // Temporalmente usar el endpoint de debug sin autenticación
      const details = await debugGetUserDetails(userIdStr);
      console.log('✅ Detalles obtenidos:', details);
      
      // Log detallado de las licencias
      if (details.licenses && details.licenses.length > 0) {
        console.log('📋 Primera licencia completa:', details.licenses[0]);
        console.log('🔑 Campos de la licencia:', Object.keys(details.licenses[0]));
        console.log('📦 Producto de la licencia:', details.licenses[0].product);
        console.log('�� Producto nombre:', details.licenses[0].product_name);
        console.log('📅 Fecha de creación:', details.licenses[0].create_at);
        console.log('📅 Fecha de creación (created_at):', details.licenses[0].created_at);
      }
      
      // Log detallado de las órdenes
      if (details.orders && details.orders.length > 0) {
        console.log('📋 Primera orden completa:', details.orders[0]);
        console.log('🔑 Campos de la orden:', Object.keys(details.orders[0]));
        console.log('💰 Total amount:', details.orders[0].total_amount);
      }
      
      console.log('💰 Total gastado:', details.total_spent);
      
      setUserDetails(prev => {
        const newDetails = { ...prev, [userIdStr]: details };
        console.log('🔄 Nuevos userDetails:', newDetails);
        return newDetails;
      });
      
      setExpandedUsers(prev => {
        const newSet = new Set([...Array.from(prev), userIdStr]);
        console.log('🔄 Nuevo expandedUsers:', Array.from(newSet));
        return newSet;
      });
      
      console.log('✅ Usuario expandido exitosamente');
    } catch (err: any) {
      console.error('❌ Error al cargar detalles del usuario:', err);
      console.error('❌ Error message:', err.message);
      setError(err.message || 'Error al cargar detalles del usuario');
    } finally {
      setLoadingUserDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(userIdStr);
        return newSet;
      });
    }
  };

  const handleDeleteUserLicense = async (licenseId: string, userId: string) => {
    console.log('🗑️ handleDeleteUserLicense llamado');
    console.log('📋 licenseId:', licenseId, 'tipo:', typeof licenseId);
    console.log('📋 userId:', userId, 'tipo:', typeof userId);
    
    try {
      console.log('📡 Llamando a debugDeleteUserLicense API...');
      // Temporalmente usar la función de debug sin autenticación
      await debugDeleteUserLicense(licenseId);
      console.log('✅ Licencia eliminada exitosamente');
      
      // Actualizar la lista de detalles del usuario
      if (userDetails[userId]) {
        const updatedDetails = { ...userDetails[userId] };
        updatedDetails.licenses = updatedDetails.licenses.filter(
          (license: any) => license.license_id !== licenseId
        );
        updatedDetails.licenses_count = updatedDetails.licenses.length;
        
        setUserDetails(prev => ({
          ...prev,
          [userId]: updatedDetails
        }));
        
        console.log('✅ userDetails actualizado');
      }
      
      toast.success('Licencia eliminada exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar licencia:', error);
      toast.error(`Error al eliminar licencia: ${error}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUserToDelete(userId);
    setConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    console.log('🔍 confirmDeleteUser llamado');
    console.log('📋 userToDelete:', userToDelete);
    
    if (!userToDelete) {
      console.log('❌ No hay userToDelete');
      return;
    }
    
    // Los UUIDs son strings, no los convertimos a number
    const userId = String(userToDelete);
    console.log('📋 userId (string):', userId);
    
    try {
      console.log('📡 Llamando a deleteUser API...');
      const result = await deleteUser(token, userId);
      console.log('✅ Resultado de deleteUser:', result);
      
      console.log('🔄 Actualizando lista de usuarios...');
      setUsers(prev => {
        const filtered = prev.filter(user => user.user_id !== userId);
        console.log('📊 Usuarios restantes:', filtered.length);
        return filtered;
      });
      
      setSuccess('Usuario eliminado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('❌ Error al eliminar usuario:', err);
      console.error('❌ Error message:', err.message);
      setError(err.message || 'Error al eliminar usuario');
    } finally {
      console.log('🏁 Cerrando modal y limpiando estado...');
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleShowUserPassword = (password: string) => {
    setVisibleUserPasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(password)) {
        newSet.delete(password);
      } else {
        newSet.add(password);
      }
      return newSet;
    });
  };

  const handleMasterPasswordSubmit = () => {
    if (masterPassword === 'lapsusint') {
      if (selectedUserPassword) {
        setVisibleUserPasswords(prev => new Set([...Array.from(prev), selectedUserPassword]));
      }
      setShowMasterPasswordModal(false);
      setMasterPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Contraseña maestra incorrecta');
    }
  };

  const handleClosePasswordModal = () => {
    setShowMasterPasswordModal(false);
    setMasterPassword('');
    setPasswordError('');
  };

  // Cargar licencias del usuario
  const loadLicenses = async () => {
    if (!token) {
      console.log('❌ No hay token disponible');
      return;
    }
    console.log('🔍 Cargando licencias...');
    console.log('Token disponible:', token ? 'Sí' : 'No');
    setLicenseLoading(true);
    try {
      console.log('📡 Haciendo petición a /licenses/user/licenses...');
      const data = await getUserLicenses(token);
      console.log('✅ Licencias obtenidas:', data);
      console.log('📊 Estructura de datos:', JSON.stringify(data, null, 2));
      console.log('🔢 Número de licencias:', data.length);
      
      // Log detallado de cada licencia
      if (data.length > 0) {
        console.log('📋 Primera licencia:', data[0]);
        console.log('🔑 Campos disponibles:', Object.keys(data[0]));
      }
      
      setLicenses(data);
    } catch (err: any) {
      console.error('❌ Error al cargar licencias:', err);
      console.error('Detalles del error:', err.message);
      setError(err.message || 'Error al cargar licencias');
    } finally {
      setLicenseLoading(false);
    }
  };

  // Cargar licencias al cambiar de usuario o al seleccionar la sección 'licenses'
  useEffect(() => {
    console.log('🔄 useEffect ejecutado - activeSection:', activeSection, 'user:', user?.id);
    if (activeSection === 'licenses') {
      console.log('📋 Sección de licencias seleccionada, cargando...');
      loadLicenses();
    }
    // eslint-disable-next-line
  }, [activeSection, user]);

  // Debug useEffect para expandedUsers y userDetails
  useEffect(() => {
    console.log('🔄 expandedUsers cambió:', Array.from(expandedUsers));
  }, [expandedUsers]);

  useEffect(() => {
    console.log('🔄 userDetails cambió:', Object.keys(userDetails));
  }, [userDetails]);

  return (
    <>
      <MatrixBackground />
      <Container>
        <ProfileContainer>
          <Sidebar>
                        <MenuItem 
              active={activeSection === 'profile'} 
              onClick={() => setActiveSection('profile')}
            >
              {t('profile_config')}
            </MenuItem>
            <MenuItem 
              active={activeSection === 'licenses'} 
              onClick={() => setActiveSection('licenses')}
            >
              {t('my_licenses')}
            </MenuItem>
            <MenuItem 
              active={activeSection === 'payment'} 
              onClick={() => setActiveSection('payment')}
            >
              {t('payment_methods')}
            </MenuItem>
            {user?.role === 'admin' && (
              <MenuItem 
                active={activeSection === 'users'} 
                onClick={() => setActiveSection('users')}
              >
                Gestión de Usuarios
              </MenuItem>
            )}
            {(user?.role === 'admin' || user?.role === 'dev') && (
              <MenuItem 
                active={activeSection === 'stats'} 
                onClick={() => setActiveSection('stats')}
              >
                Dashboard
              </MenuItem>
            )}
          </Sidebar>

          <MainContent>
            {activeSection === 'profile' && (
              <div>
                <Title>{t('profile_config')}</Title>
                
                <Avatar src={getProfilePicUrl(previewPic)} alt="Profile" />
                
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                  <InputGroup>
                    <label>{t('display_name')}</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={t('enter_display_name')}
                    />
                  </InputGroup>

                  <InputGroup>
                    <label>{t('email')}</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      placeholder={t('email')}
                    />
                  </InputGroup>

                  <InputGroup>
                    <label>{t('password')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('password')}
                    />
                  </InputGroup>

                  <InputGroup>
                    <label>{t('profile_picture')}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePicChange}
                    />
                  </InputGroup>

                  <Button type="submit" disabled={loading}>
                    {loading ? t('saving') : t('save_changes')}
                  </Button>
                </form>

                {error && <ErrorMsg>{error}</ErrorMsg>}
                {success && <SuccessMsg>{success}</SuccessMsg>}
              </div>
            )}

            {activeSection === 'licenses' && (
              <LicenseSection>
                <Title>Mis Licencias</Title>
                {licenseLoading ? (
                  <div style={{ color: '#00ff9d', textAlign: 'center' }}>
                    {t('loading')}
                  </div>
                ) : licenses.length > 0 ? (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {licenses.map((license) => {
                      const licenseType = getLicenseTypeLabel(license.license_type);
                      const timeLeft = getTimeLeft(license.expires_at);
                      // Usar tick para forzar actualización del contador
                      const _ = tick; // Esto fuerza la re-renderización
                      
                      // Debug logging
                      console.log('🔍 License data:', license);
                      console.log('📅 Created at:', license.created_at);
                      console.log('📅 Create at:', license.create_at);
                      console.log('📅 Updated at:', license.updated_at);
                      console.log('📅 Update at:', license.update_at);
                      console.log('📅 Expires at:', license.expires_at);
                      
                      return (
                        <div key={license.license_id || license.id} style={{ 
                          background: 'rgba(17, 17, 17, 0.9)', 
                          borderRadius: '15px', 
                          padding: '20px', 
                          border: '1px solid #00ff9d33',
                          backdropFilter: 'blur(10px)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                            <img 
                              src={getProductImageUrl({ name: license.product_name })} 
                              alt={license.product_name || 'Producto'}
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '8px', 
                                objectFit: 'cover',
                                border: '2px solid #00ff9d33'
                              }}
                              onError={(e) => {
                                e.currentTarget.src = '/logo.png';
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ color: '#00ff9d', margin: '0 0 5px 0', fontSize: '1.2rem' }}>
                                {license.product_name || 'Producto'}
                              </h4>
                              {license.description && (
                                <p style={{ 
                                  color: '#ccc', 
                                  margin: '0 0 8px 0', 
                                  fontSize: '0.9rem',
                                  lineHeight: '1.4'
                                }}>
                                  {license.description}
                                </p>
                              )}
                              <span style={{ 
                                background: licenseType.color,
                                color: '#111',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                display: 'inline-block',
                                boxShadow: '0 2px 8px rgba(0,255,157,0.15)'
                              }}>
                                {licenseType.label}
                              </span>
                            </div>
                          </div>
                          
                          <div style={{ 
                            background: 'rgba(0, 255, 157, 0.1)', 
                            border: '1px solid #00ff9d33', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            margin: '15px 0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ color: '#00ff9d', fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '1px' }}>
                              {selectedLicense === license.license_key ? license.license_key : '••••••••••••••••••••••••••••••'}
                            </span>
                            <button 
                              onClick={() => {
                                setSelectedLicense(license.license_key);
                                setShowPasswordModal(true);
                              }}
                              style={{
                                background: 'linear-gradient(45deg, #00ff9d, #00cc7e)',
                                color: 'black',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '5px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              Copiar clave
                            </button>
                          </div>
                          
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr auto 1fr', 
                            gap: '15px', 
                            alignItems: 'center',
                            color: '#666', 
                            fontSize: '0.9rem' 
                          }}>
                            <div style={{ textAlign: 'left' }}>
                              <div style={{ color: '#00ff9d', fontWeight: 'bold', marginBottom: '2px' }}>Comprada</div>
                              <div>
                                {(() => {
                                  // El backend guarda como 'create_at', no 'created_at'
                                  const createdDate = license.create_at || license.created_at || license.update_at || license.updated_at;
                                  console.log('📅 Using date field:', createdDate);
                                  return createdDate ? new Date(createdDate).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Fecha no disponible';
                                })()}
                              </div>
                            </div>
                            
                            {/* Contador de tiempo en el centro */}
                            {timeLeft && license.expires_at && (
                              <div style={{ 
                                background: timeLeft === "Expirada" || timeLeft.includes('0d') ? '#ff3366' : '#00ff9d',
                                color: '#111',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                minWidth: '120px',
                                boxShadow: '0 4px 12px rgba(0,255,157,0.2)',
                                border: timeLeft === "Expirada" || timeLeft.includes('0d') ? '2px solid #ff3366' : '2px solid #00ff9d'
                              }}>
                                <div style={{ fontSize: '0.8rem', marginBottom: '2px' }}>
                                  {timeLeft === "Expirada" ? "Estado" : "Tiempo restante"}
                                </div>
                                <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{timeLeft}</div>
                              </div>
                            )}
                            
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ color: '#00ff9d', fontWeight: 'bold', marginBottom: '2px' }}>Expira</div>
                              <div>
                                {(() => {
                                  const expiryDate = license.expires_at;
                                  console.log('📅 Expiry date:', expiryDate);
                                  return expiryDate ? new Date(expiryDate).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Sin expiración';
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎮</div>
                    <h3 style={{ color: '#00ff9d', margin: '20px 0 10px 0' }}>No tienes licencias</h3>
                    <p style={{ color: '#888', margin: 0 }}>Compra productos para obtener tus licencias aquí</p>
                  </div>
                )}
              </LicenseSection>
            )}

            {activeSection === 'payment' && (
              <PaymentSection>
                <Title>Métodos de Pago</Title>
                
                <PaymentList>
                  {paymentMethods.map((method) => (
                    <PaymentItem key={method.id}>
                      <span>**** **** **** {method.card_number.slice(-4)}</span>
                      <DeleteBtn onClick={() => handleDeletePaymentMethod(method.id)}>
                        Eliminar
                      </DeleteBtn>
                    </PaymentItem>
                  ))}
                </PaymentList>

                <form onSubmit={handleAddPaymentMethod}>
                  <InputGroup>
                    <label>Número de tarjeta</label>
                    <input
                      type="text"
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </InputGroup>
                  <Button type="submit" disabled={pmLoading}>
                    {pmLoading ? 'Agregando...' : 'Agregar método de pago'}
                  </Button>
                </form>

                {pmError && <ErrorMsg>{pmError}</ErrorMsg>}
              </PaymentSection>
            )}

            {activeSection === 'stats' && (
              <div>
                <Title>Dashboard de Estadísticas</Title>
                
                {loadingStats ? (
                  <div style={{ color: '#00ff9d', textAlign: 'center' }}>
                    {t('loading')}
                  </div>
                ) : statistics && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Total de Usuarios</h3>
                        <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{statistics.total_users}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>Número total de usuarios registrados</div>
                      </div>

                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Total de Productos</h3>
                        <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{statistics.total_products}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>Productos disponibles en el sistema</div>
                      </div>

                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Total de Licencias</h3>
                        <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{statistics.licenses?.total || 0}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          {statistics.licenses?.sold || 0} vendidas • {statistics.licenses?.pending || 0} en pedidos
                        </div>
                      </div>

                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Total de Pagos</h3>
                        <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>${statistics.payments?.total_revenue || 0}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          {statistics.payments?.by_type && Object.entries(statistics.payments.by_type).map(([method, data]) => 
                            `${method}: ${(data as any)?.count || 0}`
                          ).join(' • ')}
                        </div>
                      </div>

                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Productos por Tipo</h3>
                        <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px' }}>
                          {statistics.products_by_type && Object.entries(statistics.products_by_type).map(([product, data]) => 
                            `${product}: ${(data as any)?.count || 0}`
                          ).join(' • ')}
                        </div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          Desglose de productos vendidos por tipo
                        </div>
                      </div>
                    </div>

                    {/* Gráficas profesionales con CSS puro */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 20px 0', fontSize: '1.2rem', textAlign: 'center' }}>Distribución de Productos</h3>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'end', gap: '15px', padding: '20px 0', position: 'relative' }}>
                          {/* Eje Y */}
                          <div style={{ 
                            position: 'absolute', 
                            left: '0', 
                            top: '0', 
                            bottom: '0', 
                            width: '30px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            color: '#666',
                            fontSize: '0.7rem'
                          }}>
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                          </div>
                          
                          {/* Líneas de referencia */}
                          <div style={{ 
                            position: 'absolute', 
                            left: '35px', 
                            right: '0', 
                            top: '0', 
                            bottom: '0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                            {[0, 1, 2, 3].map(i => (
                              <div key={i} style={{ 
                                height: '1px', 
                                background: 'rgba(255,255,255,0.1)', 
                                width: '100%' 
                              }} />
                            ))}
                          </div>
                          
                          <div style={{ marginLeft: '40px', display: 'flex', alignItems: 'end', gap: '15px', width: '100%' }}>
                            {statistics.products_by_type && Object.entries(statistics.products_by_type).map(([product, data], index) => {
                              const percentage = ((data as any)?.count / Object.values(statistics.products_by_type).reduce((sum: number, item: any) => sum + (item?.count || 0), 0)) * 100;
                              const colors = ['#00ff9d', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
                              return (
                                <div key={product} style={{ 
                                  flex: 1, 
                                  background: `linear-gradient(to top, ${colors[index % colors.length]}, ${colors[index % colors.length]}88)`, 
                                  borderRadius: '8px 8px 0 0', 
                                  minHeight: '20px', 
                                  height: `${percentage}%`,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'end',
                                  alignItems: 'center',
                                  padding: '10px 5px',
                                  transition: 'all 0.3s ease',
                                  position: 'relative',
                                  boxShadow: `0 4px 15px ${colors[index % colors.length]}33`
                                }}>
                                  <div style={{ 
                                    position: 'absolute', 
                                    top: '-25px', 
                                    left: '50%', 
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.9)',
                                    padding: '5px 8px',
                                    borderRadius: '5px',
                                    fontSize: '0.7rem',
                                    color: colors[index % colors.length],
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {(data as any)?.count || 0}
                                  </div>
                                  <div style={{ color: '#fff', fontSize: '0.7rem', textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>
                                    {product.split(' ')[0]}
                                  </div>
                                  <div style={{ color: colors[index % colors.length], fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div style={{ 
                        background: 'rgba(17, 17, 17, 0.9)', 
                        borderRadius: '15px', 
                        padding: '25px', 
                        border: '1px solid #00ff9d33',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <h3 style={{ color: '#00ff9d', margin: '0 0 20px 0', fontSize: '1.2rem', textAlign: 'center' }}>Métodos de Pago</h3>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', gap: '8px', padding: '20px 0' }}>
                          {statistics.payments?.by_type && Object.entries(statistics.payments.by_type).map(([method, data], index) => {
                            const percentage = ((data as any)?.count / Object.values(statistics.payments.by_type).reduce((sum: number, item: any) => sum + (item?.count || 0), 0)) * 100;
                            const colors = ['#00ff9d', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
                            return (
                              <div key={method} style={{ 
                                height: '100%', 
                                width: `${percentage}%`,
                                borderRadius: '8px',
                                background: `linear-gradient(135deg, ${colors[index % colors.length]}, ${colors[index % colors.length]}88)`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                boxShadow: `0 4px 15px ${colors[index % colors.length]}33`
                              }}>
                                <div style={{ color: '#fff', fontSize: '0.8rem', textAlign: 'center', marginBottom: '5px', fontWeight: 'bold' }}>
                                  {method.toUpperCase()}
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                  {(data as any)?.count || 0}
                                </div>
                                <div style={{ color: colors[index % colors.length], fontSize: '0.7rem', fontWeight: 'bold' }}>
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Nueva gráfica de visitas */}
                    <div style={{ 
                      background: 'rgba(17, 17, 17, 0.9)', 
                      borderRadius: '15px', 
                      padding: '25px', 
                      border: '1px solid #00ff9d33',
                      backdropFilter: 'blur(10px)',
                      marginTop: '30px'
                    }}>
                      <h3 style={{ color: '#00ff9d', margin: '0 0 20px 0', fontSize: '1.2rem', textAlign: 'center' }}>Estadísticas de Visitas</h3>
                      <div style={{ height: '300px', position: 'relative', padding: '20px 0' }}>
                        {/* Datos simulados de visitas */}
                        {(() => {
                          const visitData = [
                            { day: 'Lun', visits: 45, pageViews: 120 },
                            { day: 'Mar', visits: 52, pageViews: 145 },
                            { day: 'Mié', visits: 38, pageViews: 98 },
                            { day: 'Jue', visits: 67, pageViews: 189 },
                            { day: 'Vie', visits: 89, pageViews: 234 },
                            { day: 'Sáb', visits: 76, pageViews: 201 },
                            { day: 'Dom', visits: 94, pageViews: 267 }
                          ];
                          
                          const maxVisits = Math.max(...visitData.map(d => d.visits));
                          const maxPageViews = Math.max(...visitData.map(d => d.pageViews));
                          
                          return (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'end', gap: '10px', padding: '0 20px' }}>
                              {visitData.map((data, index) => (
                                <div key={data.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                  {/* Gráfica de visitas */}
                                  <div style={{ 
                                    width: '100%',
                                    height: `${(data.visits / maxVisits) * 100}%`,
                                    background: 'linear-gradient(to top, #00ff9d, #00cc7e)',
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative',
                                    minHeight: '10px',
                                    boxShadow: '0 2px 8px rgba(0, 255, 157, 0.3)'
                                  }}>
                                    <div style={{ 
                                      position: 'absolute', 
                                      top: '-20px', 
                                      left: '50%', 
                                      transform: 'translateX(-50%)',
                                      background: 'rgba(0,0,0,0.9)',
                                      padding: '3px 6px',
                                      borderRadius: '3px',
                                      fontSize: '0.6rem',
                                      color: '#00ff9d',
                                      fontWeight: 'bold'
                                    }}>
                                      {data.visits}
                                    </div>
                                  </div>
                                  
                                  {/* Gráfica de páginas vistas */}
                                  <div style={{ 
                                    width: '100%',
                                    height: `${(data.pageViews / maxPageViews) * 100}%`,
                                    background: 'linear-gradient(to top, #ff6b6b, #ff1744)',
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative',
                                    minHeight: '10px',
                                    boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)'
                                  }}>
                                    <div style={{ 
                                      position: 'absolute', 
                                      top: '-20px', 
                                      left: '50%', 
                                      transform: 'translateX(-50%)',
                                      background: 'rgba(0,0,0,0.9)',
                                      padding: '3px 6px',
                                      borderRadius: '3px',
                                      fontSize: '0.6rem',
                                      color: '#ff6b6b',
                                      fontWeight: 'bold'
                                    }}>
                                      {data.pageViews}
                                    </div>
                                  </div>
                                  
                                  <div style={{ color: '#666', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                    {data.day}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                        
                        {/* Leyenda */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          gap: '30px', 
                          marginTop: '20px',
                          padding: '10px',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#00ff9d', borderRadius: '2px' }}></div>
                            <span style={{ color: '#fff', fontSize: '0.8rem' }}>Visitas</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', background: '#ff6b6b', borderRadius: '2px' }}></div>
                            <span style={{ color: '#fff', fontSize: '0.8rem' }}>Páginas Vistas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Panel de gestión para usuarios DEV/ADMIN */}
            {(user?.role === 'admin' || user?.role === 'dev') && activeSection === 'users' && (
              <div>
                <Title>Gestión de Usuarios</Title>
                
                {loadingUsers && <div style={{ color: '#00ff9d', textAlign: 'center' }}>
                  {t('loading')}
                </div>}
                
                {users
                  .slice()
                  .sort((a, b) => {
                    const roleOrder = { dev: 0, admin: 1, user: 2 } as const;
                    return (roleOrder[a.role as keyof typeof roleOrder] ?? 3) - (roleOrder[b.role as keyof typeof roleOrder] ?? 3);
                  })
                  .map((userItem) => (
                  <div key={userItem.user_id} onClick={(e) => {
                    e.stopPropagation();
                    console.log('🖱️ Click en usuario:', userItem.user_id);
                    console.log('🖱️ Username:', userItem.username);
                    console.log('🖱️ expandedUsers antes:', Array.from(expandedUsers));
                    handleUserExpand(userItem.user_id);
                    console.log('🖱️ handleUserExpand ejecutado');
                  }} style={{ 
                    background: 'rgba(17, 17, 17, 0.9)', 
                    borderRadius: '15px', 
                    padding: '20px', 
                    marginBottom: '20px', 
                    border: '1px solid #00ff9d33',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    {/* X para eliminar usuario */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #ff6b6b, #ff1744)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        fontSize: '18px',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(userItem.user_id);
                      }}
                    >
                      ×
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                      <img 
                        src={getProfilePicUrl(userItem.profile_pic)}
                        alt={userItem.display_name || userItem.username}
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '50%', 
                          objectFit: 'cover',
                          border: '2px solid #00ff9d33'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = '/logo.png';
                        }}
                      />
                      <div>
                        <h4 style={{ color: '#00ff9d', margin: '0 0 5px 0' }}>{userItem.display_name || userItem.username}</h4>
                        <div style={{ color: '#fff', marginBottom: '5px' }}>{userItem.email}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          Usuario: {userItem.username} • Creado: {new Date(userItem.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Contraseña:</strong> 
                          {userItem.plain_password ? (
                            <span style={{ marginLeft: '5px' }}>
                              {visibleUserPasswords.has(userItem.plain_password) 
                                ? userItem.plain_password 
                                : '••••••••'
                              }
                              {user?.role === 'admin' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserPassword(userItem.plain_password);
                                    setShowMasterPasswordModal(true);
                                  }}
                                  style={{
                                    background: 'linear-gradient(45deg, #00ff9d, #00cc7e)',
                                    color: 'black',
                                    border: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    boxShadow: '0 2px 4px rgba(0,255,157,0.3)',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,255,157,0.4)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,255,157,0.3)';
                                  }}
                                >
                                  {visibleUserPasswords.has(userItem.plain_password) ? 'Ocultar' : 'Mostrar'}
                                </button>
                              )}
                            </span>
                          ) : (
                            <span style={{ color: '#ff6b6b', marginLeft: '5px' }}>No establecida</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {userDetails[userItem.user_id] && (
                      <div style={{ display: 'flex', gap: '20px', margin: '15px 0', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(0, 255, 157, 0.1)', padding: '10px 15px', borderRadius: '8px', border: '1px solid #00ff9d33' }}>
                          <div style={{ color: '#00ff9d', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Licencias</div>
                          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{userDetails[userItem.user_id].licenses_count}</div>
                        </div>
                        <div style={{ background: 'rgba(0, 255, 157, 0.1)', padding: '10px 15px', borderRadius: '8px', border: '1px solid #00ff9d33' }}>
                          <div style={{ color: '#00ff9d', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Órdenes</div>
                          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{userDetails[userItem.user_id].orders_count}</div>
                        </div>
                        <div style={{ background: 'rgba(0, 255, 157, 0.1)', padding: '10px 15px', borderRadius: '8px', border: '1px solid #00ff9d33' }}>
                          <div style={{ color: '#00ff9d', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>Total Gastado</div>
                          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>${userDetails[userItem.user_id].total_spent}</div>
                        </div>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '15px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        background: userItem.role === 'dev' ? 'linear-gradient(45deg, #ff6b6b, #ff1744)' : 
                                   userItem.role === 'admin' ? 'linear-gradient(45deg, #ff9800, #ff5722)' : 
                                   'linear-gradient(45deg, #00ff9d, #00cc7e)',
                        color: 'white'
                      }}>
                        {t(userItem.role)}
                      </span>
                    </div>
                    
                    <select 
                      value={userItem.role} 
                      onChange={(e) => handleRoleUpdate(userItem.user_id, e.target.value)}
                      disabled={updatingRoles.has(Number(userItem.user_id))}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #00ff9d33',
                        background: 'rgba(255,255,255,0.07)',
                        color: '#fff',
                        fontSize: '0.9rem'
                      }}
                    >
                      <option value="user">{t('user')}</option>
                      <option value="admin">{t('admin')}</option>
                      <option value="dev">{t('dev')}</option>
                    </select>

                    {/* Debug info */}
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: '#666', 
                      marginTop: '5px',
                      padding: '5px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '4px'
                    }}>
                      Debug: user_id={userItem.user_id} | 
                      expanded={expandedUsers.has(userItem.user_id) ? 'SÍ' : 'NO'} | 
                      loading={loadingUserDetails.has(userItem.user_id) ? 'SÍ' : 'NO'} | 
                      hasDetails={userDetails[userItem.user_id] ? 'SÍ' : 'NO'}
                    </div>



                    {expandedUsers.has(userItem.user_id) && (
                      <div style={{ marginTop: '20px' }}>
                                                  {loadingUserDetails.has(userItem.user_id) ? (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px',
                            color: '#00ff9d',
                            fontSize: '1.1rem'
                          }}>
                            🔄 Cargando detalles del usuario...
                          </div>
                        ) : userDetails[userItem.user_id] ? (
                          <>
                            <h4 style={{ color: '#00ff9d', margin: '0 0 15px 0', fontSize: '1.1rem' }}>Licencias Activas</h4>
                            {userDetails[userItem.user_id].licenses.length > 0 ? (
                              userDetails[userItem.user_id].licenses.map((license: any) => {
                                const licenseType = getLicenseTypeLabel(license.license_type);
                                const timeLeft = getTimeLeft(license.expires_at);
                                const purchaseDate = license.create_at || license.created_at;
                                return (
                                  <div key={license.license_id || license.id} style={{ 
                                    background: 'rgba(17, 17, 17, 0.9)', 
                                    borderRadius: '15px', 
                                    padding: '20px', 
                                    border: '1px solid #00ff9d33',
                                    backdropFilter: 'blur(10px)',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px'
                                  }}>
                                    <img 
                                      src={getProductImageUrl({ name: license.product_name, image: license.image_url })} 
                                      alt={license.product_name || 'Producto'}
                                      style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        borderRadius: '8px', 
                                        objectFit: 'cover',
                                        border: '2px solid #00ff9d33'
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.src = '/logo.png';
                                      }}
                                    />
                                    <div style={{ flex: 1 }}>
                                      <h4 style={{ color: '#00ff9d', margin: '0 0 5px 0' }}>{license.product_name || 'Producto'}</h4>
                                      <span style={{ 
                                        background: licenseType.color,
                                        color: '#111',
                                        padding: '3px 12px',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        marginRight: '8px',
                                        display: 'inline-block',
                                        boxShadow: '0 2px 8px rgba(0,255,157,0.15)'
                                      }}>{licenseType.label}</span>
                                      <div style={{ 
                                        background: 'rgba(0, 255, 157, 0.1)', 
                                        border: '1px solid #00ff9d33', 
                                        borderRadius: '8px', 
                                        padding: '15px', 
                                        margin: '15px 0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                      }}>
                                        <span style={{ color: '#00ff9d', fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '1px' }}>
                                          {selectedLicense === license.license_key ? license.license_key : '••••••••••••••••••••••••••••••'}
                                        </span>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLicense(license.license_key);
                                            setShowPasswordModal(true);
                                          }}
                                          style={{
                                            background: 'linear-gradient(45deg, #00ff9d, #00cc7e)',
                                            color: 'black',
                                            border: 'none',
                                            padding: '8px 15px',
                                            borderRadius: '5px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Copiar clave
                                        </button>
                                      </div>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.9rem', alignItems: 'center' }}>
                                        <span>Comprada: {purchaseDate ? new Date(purchaseDate).toLocaleDateString('es-ES') : '-'}</span>
                                        {/* Contador de días restantes */}
                                        {timeLeft && license.expires_at && (
                                          <span style={{ 
                                            background: timeLeft === "Expirada" || timeLeft.includes('0d') ? '#ff3366' : '#00ff9d',
                                            color: '#111',
                                            padding: '4px 14px',
                                            borderRadius: '16px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            margin: '0 12px',
                                            boxShadow: '0 2px 8px rgba(0,255,157,0.10)'
                                          }}>
                                            {timeLeft}
                                          </span>
                                        )}
                                        {license.expires_at && (
                                          <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: 8 }}>
                                            Expira: {new Date(license.expires_at).toLocaleDateString('es-ES')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteUserLicense(license.license_id || license.id, userItem.user_id);
                                      }}
                                      style={{ 
                                        background: 'linear-gradient(45deg, #ff9800, #ff5722)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 15px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                                No tiene licencias activas
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '20px',
                            color: '#00ff9d',
                            fontSize: '1.1rem'
                          }}>
                            🔄 Cargando detalles del usuario...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <ConfirmModal
              open={confirmOpen}
              title="Confirmar eliminación"
              message="¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer."
              onConfirm={confirmDeleteUser}
              onCancel={() => setConfirmOpen(false)}
            />

            {/* Modal para verificar contraseña de usuario */}
            {showUserPasswordModal && (
              <PasswordModal>
                <PasswordModalContent>
                  <h3 style={{ color: '#00ff9d', margin: '0 0 20px 0', textAlign: 'center' }}>
                    Verificar Contraseña
                  </h3>
                  <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
                    Ingresa la contraseña maestra para ver la contraseña del usuario
                  </p>
                  <PasswordInput
                    type="password"
                    placeholder="Contraseña maestra"
                    value={userPasswordInput}
                    onChange={(e) => setUserPasswordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleMasterPasswordSubmit();
                      }
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <ModalButton onClick={handleMasterPasswordSubmit}>
                      Verificar
                    </ModalButton>
                    <CancelButton onClick={handleClosePasswordModal}>
                      Cancelar
                    </CancelButton>
                  </div>
                </PasswordModalContent>
              </PasswordModal>
            )}
          </MainContent>
        </ProfileContainer>
      </Container>

      {showPasswordModal && (
        <PasswordModal>
          <PasswordModalContent>
            <h3>{t('enter_password')}</h3>
            <PasswordInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CancelButton onClick={() => {
                setShowPasswordModal(false);
                setPassword('');
                setSelectedLicense(null);
              }}>
                {t('cancel')}
              </CancelButton>
              <ModalButton onClick={() => {
                if (selectedLicense) handleCopyLicense(selectedLicense);
                setShowPasswordModal(false);
                setPassword('');
                setSelectedLicense(null);
              }}>
                {t('copy')}
              </ModalButton>
            </div>
          </PasswordModalContent>
        </PasswordModal>
      )}

      {/* Modal para contraseña maestra */}
      {showMasterPasswordModal && (
        <PasswordModal>
          <PasswordModalContent>
            <h3 style={{ color: '#00ff9d', margin: '0 0 20px 0', textAlign: 'center' }}>
              Verificar Contraseña Maestra
            </h3>
            <p style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
              Ingresa la contraseña maestra para ver la contraseña del usuario
            </p>
            <PasswordInput
              type="password"
              placeholder="Contraseña maestra"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleMasterPasswordSubmit();
                }
              }}
            />
            {passwordError && (
              <p style={{ color: '#ff6b6b', marginTop: '10px', textAlign: 'center' }}>
                {passwordError}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <ModalButton onClick={handleMasterPasswordSubmit}>
                Verificar
              </ModalButton>
              <CancelButton onClick={handleClosePasswordModal}>
                Cancelar
              </CancelButton>
            </div>
          </PasswordModalContent>
        </PasswordModal>
      )}
    </>
  );
};

export default Profile;