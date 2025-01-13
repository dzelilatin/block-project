import React, { useState, useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";
import { Logo, Menu } from "../Components/index";

const NavBar = () => {
  const { currentAccount, connectWallet } = useContext(CrowdFundingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuList = ["White Paper", "Project", "Donation", "Members"];

  return (
    <div className="backgroundMain">
      <div className="px-4 py-5 mx-auto max-w-screen-xl md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="inline-flex items-center">
            <Logo color="text-white" />
            <span className="ml-2 text-xl font-bold text-gray-100 uppercase">Company</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {menuList.map((el, i) => (
              <a
                key={i}
                href="/"
                className="text-gray-100 hover:text-teal-300 transition-colors duration-200"
              >
                {el}
              </a>
            ))}
            {!currentAccount && (
              <button
                onClick={connectWallet}
                className="px-6 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-800 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-100"
            >
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            {menuList.map((el, i) => (
              <a
                key={i}
                href="/"
                className="block text-gray-100 hover:text-teal-300 transition-colors duration-200"
              >
                {el}
              </a>
            ))}
            {!currentAccount && (
              <button
                onClick={connectWallet}
                className="w-full px-6 py-2 text-white bg-blue-600 rounded shadow hover:bg-blue-800 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
