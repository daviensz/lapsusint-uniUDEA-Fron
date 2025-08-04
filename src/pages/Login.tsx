import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/auth';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginForm = styled(motion.form)`
  background: rgba(0, 0, 0, 0.9);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(0, 255, 157, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(45deg, #00ff9d, #00cc7e);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  position: relative;
  label {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(0, 255, 157, 0.3);
    border-radius: 10px;
    padding: 15px;
    transition: all 0.3s;
    &:focus-within {
      border-color: #00ff9d;
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
    }
    i {
      color: #00ff9d;
      margin-right: 10px;
      font-size: 1.1rem;
    }
    input {
      background: none;
      border: none;
      color: white;
      flex: 1;
      font-size: 1rem;
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff3366;
  margin-bottom: 16px;
  text-align: center;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: #000;
  border: none;
  padding: 12px 0;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const FormLinks = styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.3s;
    &:hover {
      color: #00cc7e;
    }
  }
`;

const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log("Attempting login with:", formData.username);
      const data = await apiLogin(formData.username, formData.password);
      console.log("Login successful, data:", data);
      await login(data.access_token);
      console.log("Login context updated, navigating to /");
      navigate('/');
    } catch (err: any) {
      console.log("Login error:", err);
      setError(t('error_invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
      >
        <Title>{t('login')}</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <label>
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder={t('username')}
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
        </FormGroup>
        <FormGroup>
          <label>
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
        </FormGroup>
        <SubmitButton
          type="submit"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          disabled={loading}
        >
          {loading ? t('loading') : t('login')}
        </SubmitButton>
        <FormLinks>
          <Link to="/password">{t('forgot_password')}</Link>
          <Link to="/signup">{t('no_account')}</Link>
        </FormLinks>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;