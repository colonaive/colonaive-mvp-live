// /home/project/src/components/Header.tsx

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import ColonaiveLogo from './ColonaiveLogo';
// ✅ IMPORT the single source of truth for routing
import { getDashboardRoute } from './ProtectedRoute';

const educationLinks = [
  { label: "Patient Education", path: "/education/patients" },
  { label: "Clinician Education", path: "/education/clinicians" },
  { label: "FAQs", path: "/education/faqs" },
  { label: "Newsroom", path: "/education/newsroom" },
  { label: "Resources", path: "/education/resources" },
  { label: "Upcoming Events", path: "/upcoming-events" }
];
const screeningLinks = [
  { label: "Colonoscopy (Gold Standard)", path: "/education/patients/colonoscopy-gold-standard" },
  { label: "Screening Blood Test", path: "/get-screened" },
  { label: "Find a GP", path: "/find-a-gp" },
  { label: "Find a Specialist", path: "/find-a-specialist" }
];
const pillarLinks = [
  { label: "RID-CRC PUB™", path: "/pillars/rid-crc-pub" },
  { label: "RID-CRC SGP™", path: "/pillars/rid-crc-sgp" },
  { label: "RID-CRC GOV™", path: "/pillars/rid-crc-gov" },
  { label: "RID-CRC CSR™", path: "/pillars/rid-crc-csr" },
  { label: "RID-CRC EDU™", path: "/pillars/rid-crc-edu" }
];
const aboutLinks = [
  { label: "Our Story", path: "/about-us" },
  { label: "Our Advisors", path: "/about/advisors" },
  { label: "Vision 2035", path: "/vision2035" },
  { label: "CSR Showcase", path: "/csr-showcase" }
];

export const getJoinLinks = (isAuthenticated: boolean) => {
  return isAuthenticated
    ? [
        { label: "Share Your Story", path: "/share-your-story" },
        { label: "Read Real Stories", path: "/stories" },
        { label: "Refer a Friend", path: "/refer-friend" }
      ]
    : [
        { label: "Member/Patient Sign-Up", path: "/signup/champion" },
        { label: "Clinic Sign-Up", path: "/register/clinic" },
        { label: "Specialist Sign-Up", path: "/register/specialist" },
        { label: "Sponsor/CSR Sign-Up", path: "/register/corporate" },
        { label: "Read Real Stories", path: "/stories" }
      ];
};

// ✅ REMOVED the duplicate function from this file.

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isTrialsHovered, setIsTrialsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const menuLeaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { user, isAuthenticated, signOut, userType } = useAuth();

  const joinLinks = getJoinLinks(isAuthenticated);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleMenuEnter = (menuKey: string) => {
    if (menuLeaveTimeout.current) clearTimeout(menuLeaveTimeout.current);
    setActiveSubmenu(menuKey);
  };

  const handleMenuLeave = () => {
    menuLeaveTimeout.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 200);
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
    navigate('/');
  };

  const renderDropdown = (
    label: string,
    links: { label: string; path: string }[],
    menuKey: string
  ) => (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={() => handleMenuEnter(menuKey)}
      onMouseLeave={handleMenuLeave}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white hover:text-teal-300">
        {label}
        <ChevronDown
          className={`w-3 h-3 text-white transition-transform ${
            activeSubmenu === menuKey ? 'rotate-180' : ''
          }`}
        />
      </button>
      <span
        className={`absolute bottom-[20px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform transition-transform duration-300 ease-out origin-center ${
          activeSubmenu === menuKey ? 'scale-x-100' : 'scale-x-0'
        }`}
      ></span>
      {activeSubmenu === menuKey && (
        <div className="absolute top-full left-0 w-60 mt-0 rounded-b-lg bg-[#0b1e3b] shadow-lg ring-1 ring-white/10 z-[9999]">
          <ul className="py-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="group relative block w-full px-4 py-2 text-sm text-white hover:text-teal-300 transition-colors duration-300 text-left"
                  onClick={handleClose}
                >
                  <span className="relative inline-block">
                    {link.label}
                    <span className="absolute bottom-[-2px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center"></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSearchBar = () => (
    <div className="border-t border-white/10 py-3 bg-[#0B1E3B]">
      <Container>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Explore topics, care, coverage"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2 pr-10 text-sm rounded-full border border-white/20 bg-white/5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
            />
            <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </Container>
    </div>
  );

  const renderChampionButton = () => {
    if (isAuthenticated && user) {
      const userName = user.user_metadata?.full_name || user.email;
      // Using the centralized, correct function
      const dashboardPath = getDashboardRoute(userType);

      // This logic must also use the correct 'GPClinic' value
      let profileSettingsPath = '/profile/champion';
      if (userType === 'GPClinic') {
        profileSettingsPath = '/profile/gp-clinic';
      } else if (userType === 'specialist') {
        profileSettingsPath = '/profile/specialist';
      } else if (userType === 'corporate_contact') {
        profileSettingsPath = '/dashboard/corporate';
      }
      
      return (
        <div key={user.id} className="relative" onMouseEnter={() => handleMenuEnter('userMenu')} onMouseLeave={handleMenuLeave}>
          <button
            type="button"
            className="bg-[#006BA6] hover:bg-[#005C8D] text-white rounded-full px-4 py-2 text-sm shadow-md flex items-center space-x-2"
          >
            <span>{userName?.split(' ')[0] || 'User'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === 'userMenu' ? 'rotate-180' : ''}`} />
          </button>

          {activeSubmenu === 'userMenu' && (
            <div className="absolute top-full right-0 w-56 mt-2 rounded-lg bg-white shadow-xl ring-1 ring-black/5 z-[9999]">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 truncate" title={userName}>{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userType?.replace(/_/g, ' ')} Account</p>
                </div>
                <Link to={dashboardPath} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleClose}>My Dashboard</Link>
                <Link to={profileSettingsPath} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleClose}>Profile Settings</Link>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <Link to="/login">
          <Button variant="primary" size="sm" className="bg-[#006BA6] hover:bg-[#005C8D] text-white rounded-full px-5 py-2 shadow-md">
            Champion Sign In
          </Button>
        </Link>
      );
    }
  };

  const renderMobileMenu = () => (
    <div className="absolute top-full left-0 w-full bg-[#0B1E3B] lg:hidden">
      <nav className="flex flex-col space-y-2 p-4">
        {[
          { label: 'Education', links: educationLinks, key: 'edu' },
          { label: 'Get Screened', links: screeningLinks, key: 'screen' },
          { label: 'Movement Pillars', links: pillarLinks, key: 'pillars' },
          { label: 'Join the Movement', links: joinLinks, key: 'join' },
          { label: 'About Us', links: aboutLinks, key: 'about' }
        ].map(item => (
          <div key={item.key} className="text-white">
            <button
              onClick={() => setActiveSubmenu(activeSubmenu === item.key ? null : item.key)}
              className="w-full flex justify-between items-center py-2 font-semibold"
            >
              <span>{item.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === item.key ? 'rotate-180' : ''}`} />
            </button>
            {activeSubmenu === item.key && (
              <ul className="pl-4 border-l-2 border-teal-400/50">
                {item.links.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} onClick={handleClose} className="block py-2 text-sm hover:text-teal-300">{link.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <Link to="/clinical-trials" onClick={handleClose} className="text-white font-semibold py-2">Clinical Trials</Link>
      </nav>
    </div>
  );

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-50 shadow-sm">
        <div className="bg-[#004F8C] py-1">
          <Container className="flex justify-end items-center h-10">
            {renderChampionButton()}
          </Container>
        </div>
        <div className="bg-[#0B1E3B]">
          <Container className="flex justify-between items-center h-[72px]">
            <div className="flex-1 flex justify-start">
               <Link
                to="/"
                className="group relative transition-transform duration-300 hover:-translate-y-0.5"
                onClick={handleClose}
              >
                <ColonaiveLogo
                  className="text-2xl text-white"
                  accentColorClass="text-teal-400 group-hover:text-teal-300 transition-colors duration-300"
                />
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center"></span>
              </Link>
            </div>
            
            <nav className="hidden lg:flex items-center justify-center flex-shrink-0 h-full">
              {renderDropdown("Education", educationLinks, "edu")}
              {renderDropdown("Get Screened", screeningLinks, "screen")}
              {renderDropdown("Movement Pillars", pillarLinks, "pillars")}
              {renderDropdown("Join the Movement", joinLinks, "join")}
              {renderDropdown("About Us", aboutLinks, "about")}
              <Link
                to="/clinical-trials"
                className="relative text-white text-sm font-semibold px-3 h-full flex items-center hover:text-teal-300"
                onMouseEnter={() => setIsTrialsHovered(true)}
                onMouseLeave={() => setIsTrialsHovered(false)}
              >
                Clinical Trials
                <span
                  className={`absolute bottom-[20px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent transform transition-transform duration-300 ease-out origin-center ${
                    isTrialsHovered ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></span>
              </Link>
            </nav>

            <div className="flex-1 flex justify-end">
              <div className="lg:hidden">
                <button className="p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </Container>
          {isOpen && renderMobileMenu()}
          {renderSearchBar()}
        </div>
      </header>
    </>
  );
};
