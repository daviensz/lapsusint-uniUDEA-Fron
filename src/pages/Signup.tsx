import React, { useState } from 'react';
import styled from 'styled-components';
import MatrixBackground from '../components/MatrixBackground';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { register as apiRegister } from '../api/auth';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const FormWrapper = styled.div`
  background: rgba(0, 0, 0, 0.9);
  padding: 40px 30px;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(0, 255, 157, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const Logo = styled.img`
  display: block;
  margin: 0 auto 20px auto;
  width: 80px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 25px;
  font-size: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(0,255,157,0.3);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;

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
`;

const ErrorMessage = styled.div`
  color: #ff3366;
  margin-bottom: 16px;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #00ff9d;
  margin-bottom: 16px;
  text-align: center;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #00ff9d, #00cc7e);
  color: black;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,255,157,0.3);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #ccc;
  font-size: 0.95rem;
  a {
    color: #00ff9d;
    text-decoration: none;
    margin-left: 5px;
    transition: color 0.3s;
    &:hover {
      color: #00cc7e;
    }
  }
`;

const Signup: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setError(t('passwords_do_not_match'));
      return;
    }

    setLoading(true);
    try {
      await apiRegister({ username: form.username, password: form.password, email: form.email, role: "user" });
      setSuccess(t('signup_success'));
      setForm({ username: '', password: '', confirmPassword: '', email: '' });
    } catch (err: any) {
      setError(err.message || t('signup_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MatrixBackground />
      <Container>
        <FormWrapper>
          <Logo src={logo} alt="Logo" />
          <Title>{t('signup')}</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder={t('username')}
                value={form.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </InputGroup>
            <InputGroup>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder={t('password')}
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </InputGroup>
            <InputGroup>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder={t('confirm_password')}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </InputGroup>
            <InputGroup>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder={t('email')}
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </InputGroup>
            <SubmitButton type="submit" disabled={loading}>
              <span>{loading ? t('loading') : t('signup')}</span>
              <i className="fas fa-arrow-right"></i>
            </SubmitButton>
            <LoginLink>
              {t('already_have_account')}
              <Link to="/login">{t('login')}</Link>
            </LoginLink>
          </form>
        </FormWrapper>
      </Container>
    </>
  );
};

export default Signup;