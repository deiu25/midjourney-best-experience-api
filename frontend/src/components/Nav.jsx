import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-wrap place-items-center h-16 bg-gray-900 text-white w-full">
      <section className="relative mx-auto w-full">
        <nav className="flex justify-between items-center w-full">
          <div className="px-5 xl:px-12 py-6 flex items-center w-full">
            <Link className="text-3xl font-bold font-heading text-[#9333EA]" to="/">
              Image Gen.
            </Link>
            <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
              <li><Link className="hover:text-gray-200" to="/">Home</Link></li>
              <li><Link className="hover:text-gray-200" to="/create">Create</Link></li>
              <li><Link className="hover:text-gray-200" to="/tasks">Collections</Link></li>
              <li><Link className="hover:text-gray-200" to="/tasks">Contact Me</Link></li>
            </ul>
            <div className="hidden xl:flex items-center space-x-5">
              <Link className="hover:text-gray-200" to="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
              <Link className="flex items-center hover:text-gray-200" to="#">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="md:hidden flex mr-6 items-center">
            <button className="navbar-burger flex items-center p-3" onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
      </section>
      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50">
          <button className="absolute top-4 right-4 p-3" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ul className="space-y-6 text-center">
            <li><Link className="text-3xl font-semibold hover:text-gray-200" to="/" onClick={toggleMenu}>Home</Link></li>
            <li><Link className="text-3xl font-semibold hover:text-gray-200" to="/create" onClick={toggleMenu}>Create</Link></li>
            <li><Link className="text-3xl font-semibold hover:text-gray-200" to="/tasks" onClick={toggleMenu}>Collections</Link></li>
            <li><Link className="text-3xl font-semibold hover:text-gray-200" to="/tasks" onClick={toggleMenu}>Contact Me</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Nav;
