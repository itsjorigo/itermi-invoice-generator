import React from 'react';

const Header = () => {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            ITERMI Invoice Generator
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
