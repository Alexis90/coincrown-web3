import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from 'semantic-ui-react'

export default ({ children }) => {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  );
};
