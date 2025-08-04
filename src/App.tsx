import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ModalProvider } from './context/ModalContext';
import Header from './components/Header';
import MatrixBackground from './components/MatrixBackground';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Password from './pages/Password';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Download from './pages/Download';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
  }

  body {
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    background-color: #000;
    color: #fff;
    line-height: 1.6;
  }

  html {
    scroll-behavior: smooth;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDownloadPage = location.pathname.startsWith('/download');

  return (
    <AppContainer>
      {!isDownloadPage && <MatrixBackground />}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/password" element={<Password />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/download/:orderId" element={<Download />} />
      </Routes>
      <ProductModal />
      <CartModal />
      {/* ToastContainer para notificaciones globales */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ModalProvider>
        <GlobalStyle />
        <AppContent />
      </ModalProvider>
    </Router>
  );
};

export default App;