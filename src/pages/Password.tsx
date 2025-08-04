import React, { useState } from 'react';
import styled from 'styled-components';
import MatrixBackground from '../components/MatrixBackground';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

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

const InfoText = styled.p`
  color: #00ff9d;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 20px;
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

const BackLink = styled.div`
  text-align: center;
  margin-top: 10px;
  a {
    color: #00ff9d;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.3s;
    &:hover {
      color: #00cc7e;
    }
    i {
      margin-right: 5px;
    }
  }
`;

const Password: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(t('password_reset_sent', { email }));
  };

  return (
    <>
      <MatrixBackground />
      <Container>
        <FormWrapper>
          <Logo src={logo} alt="Logo" />
          <Title>{t('recover_password')}</Title>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InfoText>
              {t('password_reset_info')}
            </InfoText>
            <SubmitButton type="submit">
              <span>{t('send_link')}</span>
              <i className="fas fa-paper-plane"></i>
            </SubmitButton>
            <BackLink>
              <Link to="/login">
                <i className="fas fa-arrow-left"></i> {t('back_to_login')}
              </Link>
            </BackLink>
          </form>
        </FormWrapper>
      </Container>
    </>
  );
};

export default Password;