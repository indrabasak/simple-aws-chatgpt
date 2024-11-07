import React from 'react';
import logo from '../assets/autodesk-logo.png';

const Navbar: React.FC = () => {
  return (
    <nav className=" p-4 flex bg-black text-white text-xl fixed top-0  left-0 right-0  z-20 shadow-md">
      <a href="#" className="flex gap-2 items-center flex-1">
        <img src={logo} className="w-50 h-8" />
        <span className="font-medium"></span>
      </a>
    </nav>
  );
};

export default Navbar;
