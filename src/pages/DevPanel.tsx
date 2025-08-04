import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole, getSystemStatistics, getUserDetails } from '../api/auth';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const PanelContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  position: relative;
  z-index: 10;
`;

const MainContent = styled.div`
  background: rgba(24, 24, 24, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid #00ff9d44;
  box-shadow: 0 8px 32px rgba(0,255,157,0.1);
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

const Title = styled.h1`
  color: #00ff9d;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(0,255,157,0.5);
`;

const SectionTitle = styled.h2`
  color: #00ff9d;
  margin-bottom: 20px;
  font-size: 1.5rem;
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

const Username = styled.h3`
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

const Button = styled.button`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
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

const StatsCard = styled.div`
  background: rgba(34, 34, 34, 0.8);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #00ff9d33;
`;

const StatTitle = styled.h3`
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

interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  is_active: boolean;
}

interface SystemStats {
  total_users: number;
  total_products: number;
  licenses: {
    total: number;
    sold: number;
    pending: number;
  };
  payments: {
    by_type: Record<string, { count: number; amount: number }>;
    total_revenue: number;
  };
  recent_activity: Array<{
    type: string;
    user: string;
    product: string;
    amount: number;
    status: string;
    date: string;
  }>;
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

const DevPanel: React.FC = () => {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingRoles, setUpdatingRoles] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!token || !user) {
      setError('Debes estar autenticado');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          getAllUsers(token),
          getSystemStatistics(token)
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.add(userId);
        return newSet;
      });
      await updateUserRole(token, userId, newRole);
      
      // Actualizar la lista de usuarios
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole, is_admin: newRole === 'admin' || newRole === 'dev' } : user
      ));
      
      setSuccess('Rol actualizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar rol');
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
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
          Cargando panel de desarrollo...
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
      <PanelContainer>
        <MainContent>
          <Title>Panel de Desarrollo</Title>
          
          {success && <SuccessMsg>{success}</SuccessMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <SectionTitle>Gestión de Usuarios</SectionTitle>
          
          {users.map((user) => (
            <UserCard key={user.id}>
              <UserHeader>
                <UserInfo>
                  <Username>{user.username}</Username>
                  <UserEmail>{user.email}</UserEmail>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Creado: {formatDate(user.created_at)}
                  </div>
                </UserInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RoleBadge role={user.role}>
                    {user.role.toUpperCase()}
                  </RoleBadge>
                  <RoleSelect
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                    disabled={updatingRoles.has(user.id)}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="dev">Desarrollador</option>
                  </RoleSelect>
                </div>
              </UserHeader>
            </UserCard>
          ))}
        </MainContent>

        <Sidebar>
          <SectionTitle>Estadísticas del Sistema</SectionTitle>
          
          {stats && (
            <>
              <StatsCard>
                <StatTitle>Total de Usuarios</StatTitle>
                <StatValue>{stats.total_users}</StatValue>
                <StatDescription>Número total de usuarios registrados</StatDescription>
              </StatsCard>

              <StatsCard>
                <StatTitle>Total de Productos</StatTitle>
                <StatValue>{stats.total_products}</StatValue>
                <StatDescription>Productos disponibles en el sistema</StatDescription>
              </StatsCard>

              <StatsCard>
                <StatTitle>Total de Licencias</StatTitle>
                <StatValue>{stats.licenses.total}</StatValue>
                <StatDescription>
                  {stats.licenses.sold} vendidas • {stats.licenses.pending} en pedidos
                </StatDescription>
              </StatsCard>

              <StatsCard>
                <StatTitle>Total de Pagos</StatTitle>
                <StatValue>{formatCurrency(stats.payments.total_revenue)}</StatValue>
                <StatDescription>
                  {Object.entries(stats.payments.by_type).map(([method, data]) => 
                    `${method}: ${data.count}`
                  ).join(' • ')}
                </StatDescription>
              </StatsCard>

              <SectionTitle style={{ marginTop: '20px' }}>Actividad Reciente</SectionTitle>
              
              {stats.recent_activity.slice(0, 5).map((activity, index) => (
                <StatsCard key={index}>
                  <div style={{ color: '#00ff9d', fontSize: '0.9rem', marginBottom: '5px' }}>
                    {activity.user}
                  </div>
                  <div style={{ color: '#fff', fontSize: '0.8rem' }}>
                    {activity.product} - {formatCurrency(activity.amount)}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.7rem' }}>
                    {formatDate(activity.date)} • {activity.status}
                  </div>
                </StatsCard>
              ))}
            </>
          )}
        </Sidebar>
      </PanelContainer>
    </Container>
  );
};

export default DevPanel; 