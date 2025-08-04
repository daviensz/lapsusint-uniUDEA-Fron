import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, getUserDetails, deleteUserLicense, deleteUser } from '../api/auth';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
`;

const Title = styled.h1`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(0,255,157,0.5);
`;

const UserCard = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
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
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const UserInfo = styled.div`
  color: #fff;
  flex: 1;
`;

const Username = styled.h3`
  color: #00ff9d;
  margin: 0 0 10px 0;
  font-size: 1.3rem;
`;

const UserEmail = styled.p`
  color: #888;
  margin: 5px 0;
  font-size: 0.9rem;
`;

const UserStats = styled.div`
  display: flex;
  gap: 20px;
  margin: 15px 0;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  background: rgba(0, 255, 157, 0.1);
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #00ff9d33;
`;

const StatLabel = styled.div`
  color: #00ff9d;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  color: #fff;
  font-size: 1.1rem;
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'danger' | 'warning' | 'primary' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return 'linear-gradient(45deg, #ff6b6b, #ff1744)';
      case 'warning': return 'linear-gradient(45deg, #ff9800, #ff5722)';
      default: return 'linear-gradient(45deg, #00ff9d, #00cc7e)';
    }
  }};
  color: #111;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,255,157,0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LicensesSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h4`
  color: #00ff9d;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
`;

const LicenseCard = styled.div`
  background: rgba(17, 17, 17, 0.8);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #00ff9d22;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const LicenseInfo = styled.div`
  flex: 1;
  color: #fff;
`;

const LicenseKey = styled.div`
  color: #00ff9d;
  font-family: monospace;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const LicenseDetails = styled.div`
  color: #888;
  font-size: 0.8rem;
`;

const ErrorMsg = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 8px;
`;

const SuccessMsg = styled.div`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(0, 255, 157, 0.1);
  border-radius: 8px;
`;

const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 18px;
  background: #222;
  border: 2px solid #00ff9d44;
`;

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  is_active: boolean;
  profile_pic?: string; // Added profile_pic to the interface
}

interface UserDetails {
  user: User;
  licenses_count: number;
  orders_count: number;
  total_spent: number;
  licenses: Array<{
    id: number;
    key: string;
    license_type: string;
    created_at: string;
    expires_at: string;
    is_active: boolean;
    product: {
      id: number;
      name: string;
      image: string;
    };
  }>;
  orders: Array<{
    id: number;
    license_type: string;
    amount: number;
    status: string;
    created_at: string;
    product: {
      id: number;
      name: string;
    };
  }>;
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
// Utilidad para calcular el tiempo restante en formato días:horas:minutos:segundos
function getTimeLeft(expiry: string | Date | undefined): string | null {
  if (!expiry) return null;
  const now = new Date();
  const exp = new Date(expiry);
  let diff = exp.getTime() - now.getTime();
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${days}d:${hours.toString().padStart(2, '0')}h:${minutes.toString().padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
}
function getProductImageUrl(product: { image?: string; name?: string } | undefined) {
  if (!product) return '/logo.png';
  if (product.image) {
    if (product.image.startsWith('http')) return product.image;
    if (product.image.startsWith('/static')) return `http://localhost:8000${product.image}`;
    return `http://localhost:8000/static/${product.image.replace(/^\/static\/?/, '')}`;
  }
  return `/static/${product.name?.toLowerCase().replace(/\s/g, '') || 'logo'}.png`;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [userDetails, setUserDetails] = useState<Record<number, UserDetails>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  // Estado para forzar actualización del contador cada segundo
  const [tick, setTick] = useState(0);
  // Estado para mostrar/ocultar clave de licencia por usuario/licencia
  const [visibleLicense, setVisibleLicense] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      setError('Debes estar autenticado');
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers(token);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, user]);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUserExpand = async (userId: number) => {
    if (userDetails[userId]) {
      setExpandedUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
        } else {
          newSet.add(userId);
        }
        return newSet;
      });
      return;
    }

    try {
      const details = await getUserDetails(token, userId);
      setUserDetails(prev => ({ ...prev, [userId]: details }));
      setExpandedUsers(prev => new Set([...Array.from(prev), userId]));
    } catch (err: any) {
      setError(err.message || 'Error al cargar detalles del usuario');
    }
  };

  const handleDeleteLicense = async (licenseId: number, userId: number) => {
    try {
      await deleteUserLicense(token, licenseId);
      
      // Actualizar los detalles del usuario
      setUserDetails(prev => {
        const userDetail = prev[userId];
        if (userDetail) {
          return {
            ...prev,
            [userId]: {
              ...userDetail,
              licenses: userDetail.licenses.filter(l => l.id !== licenseId),
              licenses_count: userDetail.licenses_count - 1
            }
          };
        }
        return prev;
      });
      
      setSuccess('Licencia eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar licencia');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await deleteUser(token, userId);
      
      // Remover usuario de la lista
      setUsers(prev => prev.filter(u => u.id !== userId));
      setUserDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[userId];
        return newDetails;
      });
      
      setSuccess('Usuario eliminado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: '#00ff9d', fontSize: '1.2rem' }}>
          Cargando gestión de usuarios...
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMsg>{error}</ErrorMsg>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Title>Gestión de Usuarios</Title>
        
        {success && <SuccessMsg>{success}</SuccessMsg>}
        {error && <ErrorMsg>{error}</ErrorMsg>}

        {users.map((user) => (
          <UserCard key={user.id}>
            <UserHeader>
              {/* Avatar de usuario */}
              <Avatar
                src={user.profile_pic ? `/profile_pics/${user.profile_pic}` : '/logo.png'}
                alt={user.display_name || user.username}
                onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              />
              <UserInfo>
                <Username>{user.display_name || user.username}</Username>
                <UserEmail>{user.email}</UserEmail>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Usuario: {user.username} • Creado: {formatDate(user.created_at)}
                </div>
                
                {userDetails[user.id] && (
                  <UserStats>
                    <StatItem>
                      <StatLabel>Licencias</StatLabel>
                      <StatValue>{userDetails[user.id].licenses_count}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Órdenes</StatLabel>
                      <StatValue>{userDetails[user.id].orders_count}</StatValue>
                    </StatItem>
                    <StatItem>
                      <StatLabel>Total Gastado</StatLabel>
                      <StatValue>{formatCurrency(userDetails[user.id].total_spent)}</StatValue>
                    </StatItem>
                  </UserStats>
                )}
              </UserInfo>
              
              <ActionButtons>
                <Button onClick={() => handleUserExpand(user.id)}>
                  {expandedUsers.has(user.id) ? 'Ocultar' : 'Ver Detalles'}
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                  Eliminar Usuario
                </Button>
              </ActionButtons>
            </UserHeader>

            {expandedUsers.has(user.id) && userDetails[user.id] && (
              <LicensesSection>
                <SectionTitle>Licencias Activas</SectionTitle>
                
                {userDetails[user.id].licenses.length > 0 ? (
                  userDetails[user.id].licenses.map((license) => {
                    console.log('Renderizando licencia:', license);
                    const licenseType = getLicenseTypeLabel(license.license_type);
                    const timeLeft = getTimeLeft(license.expires_at);
                    return (
                      <LicenseCard key={license.id}>
                        <ProductImage 
                          src={getProductImageUrl(license.product)} 
                          alt={license.product.name}
                          onError={(e) => {
                            e.currentTarget.src = '/logo.png';
                          }}
                        />
                        <LicenseInfo>
                          <LicenseKey>
                            {visibleLicense === license.key ? license.key : '••••••••••••••••••••••••••••••'}
                          </LicenseKey>
                          <LicenseDetails>
                            <span style={{ color: '#00ff9d', fontWeight: 'bold', marginRight: 8 }}>{license.product.name}</span>
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
                            <span style={{ color: '#888', fontSize: '0.9rem', marginLeft: 8 }}>
                              Creada: {formatDate(license.created_at)}
                            </span>
                            {timeLeft && license.expires_at && (
                              <span style={{ 
                                background: timeLeft.startsWith('0d:00h:00m:') ? '#ff3366' : '#00ff9d',
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
                                Expira: {formatDate(license.expires_at)}
                              </span>
                            )}
                          </LicenseDetails>
                        </LicenseInfo>
                        <Button 
                          variant="primary"
                          onClick={() => setVisibleLicense(visibleLicense === license.key ? null : license.key)}
                          style={{ marginRight: 8 }}
                        >
                          {visibleLicense === license.key ? 'Ocultar clave' : 'Ver clave'}
                        </Button>
                        <Button 
                          variant="warning" 
                          onClick={() => handleDeleteLicense(license.id, user.id)}
                        >
                          Eliminar
                        </Button>
                      </LicenseCard>
                    );
                  })
                ) : (
                  <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                    No tiene licencias activas
                  </div>
                )}
              </LicensesSection>
            )}
          </UserCard>
        ))}
      </Content>
    </Container>
  );
};

export default UserManagement; 