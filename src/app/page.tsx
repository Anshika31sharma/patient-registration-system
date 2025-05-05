import React from 'react';
import Register from './register';
import Navbar from '@/components/Navbar';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto">
       <Navbar/>
       <Register/>
    </div>
  );
};

export default HomePage;
