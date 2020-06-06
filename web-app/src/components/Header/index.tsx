import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { title } = props;

  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
