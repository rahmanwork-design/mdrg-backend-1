import { useState, useEffect } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, ChevronRight, Phone, Info, User, Building2, FileText,
  Check, ArrowRight, Play, Menu, X, ChevronDown,
  Home, Briefcase, Users, Search, HandshakeIcon, Building, Landmark,
  X as CloseIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CookieConsent from '@/components/CookieConsent';

// ============================================
// TYPES
// ============================================
type PageType = 
  | 'home' | 'login' | 'signup' | 'dashboard' | 'admin-login' | 'admin-dashboard' | 'reset-password' | 'contact' | 'help' 
  | 'services' | 'business-debt' | 'commercial-debt' | 'consumer-debt' 
  | 'corporate-debt' | 'mediation' | 'tracing'
  | 'about' | 'our-story' | 'why-choose-us' | 'faqs'
  | 'callback' | 'make-payment'
  | 'sitemap' | 'terms' | 'privacy' | 'dp-policy' | 'cookie-policy' | 'compliance';

// ============================================
// LOGO COMPONENT
// ============================================
const MDRGLogo = ({ className = '', white = false }: { className?: string; white?: boolean }) => (
  <div className={`flex flex-col ${className}`}>
    <span className={`text-3xl md:text-4xl font-bold tracking-tight ${white ? 'text-white' : 'text-purple-900'}`}>
      MDRG
    </span>
    <span className={`text-xs md:text-sm font-medium tracking-widest uppercase ${white ? 'text-yellow-400' : 'text-purple-700'}`}>
      Managing Debt Responsibly Group
    </span>
  </div>
);

// ============================================
// MAIN NAVIGATION
// ============================================
const MainNavigation = ({ currentPage, setPage }: { currentPage: string; setPage: (page: PageType) => void }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { 
      id: 'services', 
      label: 'SERVICES',
      dropdown: [
        { id: 'business-debt', label: 'Business Debt Recovery' },
        { id: 'commercial-debt', label: 'Commercial Debt Recovery' },
        { id: 'consumer-debt', label: 'Consumer Debt Recovery' },
        { id: 'corporate-debt', label: 'Corporate Debt Collection' },
        { id: 'mediation', label: 'Mediation' },
        { id: 'tracing', label: 'Tracing' },
      ]
    },
    { 
      id: 'about', 
      label: 'ABOUT US',
      dropdown: [
        { id: 'our-story', label: 'Our Story' },
        { id: 'why-choose-us', label: 'Why Choose MDRG?' },
        { id: 'faqs', label: 'FAQs' },
      ]
    },
    { id: 'contact', label: 'CONTACT US' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <div key={item.id} className="relative">
            {item.dropdown ? (
              <div 
                className="relative"
                onMouseEnter={() => item.id === 'services' ? setServicesOpen(true) : setAboutOpen(true)}
                onMouseLeave={() => item.id === 'services' ? setServicesOpen(false) : setAboutOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 ${
                    currentPage === item.id || item.dropdown.some(d => d.id === currentPage)
                      ? 'text-purple-900'
                      : 'text-gray-700 hover:text-purple-900'
                  }`}
                >
                  {item.label} <ChevronDown size={14} />
                </button>
                {(item.id === 'services' ? servicesOpen : aboutOpen) && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[220px] z-50 border">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setPage(subItem.id as PageType);
                          item.id === 'services' ? setServicesOpen(false) : setAboutOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-900"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setPage(item.id as PageType)}
                className={`text-sm font-medium transition-colors py-2 ${
                  currentPage === item.id
                    ? 'text-purple-900 border-b-2 border-purple-900'
                    : 'text-gray-700 hover:text-purple-900'
                }`}
              >
                {item.label}
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-50 p-4 overflow-auto">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <span className="font-semibold text-gray-900">{item.label}</span>
                    <div className="ml-4 mt-2 flex flex-col gap-2">
                      {item.dropdown.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setPage(subItem.id as PageType);
                            setMobileMenuOpen(false);
                          }}
                          className="text-left text-gray-600 hover:text-purple-900"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setPage(item.id as PageType);
                      setMobileMenuOpen(false);
                    }}
                    className="font-semibold text-gray-900 text-left"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

// ============================================
// HEADER COMPONENT
// ============================================
const Header = ({ currentPage, setPage }: { currentPage: string; setPage: (page: PageType) => void }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('mdrg_token');
    setIsLoggedIn(!!token);
  }, [currentPage]);
  
  return (
  <header className="w-full bg-white border-b sticky top-0 z-40">
    {/* Top Bar */}
    <div className="bg-purple-900 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">GENERAL ENQUIRIES</span>
          <a href="tel:02045771660" className="font-bold text-lg hover:text-yellow-400">020 4577 1660</a>
        </div>
        {isLoggedIn ? (
          <button 
            onClick={() => setPage('dashboard')}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-1 rounded font-semibold text-sm hover:bg-green-600"
          >
            <User size={16} /> MY ACCOUNT
          </button>
        ) : (
          <button 
            onClick={() => setPage('login')}
            className="flex items-center gap-2 bg-yellow-400 text-purple-900 px-4 py-1 rounded font-semibold text-sm hover:bg-yellow-500"
          >
            <User size={16} /> CLIENT LOGIN
          </button>
        )}
      </div>
    </div>

    {/* Main Header */}
    <div className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => setPage('home')} className="cursor-pointer">
          <MDRGLogo />
        </button>
        
        <div className="flex items-center gap-4">
          <MainNavigation currentPage={currentPage} setPage={setPage} />
          
          {/* CTA Buttons - Desktop */}
          <div className="hidden xl:flex items-center gap-3">
            <button 
              onClick={() => setPage('callback')}
              className="px-4 py-2 border-2 border-purple-900 text-purple-900 rounded-full text-sm font-semibold hover:bg-purple-900 hover:text-white transition-colors"
            >
              MAKE AN ENQUIRY
            </button>
            <button 
              onClick={() => setPage('make-payment')}
              className="px-4 py-2 border-2 border-purple-900 text-purple-900 rounded-full text-sm font-semibold hover:bg-purple-900 hover:text-white transition-colors"
            >
              MAKE A PAYMENT
            </button>
            <button 
              onClick={() => setPage('signup')}
              className="px-4 py-2 bg-purple-900 text-white rounded-full text-sm font-semibold hover:bg-purple-800 transition-colors"
            >
              SIGN UP FREE
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  );
};

// ============================================
// FOOTER COMPONENT
// ============================================
const Footer = ({ setPage, onCookieSettingsClick }: { setPage: (page: PageType) => void; onCookieSettingsClick?: () => void }) => (
  <footer className="mdrg-footer w-full">
    {/* Main Footer */}
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Contact */}
          <div className="lg:col-span-2">
            <MDRGLogo white className="mb-6" />
            <div className="space-y-2 text-sm">
              <p>
                <span className="mdrg-text-yellow font-semibold">GENERAL ENQUIRIES:</span>{' '}
                <a href="tel:02045771660" className="text-white hover:text-yellow-400">020 4577 1660</a>
              </p>
              <p>
                <span className="mdrg-text-yellow font-semibold">PAYMENT LINE:</span>{' '}
                <a href="tel:02045772503" className="text-white hover:text-yellow-400">020 4577 2503</a>
              </p>
              <p>
                <span className="mdrg-text-yellow font-semibold">EMAIL:</span>{' '}
                <a href="mailto:enquiries@managingdebtresponsiblygroup.co.uk" className="text-white hover:text-yellow-400">enquiries@managingdebtresponsiblygroup.co.uk</a>
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setPage('callback')}
                className="mdrg-btn-outline text-sm"
              >
                REQUEST A CALLBACK
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mdrg-text-yellow font-semibold mb-4">SERVICES</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setPage('business-debt')} className="text-white hover:text-yellow-400">Business Debt Recovery</button></li>
              <li><button onClick={() => setPage('commercial-debt')} className="text-white hover:text-yellow-400">Commercial Debt Recovery</button></li>
              <li><button onClick={() => setPage('consumer-debt')} className="text-white hover:text-yellow-400">Consumer Debt Recovery</button></li>
              <li><button onClick={() => setPage('corporate-debt')} className="text-white hover:text-yellow-400">Corporate Debt Collection</button></li>
              <li><button onClick={() => setPage('mediation')} className="text-white hover:text-yellow-400">Mediation</button></li>
              <li><button onClick={() => setPage('tracing')} className="text-white hover:text-yellow-400">Tracing</button></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="mdrg-text-yellow font-semibold mb-4">ABOUT US</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setPage('our-story')} className="text-white hover:text-yellow-400">Our Story</button></li>
              <li><button onClick={() => setPage('why-choose-us')} className="text-white hover:text-yellow-400">Why Choose MDRG?</button></li>
              <li><button onClick={() => setPage('faqs')} className="text-white hover:text-yellow-400">FAQs</button></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="mdrg-text-yellow font-semibold mb-4">GET IN TOUCH</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setPage('contact')} className="text-white hover:text-yellow-400">CONTACT US</button></li>
              <li><button onClick={() => setPage('make-payment')} className="text-white hover:text-yellow-400">Make a Payment</button></li>
              <li><button onClick={() => setPage('login')} className="text-white hover:text-yellow-400">Client Portal</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Legal Footer */}
    <div className="border-t border-purple-700 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="text-sm text-gray-300">
            <p className="mb-2">
              <span className="mdrg-text-yellow font-semibold">LEGAL INFO</span>
            </p>
            <p className="font-semibold text-white">Managing Debt Responsibly Group</p>
            <p className="mt-2">ICO / Data Protection: ZA123456</p>
          </div>
          <div className="text-sm text-gray-300 lg:text-right">
            <p>Lines are open 9am - 5:15pm today</p>
            <p>© Managing Debt Responsibly Group © 2026.</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-purple-700 text-sm text-gray-300 text-center">
          <button onClick={() => setPage('sitemap')} className="hover:text-yellow-400">Site Map</button> |{' '}
          <button onClick={() => setPage('terms')} className="hover:text-yellow-400">Terms of Use</button> |{' '}
          <button onClick={() => setPage('privacy')} className="hover:text-yellow-400">Privacy Policy</button> |{' '}
          <button onClick={() => setPage('dp-policy')} className="hover:text-yellow-400">DP Policy</button> |{' '}
          <button onClick={() => setPage('cookie-policy')} className="hover:text-yellow-400">Cookie Policy</button> |{' '}
          <button onClick={() => setPage('compliance')} className="hover:text-yellow-400">Compliance</button> |{' '}
          <button onClick={onCookieSettingsClick} className="hover:text-yellow-400">Cookie Settings</button> |{' '}
          <button onClick={() => setPage('admin-login')} className="hover:text-yellow-400">Staff Login</button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Address: 9 Surley Row, Emmer Green, Reading, RG4 8ND.
        </p>
        
        {/* Zoho Partnership */}
        <div className="mt-6 pt-6 border-t border-purple-700">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Powered by</span>
              <img 
                src="/zoho-logo-512.png" 
                alt="Zoho" 
                className="h-6 w-auto"
              />
            </div>
            <p className="text-xs text-gray-500 text-center max-w-2xl">
              Managing Debt Responsibly Group has partnered with Zoho and uses Zoho's business services 
              as part of our operational infrastructure. The Zoho logo is displayed solely to indicate 
              that Zoho is one of our trusted service providers and technology partners. This does not 
              imply ownership, endorsement beyond the service relationship, or any misrepresentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

// ============================================
// PAGE BANNER COMPONENT
// ============================================
const PageBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="page-banner">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
    </div>
  </div>
);

// ============================================
// VIDEO SLIDESHOW COMPONENT
// ============================================
const VideoSlideshow = ({ onClose }: { onClose: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    '/video-frame-1.jpg',
    '/video-frame-2.jpg',
    '/video-frame-3.jpg',
    '/video-frame-4.jpg',
    '/video-frame-5.jpg',
    '/video-frame-6.jpg',
    '/video-frame-7.jpg',
    '/video-frame-8.jpg',
    '/video-frame-9.jpg',
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-purple-900">
          <h3 className="text-lg font-bold text-white">How Debt Recovery Works</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-purple-800 rounded-full text-white"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <div className="aspect-video flex items-center justify-center">
            <img 
              src={slides[currentSlide]} 
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 px-4 py-2 rounded-full">
            <button 
              onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
              className="text-white hover:text-yellow-400"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="text-white hover:text-yellow-400"
            >
              {isPlaying ? <span className="text-xl">⏸</span> : <Play size={20} fill="currentColor" />}
            </button>

            <button 
              onClick={() => goToSlide((currentSlide + 1) % slides.length)}
              className="text-white hover:text-yellow-400"
            >
              <ChevronRight size={24} />
            </button>

            <span className="text-white text-sm ml-2">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="p-4 bg-gray-100 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-purple-900 w-6' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HOME PAGE
// ============================================
const HomePage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Video Modal */}
      {videoModalOpen && (
        <VideoSlideshow onClose={() => setVideoModalOpen(false)} />
      )}
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                Debt recovery,<br />simplified.
              </h1>
              <p className="text-xl text-purple-900 mb-8">
                We've helped thousands recover the money they are owed.
              </p>
              <button 
                onClick={() => setPage('signup')}
                className="mdrg-btn-primary text-lg"
              >
                SIGN UP NOW <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-yellow-400 rounded-full w-80 h-80 flex flex-col items-center justify-center p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Check className="text-purple-900" size={24} />
                    <span className="text-purple-900 font-semibold text-lg">24 Hour client portal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-purple-900" size={24} />
                    <span className="text-purple-900 font-semibold text-lg">15% commission</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-purple-900" size={24} />
                    <span className="text-purple-900 font-semibold text-lg">Guaranteed service level agreement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sign Up Card */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop" 
                alt="Sign up" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">Start a claim instantly.</h3>
                <p className="text-gray-300 text-sm mb-4">
                  There's no need to call, simply create an account to get started with your claim.
                </p>
                <button 
                  onClick={() => setPage('signup')}
                  className="mdrg-btn-primary w-fit"
                >
                  Sign up Now <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Make Payment Card */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop" 
                alt="Make payment" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">Make a payment.</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Click here if we have contacted you and you would like to make a payment.
                </p>
                <button 
                  onClick={() => setPage('make-payment')}
                  className="mdrg-btn-primary w-fit"
                >
                  Make a Payment <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Request Callback Card */}
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop" 
                alt="Request callback" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-bold mb-2">Need more information?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Speak to our team to discuss your options, or receive some free advice.
                </p>
                <button 
                  onClick={() => setPage('callback')}
                  className="mdrg-btn-primary w-fit"
                >
                  Request a callback <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Win No Fee Section */}
      <section className="bg-purple-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            No win, no fee service.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The most cost-effective debt recovery option in the UK with no upfront fee.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How debt recovery works.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop" 
                alt="How it works" 
                className="w-full rounded-lg shadow-lg"
              />
              <button 
                onClick={() => setVideoModalOpen(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer">
                  <Play className="text-purple-900 ml-1" size={32} fill="currentColor" />
                </div>
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Watch our short video explaining our debt recovery process.</h3>
              <button 
                onClick={() => setPage('signup')}
                className="mdrg-btn-primary"
              >
                Sign up now <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Assist With Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What we can assist with.</h2>
          <p className="text-xl text-gray-600 mb-4">We specialise in collecting the following types of debt:</p>
          <p className="text-sm text-gray-500 mb-8">(No FCA registration required for these debt types)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: 'Commercial Debts (B2B)', desc: 'Invoices between businesses, limited companies, partnerships, and sole traders' },
              { icon: Building, title: 'Commercial Rent Arrears', desc: 'Unpaid rent on business premises and commercial properties' },
              { icon: Home, title: 'Residential Rent Arrears', desc: 'Unpaid rent from private tenants and residential properties' },
              { icon: FileText, title: 'Professional Service Fees', desc: 'Unpaid invoices from accountants, solicitors, consultants, and tradespeople' },
              { icon: Phone, title: 'Utility & Telecoms', desc: 'Gas, electricity, water, phone, broadband, and internet service debts' },
              { icon: FileText, title: 'Other Unregulated Debts', desc: 'Gym memberships, parking fines, and other non-credit service fees' },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <item.icon className="text-purple-900 mb-4" size={40} />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-8">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> We do not collect regulated consumer credit debts (loans, credit cards, hire purchase agreements) 
              as these require FCA authorisation. We focus exclusively on unregulated debt types.
            </p>
          </div>
          <div className="text-center mt-8">
            <button 
              onClick={() => setPage('signup')}
              className="mdrg-btn-primary"
            >
              Sign up now <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technology driven.</h2>
              <p className="text-gray-600 mb-6">
                We harness technology to assist our recovery team in finding and contacting debtors from market leading tracing software to internal case management. Everything we do points to adding the necessary pressure to secure the best result for you.
              </p>
              <h3 className="text-2xl font-bold mb-4">Our interactive client portal.</h3>
              <p className="text-gray-600">
                Managing Debt Responsibly Group, driven by technology, have developed an industry leading client portal designed to allow you to completely manage your debt recovery process online.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                alt="Technology" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="py-16 px-4 bg-purple-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            As simple as 1 - 2 - 3.
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            With our fully transparent portal, you can see exactly where you stand while benefiting from our no win, no fee service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Sign up', desc: 'Sign up online and provide the details of all your debts requiring recovery.' },
              { step: '2', title: 'Let us work', desc: 'Let us get to work and stay updated via our simple client portal.' },
              { step: '3', title: 'Get paid', desc: 'Upon successful collection, provide bank details and receive payment.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-900">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => setPage('signup')}
              className="mdrg-btn-primary"
            >
              Sign up now <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our services.</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl">
            Our full suite of services is designed to leave all customers with a positive experience. We believe this is what marks us out as your best choice of debt collection agency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'business-debt', title: 'Business Debt Recovery', icon: Briefcase },
              { id: 'tracing', title: 'Tracing Customers', icon: Search },
              { id: 'mediation', title: 'Mediation', icon: HandshakeIcon },
              { id: 'commercial-debt', title: 'Commercial Debt Recovery', icon: Building },
              { id: 'consumer-debt', title: 'Consumer Debt Recovery', icon: Users },
              { id: 'corporate-debt', title: 'Corporate Debt Recovery', icon: Landmark },
            ].map((service, index) => (
              <button 
                key={index} 
                onClick={() => setPage(service.id as PageType)}
                className="bg-gray-50 p-6 rounded-lg hover:bg-purple-50 transition-colors text-left group"
              >
                <service.icon className="text-purple-900 mb-4 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="font-semibold text-lg">{service.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Testimonials.</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-3xl mx-auto">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-4">Would highly recommend</h3>
            <p className="text-gray-600 mb-6">
              "Excellent to deal with. Managed to get me 100% back of what I was owed. Customer service was exceptional. Would highly recommend if you are a sole trader looking to manage your outstanding payments."
            </p>
            <p className="font-semibold">Jakob Schezny</p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Case studies.</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">MDRG on-site legal team speeds up debt collection process</h3>
            <p className="text-gray-600 mb-4">
              MDRG recently managed to secure over £50,000 for a European company whose debtor was based here in the UK. MDRG works on a number of cases each day for debtors in and outside of the UK. Likewise our customers come to us from around the world. In this case the supplier was an EU company who had supplied goods and services to the debtor. The debtor refused to pay their invoices and tried to avoid payment.
            </p>
            <p className="text-gray-600 mb-6">
              Advice from our legal team on the debt recovery process is essential. They have the knowledge to refute disputes like this. They also know what outcomes are likely for both debtor and client. Their knowledge informs our debt collectors and assists our strategies.
            </p>
            <button className="text-purple-900 font-semibold hover:underline flex items-center gap-2">
              IN FULL: Legal Team debt collection <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================
// PORTAL PAGES
// ============================================
const LoginPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://mdrg-backend-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data (API returns data directly, not data.user)
        localStorage.setItem('mdrg_token', data.data.token);
        localStorage.setItem('mdrg_user', JSON.stringify(data.data));
        // Redirect to dashboard
        setPage('dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 mdrg-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-transparent">
              <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
              <p className="text-gray-300 mb-8">To login, please enter your details below.</p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-white flex items-center gap-2 mb-2">
                    <Mail size={16} /> Email:
                  </Label>
                  <Input name="email" type="email" placeholder="Enter your email" className="mdrg-input" value={formData.email} onChange={handleChange} required />
                </div>
                
                <div>
                  <Label className="text-white flex items-center gap-2 mb-2">
                    <Lock size={16} /> Password:
                  </Label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" className="mdrg-input pr-10" value={formData.password} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setPage('reset-password')} className="text-white hover:text-yellow-400 text-sm">
                    Forgot your password?
                  </button>
                  <button type="submit" disabled={loading} className="mdrg-btn-primary disabled:opacity-50">
                    {loading ? 'Logging in...' : 'LOGIN'} <ChevronRight size={18} />
                  </button>
                </div>
                
                <p className="text-white text-sm">
                  Not registered yet?{' '}
                  <button type="button" onClick={() => setPage('signup')} className="text-yellow-400 hover:underline">
                    Sign up now
                  </button>
                </p>
              </form>
            </div>
            
            <div className="hidden lg:block text-center lg:text-left">
              <p className="text-2xl text-white mb-4">Welcome to the client portal.</p>
              <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                Debt recovery,<br />simplified.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('mdrg_user');
    const token = localStorage.getItem('mdrg_token');
    
    if (!token || !userData) {
      // Not logged in
      setNotLoggedIn(true);
      setLoading(false);
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Error parsing user data:', e);
      setNotLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mdrg_token');
    localStorage.removeItem('mdrg_user');
    setPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (notLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your account.</p>
          <button 
            onClick={() => setPage('login')}
            className="mdrg-btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-purple-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.first_name} {user?.last_name}</h1>
              <p className="text-purple-200 text-sm">Client ID: {user?.client_id}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white text-purple-900 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-purple-900" /> Account Information
              </h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {user?.first_name} {user?.last_name}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Client ID:</span> <span className="font-mono">{user?.client_id}</span></p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Active</span></p>
              </div>
            </div>

            {/* Debt & Payment Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-purple-900" /> Payment Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount Due:</span>
                  <span className="font-semibold">£{(user?.total_debt || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">£{(user?.amount_paid || 0).toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className={`font-bold ${(user?.balance_due || 0) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    £{(user?.balance_due || 0).toLocaleString()}
                  </span>
                </div>
                <div className="mt-4 p-3 rounded-lg text-center font-semibold ${(user?.balance_due || 0) <= 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                  {(user?.balance_due || 0) <= 0 ? '✓ PAID IN FULL' : '⚠ PAYMENT OUTSTANDING'}
                </div>
                {(user?.balance_due || 0) > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Call 020 4577 2503 to make a payment. Quote your Client ID: {user?.client_id}
                  </p>
                )}
              </div>
            </div>

            {/* Make Payment Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Check size={20} className="text-purple-900" /> Make a Payment
              </h2>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">To make a payment:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Call our payment line</li>
                  <li>Quote your Client ID: <span className="font-mono font-semibold">{user?.client_id}</span></li>
                  <li>Follow the IVR instructions</li>
                </ol>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Payment Line:</p>
                  <a href="tel:02045772503" className="text-xl font-bold text-purple-900">020 4577 2503</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setPage('contact')}
                className="mdrg-btn-primary"
              >
                Submit a New Claim
              </button>
              <button 
                onClick={() => setPage('make-payment')}
                className="mdrg-btn-secondary"
              >
                Make a Payment
              </button>
              <button 
                onClick={() => setPage('callback')}
                className="mdrg-btn-secondary"
              >
                Request a Callback
              </button>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-purple-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
            <p className="text-gray-600 mb-4">Our team is here to assist you with any questions.</p>
            <div className="flex items-center gap-4">
              <a href="tel:02045771660" className="mdrg-link font-medium">020 4577 1660</a>
              <span className="text-gray-400">|</span>
              <a href="mailto:enquiries@managingdebtresponsiblygroup.co.uk" className="mdrg-link font-medium">enquiries@managingdebtresponsiblygroup.co.uk</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADMIN LOGIN PAGE
// ============================================
const AdminLoginPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Admin credentials check (hardcoded for now)
    if (formData.email === 'admin@managingdebtresponsiblygroup.co.uk' && formData.password === 'SuperMan@101') {
      localStorage.setItem('mdrg_admin', 'true');
      setPage('admin-dashboard');
    } else {
      setError('Invalid admin credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageBanner title="Admin Login" />
      <div className="flex-1 bg-white py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-purple-900 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
            <p className="text-purple-200 mb-6">Staff login only</p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-white flex items-center gap-2 mb-2">
                  <Mail size={16} /> Admin Email:
                </Label>
                <Input name="email" type="email" placeholder="admin@managingdebtresponsiblygroup.co.uk" className="mdrg-input" value={formData.email} onChange={handleChange} required />
              </div>
              
              <div>
                <Label className="text-white flex items-center gap-2 mb-2">
                  <Lock size={16} /> Password:
                </Label>
                <Input name="password" type="password" placeholder="Password" className="mdrg-input" value={formData.password} onChange={handleChange} required />
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-purple-900 py-3 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50">
                {loading ? 'Logging in...' : 'ADMIN LOGIN'}
              </button>
            </form>
            
            <p className="text-center mt-4 text-sm text-purple-200">
              <button onClick={() => setPage('home')} className="hover:underline">
                ← Back to website
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// LETTER GENERATION FUNCTION
// ============================================
const generateDebtLetter = (customer: any) => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 7);
  
  const letterHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
    .header { border-bottom: 2px solid #1e3a5f; padding-bottom: 15px; margin-bottom: 30px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .logo-section { }
    .logo { font-size: 32px; font-weight: bold; color: #1e3a5f; }
    .tagline { color: #c9a050; font-weight: bold; font-size: 14px; }
    .contact-info { text-align: right; font-size: 12px; color: #666; }
    .date-ref { text-align: right; margin: 20px 0; font-size: 13px; }
    .recipient { margin: 30px 0; line-height: 1.8; }
    .notice-title { background: #1e3a5f; color: white; padding: 12px; text-align: center; font-size: 20px; font-weight: bold; margin: 25px 0; }
    .intro-text { margin: 20px 0; }
    .details-box { background: #f9f9f9; border: 1px solid #ddd; padding: 20px; margin: 20px 0; }
    .details-row { display: flex; margin: 8px 0; }
    .details-label { width: 180px; font-weight: bold; }
    .details-value { flex: 1; }
    .balance-row { background: #fff8e1; padding: 15px; margin: 15px 0; border-left: 4px solid #c9a050; }
    .balance-amount { font-size: 24px; font-weight: bold; color: #c9a050; }
    .action-required { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 20px 0; }
    .advice-section { margin-top: 30px; border-top: 2px solid #1e3a5f; padding-top: 20px; }
    .advice-title { font-size: 16px; font-weight: bold; color: #1e3a5f; margin-bottom: 15px; }
    .advice-org { display: flex; align-items: center; margin: 15px 0; padding: 10px; background: #f5f5f5; }
    .advice-logo { width: 60px; height: 40px; background: #ddd; margin-right: 15px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; }
    .advice-info { flex: 1; }
    .advice-name { font-weight: bold; }
    .advice-contact { font-size: 12px; color: #666; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; text-align: center; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <div class="logo-section">
        <div class="logo">MDRG</div>
        <div class="tagline">Managing Debt Responsibly Group</div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">Debt Recovery & Enforcement Services</div>
      </div>
      <div class="contact-info">
        <strong>Managing Debt Responsibly Group (MDRG)</strong><br>
        Debt Recovery & Enforcement Services<br>
        Email: enquiries@managingdebtresponsiblygroup.co.uk<br>
        Tel: 020 4577 1660<br>
        www.managingdebtresponsiblygroup.co.uk
      </div>
    </div>
  </div>

  <div class="date-ref">
    <strong>Date:</strong> ${today.toLocaleDateString('en-GB')}<br>
    <strong>Reference Number:</strong> ${customer.client_id}
  </div>

  <div class="recipient">
    <strong>${customer.first_name} ${customer.last_name}</strong><br>
    ${customer.address}<br>
    ${customer.city}<br>
    ${customer.postcode}
  </div>

  <div class="notice-title">NOTICE OF DEBT RECOVERY</div>

  <div class="intro-text">
    <p>This letter serves as formal notification that an outstanding balance remains unpaid.</p>
    <p>Managing Debt Responsibly Group (MDRG) has been instructed to recover this debt. You must make payment or contact us immediately.</p>
  </div>

  <div class="details-box">
    <div class="details-row">
      <div class="details-label">Original Creditor:</div>
      <div class="details-value">${customer.original_creditor || 'N/A'}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Account Reference:</div>
      <div class="details-value">${customer.account_reference || customer.client_id}</div>
    </div>
    <div class="balance-row">
      <div class="details-label">Outstanding Balance:</div>
      <div class="details-value balance-amount">£${parseFloat(customer.total_debt).toFixed(2)}</div>
    </div>
    <div class="details-row">
      <div class="details-label">Due Date:</div>
      <div class="details-value">${dueDate.toLocaleDateString('en-GB')}</div>
    </div>
  </div>

  <div class="action-required">
    <strong>Action Required:</strong> Contact MDRG within 7 days to arrange payment or discuss repayment options. Failure to respond may result in further recovery action.
  </div>

  <div class="advice-section">
    <div class="advice-title">FREE INDEPENDENT DEBT ADVICE</div>
    <p style="font-size: 13px; margin-bottom: 15px;">If you are experiencing financial difficulties, you can seek free independent advice from the following organisations:</p>
    
    <div class="advice-org">
      <div class="advice-logo">[LOGO]</div>
      <div class="advice-info">
        <div class="advice-name">Citizens Advice</div>
        <div class="advice-contact">www.citizensadvice.org.uk | 0800 144 8848</div>
      </div>
    </div>
    
    <div class="advice-org">
      <div class="advice-logo">[LOGO]</div>
      <div class="advice-info">
        <div class="advice-name">National Debtline</div>
        <div class="advice-contact">www.nationaldebtline.org | 0808 808 4000</div>
      </div>
    </div>
    
    <div class="advice-org">
      <div class="advice-logo">[LOGO]</div>
      <div class="advice-info">
        <div class="advice-name">StepChange Debt Charity</div>
        <div class="advice-contact">www.stepchange.org | 0800 138 1111</div>
      </div>
    </div>
    
    <div class="advice-org">
      <div class="advice-logo">[LOGO]</div>
      <div class="advice-info">
        <div class="advice-name">MoneyHelper</div>
        <div class="advice-contact">www.moneyhelper.org.uk | 0800 138 7777</div>
      </div>
    </div>
    
    <p style="font-size: 12px; margin-top: 15px;">These organisations provide confidential and impartial advice. MDRG encourages you to seek support if needed.</p>
  </div>

  <div class="footer">
    <strong>Managing Debt Responsibly Group (MDRG)</strong><br>
    Debt Recovery & Compliance Department<br>
    9 Surley Row, Emmer Green, Reading, RG4 8ND
  </div>
</body>
</html>`;

  // Create and download the letter
  const blob = new Blob([letterHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Enforcement_Letter_${customer.client_id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// ADMIN DASHBOARD PAGE
// ============================================
const AdminDashboardPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadData, setUploadData] = useState('');
  const [uploadResults, setUploadResults] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Single customer form state
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    company_name: '',
    total_debt: '',
    address: '',
    city: '',
    postcode: '',
    original_creditor: '',
    account_reference: ''
  });
  const [generateLetter, setGenerateLetter] = useState(false);
  const [addCustomerResult, setAddCustomerResult] = useState<any>(null);
  const [addCustomerLoading, setAddCustomerLoading] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('mdrg_admin');
    if (!isAdmin) {
      setPage('admin-login');
      return;
    }

    // Fetch dashboard stats
    fetch('https://mdrg-backend-1.onrender.com/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      });

    // Fetch clients
    fetch('https://mdrg-backend-1.onrender.com/api/clients')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClients(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [setPage]);

  const handleLogout = () => {
    localStorage.removeItem('mdrg_admin');
    setPage('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Admin Header */}
      <div className="bg-purple-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <MDRGLogo white className="scale-75" />
              <span className="bg-yellow-400 text-purple-900 px-3 py-1 rounded text-sm font-bold">ADMIN</span>
            </div>
            <button onClick={handleLogout} className="bg-white text-purple-900 px-4 py-2 rounded font-semibold hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {['overview', 'clients', 'add-customer', 'upload', 'cases', 'payments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-purple-900 text-purple-900'
                    : 'border-transparent text-gray-600 hover:text-purple-900'
                }`}
              >
                {tab === 'add-customer' ? 'Add Customer' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500 text-sm">Total Clients</p>
                  <p className="text-3xl font-bold text-purple-900">{stats?.totalClients || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {stats?.paidClients || 0} paid · {stats?.outstandingClients || 0} outstanding
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500 text-sm">Total Debt</p>
                  <p className="text-3xl font-bold text-purple-900">£{stats?.totalDebt?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500 text-sm">Outstanding</p>
                  <p className="text-3xl font-bold text-red-600">£{stats?.totalOutstanding?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-500 text-sm">Total Collected</p>
                  <p className="text-3xl font-bold text-green-600">£{stats?.totalCollected?.toLocaleString() || 0}</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Clients</h2>
                {clients.length === 0 ? (
                  <p className="text-gray-500">No clients registered yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Client ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Amount Owed</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.slice(0, 10).map((client: any) => (
                          <tr key={client.client_id} className="border-t">
                            <td className="py-3 px-4 font-mono text-sm">{client.client_id}</td>
                            <td className="py-3 px-4">{client.first_name} {client.last_name}</td>
                            <td className="py-3 px-4">{client.email}</td>
                            <td className="py-3 px-4">£{(client.total_debt || 0).toLocaleString()}</td>
                            <td className={`py-3 px-4 font-semibold ${(client.balance_due || 0) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              £{(client.balance_due || 0).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                (client.balance_due || 0) <= 0 ? 'bg-green-100 text-green-700' : 
                                client.status === 'active' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {(client.balance_due || 0) <= 0 ? 'PAID' : client.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'clients' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">All Clients</h2>
              {clients.length === 0 ? (
                <p className="text-gray-500">No clients registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount Owed</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Balance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client: any) => (
                        <tr key={client.client_id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{client.client_id}</td>
                          <td className="py-3 px-4">{client.first_name} {client.last_name}</td>
                          <td className="py-3 px-4">{client.email}</td>
                          <td className="py-3 px-4">{client.phone || '-'}</td>
                          <td className="py-3 px-4">£{(client.total_debt || 0).toLocaleString()}</td>
                          <td className={`py-3 px-4 font-semibold ${(client.balance_due || 0) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            £{(client.balance_due || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              (client.balance_due || 0) <= 0 ? 'bg-green-100 text-green-700' : 
                              client.status === 'active' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {(client.balance_due || 0) <= 0 ? 'PAID' : client.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add-customer' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
              <p className="text-gray-600 mb-6">Enter customer details to create a new account.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="mb-2 block">First Name *</Label>
                  <Input
                    type="text"
                    placeholder="John"
                    value={newCustomer.first_name}
                    onChange={(e) => setNewCustomer({...newCustomer, first_name: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Last Name *</Label>
                  <Input
                    type="text"
                    placeholder="Doe"
                    value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer({...newCustomer, last_name: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Password *</Label>
                  <Input
                    type="text"
                    placeholder="Min 8 characters"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Phone Number</Label>
                  <Input
                    type="text"
                    placeholder="07700123456"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Company Name</Label>
                  <Input
                    type="text"
                    placeholder="ABC Ltd (optional)"
                    value={newCustomer.company_name}
                    onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Amount Owed (£) *</Label>
                  <Input
                    type="number"
                    placeholder="500.00"
                    value={newCustomer.total_debt}
                    onChange={(e) => setNewCustomer({...newCustomer, total_debt: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-2 block">Address *</Label>
                  <Input
                    type="text"
                    placeholder="56 Langdon Crescent"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">City *</Label>
                  <Input
                    type="text"
                    placeholder="London"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Postcode *</Label>
                  <Input
                    type="text"
                    placeholder="E6 2PP"
                    value={newCustomer.postcode}
                    onChange={(e) => setNewCustomer({...newCustomer, postcode: e.target.value})}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold text-gray-700 mb-4">Debt Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Original Creditor *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. British Gas, Vodafone, etc."
                      value={newCustomer.original_creditor}
                      onChange={(e) => setNewCustomer({...newCustomer, original_creditor: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Account Reference *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Account number or reference from original creditor"
                      value={newCustomer.account_reference}
                      onChange={(e) => setNewCustomer({...newCustomer, account_reference: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateLetter}
                    onChange={(e) => setGenerateLetter(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Generate and download debt recovery letter</span>
                </label>
              </div>
              
              <button
                onClick={async () => {
                  if (!newCustomer.first_name || !newCustomer.last_name || !newCustomer.email || !newCustomer.password || !newCustomer.total_debt || !newCustomer.address || !newCustomer.city || !newCustomer.postcode || !newCustomer.original_creditor || !newCustomer.account_reference) {
                    setAddCustomerResult({ success: false, message: 'Please fill in all required fields' });
                    return;
                  }
                  if (newCustomer.password.length < 8) {
                    setAddCustomerResult({ success: false, message: 'Password must be at least 8 characters' });
                    return;
                  }
                  
                  setAddCustomerLoading(true);
                  setAddCustomerResult(null);
                  
                  try {
                    const response = await fetch('https://mdrg-backend-1.onrender.com/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCustomer)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                      setAddCustomerResult({ success: true, message: `Customer added successfully! Client ID: ${data.data.client_id}` });
                      
                      // Generate letter if requested
                      if (generateLetter) {
                        generateDebtLetter({
                          ...newCustomer,
                          client_id: data.data.client_id,
                          total_debt: data.data.total_debt
                        });
                      }
                      
                      // Clear form
                      setNewCustomer({ first_name: '', last_name: '', email: '', password: '', phone: '', company_name: '', total_debt: '', address: '', city: '', postcode: '', original_creditor: '', account_reference: '' });
                      setGenerateLetter(false);
                      // Refresh client list
                      fetch('https://mdrg-backend-1.onrender.com/api/clients')
                        .then(res => res.json())
                        .then(data => { if (data.success) setClients(data.data || []); });
                    } else {
                      setAddCustomerResult({ success: false, message: data.message || 'Failed to add customer' });
                    }
                  } catch (err) {
                    setAddCustomerResult({ success: false, message: 'Network error. Please try again.' });
                  } finally {
                    setAddCustomerLoading(false);
                  }
                }}
                disabled={addCustomerLoading}
                className="mdrg-btn-primary disabled:opacity-50"
              >
                {addCustomerLoading ? 'Adding...' : 'Add Customer'}
              </button>
              
              {addCustomerResult && (
                <div className={`mt-4 p-4 rounded-lg ${addCustomerResult.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {addCustomerResult.message}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Bulk Upload Customers</h2>
              <p className="text-gray-600 mb-4">
                Paste customer data in CSV format. Format: first_name,last_name,email,password,total_debt,original_creditor,account_reference,phone
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Example:<br/>
                John,Doe,john@example.com,Password123,500.00,British Gas,BG123456,07700123456
              </p>
              
              <textarea
                className="w-full h-48 p-4 border rounded-lg font-mono text-sm mb-4"
                placeholder="first_name,last_name,email,password,total_debt,original_creditor,account_reference,phone&#10;John,Doe,john@example.com,Password123,500.00,British Gas,BG123456,07700123456"
                value={uploadData}
                onChange={(e) => setUploadData(e.target.value)}
              />
              
              <button
                onClick={async () => {
                  if (!uploadData.trim()) return;
                  setUploadLoading(true);
                  setUploadResults(null);
                  
                  const lines = uploadData.trim().split('\n');
                  const results = { success: 0, failed: 0, errors: [] as string[] };
                  
                  for (const line of lines) {
                    const parts = line.split(',').map(p => p.trim());
                    if (parts.length < 6) continue;
                    
                    const [first_name, last_name, email, password, total_debt, original_creditor, account_reference, phone] = parts;
                    
                    try {
                      const response = await fetch('https://mdrg-backend-1.onrender.com/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ first_name, last_name, email, password, total_debt, original_creditor, account_reference, phone: phone || '' })
                      });
                      
                      if (response.ok) {
                        results.success++;
                      } else {
                        const data = await response.json();
                        results.failed++;
                        results.errors.push(`${email}: ${data.message}`);
                      }
                    } catch (err) {
                      results.failed++;
                      results.errors.push(`${email}: Network error`);
                    }
                  }
                  
                  setUploadResults(results);
                  setUploadLoading(false);
                  // Refresh client list
                  fetch('https://mdrg-backend-1.onrender.com/api/clients')
                    .then(res => res.json())
                    .then(data => { if (data.success) setClients(data.data || []); });
                }}
                disabled={uploadLoading || !uploadData.trim()}
                className="mdrg-btn-primary disabled:opacity-50"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Customers'}
              </button>
              
              {uploadResults && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Upload Results:</p>
                  <p className="text-green-600">✓ Successfully added: {uploadResults.success}</p>
                  <p className="text-red-600">✗ Failed: {uploadResults.failed}</p>
                  {uploadResults.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Errors:</p>
                      <ul className="text-sm text-red-600 mt-1">
                        {uploadResults.errors.map((err: string, i: number) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Bulk Upload Customers</h2>
              <p className="text-gray-600 mb-4">
                Paste customer data in CSV format. Format: first_name,last_name,email,password,total_debt,phone(optional)
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Example:<br/>
                John,Doe,john@example.com,Password123,500.00,07700123456<br/>
                Jane,Smith,jane@example.com,Password123,1250.50,07700987654
              </p>
              
              <textarea
                className="w-full h-48 p-4 border rounded-lg font-mono text-sm mb-4"
                placeholder="first_name,last_name,email,password,total_debt,phone&#10;John,Doe,john@example.com,Password123,500.00,07700123456&#10;Jane,Smith,jane@example.com,Password123,1250.50,07700987654"
                value={uploadData}
                onChange={(e) => setUploadData(e.target.value)}
              />
              
              <button
                onClick={async () => {
                  if (!uploadData.trim()) return;
                  setUploadLoading(true);
                  setUploadResults(null);
                  
                  const lines = uploadData.trim().split('\n');
                  const results = { success: 0, failed: 0, errors: [] as string[] };
                  
                  for (const line of lines) {
                    const parts = line.split(',').map(p => p.trim());
                    if (parts.length < 5) continue;
                    
                    const [first_name, last_name, email, password, total_debt, phone] = parts;
                    
                    try {
                      const response = await fetch('https://mdrg-backend-1.onrender.com/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ first_name, last_name, email, password, total_debt, phone: phone || '' })
                      });
                      
                      if (response.ok) {
                        results.success++;
                      } else {
                        const data = await response.json();
                        results.failed++;
                        results.errors.push(`${email}: ${data.message}`);
                      }
                    } catch (err) {
                      results.failed++;
                      results.errors.push(`${email}: Network error`);
                    }
                  }
                  
                  setUploadResults(results);
                  setUploadLoading(false);
                  // Refresh client list
                  fetch('https://mdrg-backend-1.onrender.com/api/clients')
                    .then(res => res.json())
                    .then(data => { if (data.success) setClients(data.data || []); });
                }}
                disabled={uploadLoading || !uploadData.trim()}
                className="mdrg-btn-primary disabled:opacity-50"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Customers'}
              </button>
              
              {uploadResults && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Upload Results:</p>
                  <p className="text-green-600">✓ Successfully added: {uploadResults.success}</p>
                  <p className="text-red-600">✗ Failed: {uploadResults.failed}</p>
                  {uploadResults.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Errors:</p>
                      <ul className="text-sm text-red-600 mt-1">
                        {uploadResults.errors.map((err: string, i: number) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">All Cases</h2>
              <p className="text-gray-500">Case management coming soon.</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Payment History</h2>
              <p className="text-gray-500">Payment tracking coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SignupPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://mdrg-backend-1.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please login.');
        // Store token and user data
        localStorage.setItem('mdrg_token', data.data.token);
        localStorage.setItem('mdrg_user', JSON.stringify(data.data));
        setTimeout(() => setPage('login'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageBanner title="Signup" />
      <div className="flex-1 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg mb-8">To signup, please enter your details below.</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 mb-2"><User size={16} /> First Name:</Label>
                  <Input name="first_name" type="text" placeholder="Enter your first name" className="mdrg-input" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2"><User size={16} /> Last Name:</Label>
                  <Input name="last_name" type="text" placeholder="Enter your last name" className="mdrg-input" value={formData.last_name} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 mb-2"><Mail size={16} /> Email Address:</Label>
                  <Input name="email" type="email" placeholder="Enter your email" className="mdrg-input" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2"><Mail size={16} /> Confirm your Email Address:</Label>
                  <Input name="confirmEmail" type="email" placeholder="Confirm your email" className="mdrg-input" value={formData.confirmEmail} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="flex items-center gap-2 mb-2"><Lock size={16} /> Password:</Label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? 'text' : 'password'} className="mdrg-input pr-10" value={formData.password} onChange={handleChange} required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-2"><Lock size={16} /> Confirm your Password:</Label>
                  <div className="relative">
                    <Input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className="mdrg-input pr-10" value={formData.confirmPassword} onChange={handleChange} required />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center pt-6">
                <button type="submit" disabled={loading} className="mdrg-btn-primary disabled:opacity-50">
                  {loading ? 'Signing up...' : 'SIGNUP'} <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="info-box h-fit">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <Info className="text-white" size={24} />
                </div>
              </div>
              <p className="text-center mb-4">
                <button onClick={() => setPage('login')} className="mdrg-link font-semibold">Already have an account with us? Login here.</button>
              </p>
              <p className="text-center text-sm text-gray-600 mb-4">All fields are required unless specified.</p>
              <p className="text-center text-sm">
                If you have any problems registering an account, please <button onClick={() => setPage('contact')} className="mdrg-link">contact us</button>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Reset Password" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-2">Forgotten your password?</h2>
        <p className="text-gray-600 mb-8">Use the form below to reset your password. We'll send a code to your email inbox.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="max-w-md">
              <Label className="flex items-center gap-2 mb-2"><Mail size={16} /> Email Address:</Label>
              <Input type="email" className="mdrg-input mb-6" />
              <div className="flex justify-center">
                <button className="mdrg-btn-primary">SEND CONFIRMATION EMAIL <ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
          <div className="info-box h-fit">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                <Info className="text-white" size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Enter your email address and click on the button. We'll then send you a confirmation code. Check your junk folder if it doesn't appear in your inbox.
            </p>
            <p className="text-sm">
              If you have any problems, please <button onClick={() => setPage('contact')} className="mdrg-link">contact us</button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Contact us" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-lg mb-4">
            If you need to speak to us about any of your cases, or are having trouble using the client portal, please fill in our form below.
          </p>
          <p>If your matter is urgent you can also call us on <a href="tel:03333554681" className="mdrg-link font-semibold">0333 355 4681*</a></p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div><Label className="flex items-center gap-2 mb-2"><User size={16} /> Your Name</Label><Input className="mdrg-input" /></div>
            <div><Label className="flex items-center gap-2 mb-2"><Building2 size={16} /> Business/Company Name (optional)</Label><Input className="mdrg-input" /></div>
            <div><Label className="flex items-center gap-2 mb-2"><Mail size={16} /> Your Email Address</Label><Input type="email" className="mdrg-input" /></div>
            <div><Label className="flex items-center gap-2 mb-2"><Phone size={16} /> Phone Number</Label><Input className="mdrg-input" /></div>
            <div><Label className="flex items-center gap-2 mb-2"><FileText size={16} /> Our Reference</Label><Input className="mdrg-input" /></div>
            <div><Label className="flex items-center gap-2 mb-2"><FileText size={16} /> Details / Comments</Label><textarea rows={5} className="mdrg-input resize-none"></textarea></div>
            <div className="flex justify-center">
              <button className="mdrg-btn-primary">Complete <ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Address</h3>
              <p className="text-gray-600">
                9 Surley Row<br />Emmer Green<br />Reading<br />RG4 8ND
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Email Address</h3>
              <a href="mailto:enquiries@managingdebtresponsiblygroup.co.uk" className="mdrg-link">enquiries@managingdebtresponsiblygroup.co.uk</a>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Telephone</h3>
              <p className="text-gray-600">Customer Enquiries: <a href="tel:03333554681" className="mdrg-link">0333 355 4681*</a></p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Operating Hours</h3>
              <p className="text-gray-600">Monday-Thursday: 9:00am - 5:15pm<br />Friday: 9:00am - 4:00pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HelpPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Portal Help" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4">How to use the Portal</h2>
        <p className="text-gray-600 mb-4">
          This page is being updated. If you have any questions in the meantime, you should contact us.
        </p>
        <p>If you need to get in touch, please <button onClick={() => setPage('contact')} className="mdrg-link">contact us</button>.</p>
      </div>
    </div>
  </div>
);

// ============================================
// SERVICE PAGES
// ============================================
const BusinessDebtPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Business Debt Recovery" subtitle="Risk-free business debt recovery with zero upfront fees." />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-lg text-gray-600 mb-8">
              Stress-free business debt recovery of unpaid invoices and debts. Manage the process and track your cases online with an industry leading client portal. Upload your business debts today.
            </p>
            <h2 className="text-2xl font-bold mb-4">How we help with business debt collection.</h2>
            <p className="text-gray-600 mb-6">
              Business debt is money owed to a business by another business. It differs from consumer debts in that there is legislation specifically for handling late payments within a business contract. There is also equal legal standing when businesses sign contracts meaning terms agreed must be adhered to by both parties, otherwise a breach occurs.
            </p>
            <p className="text-gray-600 mb-6">
              MDRG Debt Recovery specialises in helping businesses recover unpaid invoices from non-paying clients. Whether this is a single invoice or several from one or more debtors, starting the recovery process is as simple as creating a free account with us and uploading all the details to your portal.
            </p>
            <h2 className="text-2xl font-bold mb-4">Award-winning team.</h2>
            <p className="text-gray-600 mb-6">
              Operating for over a decade, MDRG have assisted tens of thousands of clients both in the UK and overseas. As a business collection agency we've reunited clients with their money back in every conceivable fashion from small sole trader debts to multinational corporations with an entire debt portfolio.
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Why choose MDRG?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span><strong>Fixed fee collection.</strong> No upfront fees. We only earn on what we collect.</span></li>
                <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span><strong>Innovative client portal.</strong> 24-hour access to your cases.</span></li>
                <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span><strong>Dedicated support team.</strong> Our business team are on hand.</span></li>
                <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span><strong>Full transparency.</strong> See exactly what has been collected.</span></li>
                <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span><strong>International service.</strong> We can collect debts worldwide.</span></li>
              </ul>
            </div>
            <button onClick={() => setPage('signup')} className="mdrg-btn-primary w-full">Sign up now <ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ServicePage = ({ title, description, setPage }: { title: string; description: string; setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title={title} />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-lg text-gray-600 mb-8">{description}</p>
        <div className="bg-purple-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-lg mb-4">Key Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span>No upfront fees - we only earn when you get paid</span></li>
            <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span>24/7 client portal access</span></li>
            <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span>Dedicated account manager</span></li>
            <li className="flex items-start gap-2"><Check size={20} className="text-green-600 mt-1" /><span>Full transparency throughout the process</span></li>
          </ul>
        </div>
        <button onClick={() => setPage('signup')} className="mdrg-btn-primary">Sign up now <ChevronRight size={18} /></button>
      </div>
    </div>
  </div>
);

// ============================================
// ABOUT PAGES
// ============================================
const OurStoryPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Our Story" subtitle="How it all started." />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-lg text-gray-600 mb-6">
          MDRG Debt Recovery is a story of evolution and continual progress.
        </p>
        <p className="text-gray-600 mb-6">
          Our story originates from an idea of revolutionising debt recovery via innovation and a perfectly crafted customer experience. Starting life in 2014, MDRG brought together and built a team of seasoned debt recovery agents. It was in these early years our team learned how to get the best results for our huge variety of clients.
        </p>
        <p className="text-gray-600 mb-6">
          With every debt being different, our processes, strategies and even our language in handling debts were crafted to achieve fast, successful results for clients.
        </p>
        <p className="text-gray-600 mb-6">
          We have learned a lot along the way. While originally we sought to recover debts as efficiently as possible, as we grew, our clients' expectations also grew. With so many companies within our industry, our team wanted to stand out and provide a service unlike that of any competitor.
        </p>
        <button onClick={() => setPage('signup')} className="mdrg-btn-primary">Get started <ChevronRight size={18} /></button>
      </div>
    </div>
  </div>
);

const WhyChooseUsPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Why Choose Us?" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Fixed fee collection', desc: 'No upfront fees. We only earn on what we collect with set collection fees.' },
            { title: 'Innovative client portal', desc: 'Our industry-leading client portal gives you 24-hour access to your cases.' },
            { title: 'Dedicated support team', desc: 'If you require additional support, our business team are on hand.' },
            { title: 'Full transparency', desc: 'See exactly what has been collected and when to expect your payment.' },
            { title: 'International service', desc: 'We can collect debts from both UK-based or overseas businesses.' },
            { title: 'Protect your reputation', desc: 'Our strategies and agents recover money with the utmost professionalism.' },
          ].map((item, index) => (
            <div key={index} className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => setPage('signup')} className="mdrg-btn-primary">Sign up now <ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  </div>
);

const FAQsPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Frequently Asked Questions" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {[
            { q: 'How much does it cost?', a: 'We operate on a no win, no fee basis. Our commission is only 15% of the amount recovered.' },
            { q: 'How long does the process take?', a: 'Each case is different, but we typically see results within 30 days of starting the recovery process.' },
            { q: 'What types of debt do you recover?', a: 'We specialise in commercial debts (B2B invoices), commercial and residential rent arrears, utility and telecoms debts, professional service fees, and other unregulated debts. We do not collect regulated consumer credit debts (loans, credit cards, hire purchase) as these require FCA authorisation.' },
            { q: 'Do you offer international debt recovery?', a: 'Yes, we can collect debts from both UK-based and overseas businesses.' },
            { q: 'Are you FCA regulated?', a: 'No FCA registration is required for the types of debt we collect. We focus exclusively on unregulated debt types including commercial debts, rent arrears, utility bills, and professional service fees - none of which require FCA authorisation.' },
            { q: 'What debts can you collect without FCA registration?', a: 'We can legally collect: Commercial/B2B debts (invoices between businesses), utility arrears (gas, electric, water), telecoms debts (phone, broadband), professional service fees (accountants, solicitors, tradespeople), rent arrears (residential and commercial), and other unregulated service fees.' },
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button onClick={() => setPage('contact')} className="mdrg-btn-primary">Contact us <ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// CALLBACK & PAYMENT PAGES
// ============================================
const CallbackPage = ({ setPage }: { setPage: (page: PageType) => void }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex flex-col">
      <PageBanner title="Request a callback" subtitle="See what we can do for you today." />
      <div className="flex-1 bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 mb-8">Fill in our simple form below and one of our expert team will get in touch. This form will take less than 60 seconds to complete.</p>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-purple-900' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div><Label>How much are you owed?</Label><Input type="number" placeholder="Amount in GBP" className="mdrg-input" /></div>
              <div><Label>How many individual debts?</Label><Input type="number" placeholder="Number of debts" className="mdrg-input" /></div>
              <div className="flex justify-end">
                <button onClick={() => setStep(2)} className="mdrg-btn-primary">Next <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-md mx-auto">
              <div><Label>Your Name</Label><Input className="mdrg-input" /></div>
              <div><Label>Your Email</Label><Input type="email" className="mdrg-input" /></div>
              <div><Label>Phone Number</Label><Input className="mdrg-input" /></div>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-purple-900 text-purple-900 rounded-full font-semibold">Back</button>
                <button onClick={() => setStep(3)} className="mdrg-btn-primary">Next <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Thank you!</h3>
              <p className="text-gray-600 mb-6">We'll be in touch shortly to discuss your requirements.</p>
              <button onClick={() => setPage('home')} className="mdrg-btn-primary">Return to Home <ChevronRight size={18} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MakePaymentPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Make a Payment" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-gray-600 mb-8 text-center">
          If we have contacted you about a debt, you can make a secure payment here.
        </p>
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="space-y-6">
            <div><Label>Reference Number</Label><Input placeholder="Enter your reference" className="mdrg-input" /></div>
            <div><Label>Amount to Pay (£)</Label><Input type="number" placeholder="Enter amount" className="mdrg-input" /></div>
            <div><Label>Cardholder Name</Label><Input placeholder="Name on card" className="mdrg-input" /></div>
            <div><Label>Card Number</Label><Input placeholder="**** **** **** ****" className="mdrg-input" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Expiry Date</Label><Input placeholder="MM/YY" className="mdrg-input" /></div>
              <div><Label>CVV</Label><Input placeholder="***" className="mdrg-input" /></div>
            </div>
            <button className="mdrg-btn-primary w-full">Make Payment <ChevronRight size={18} /></button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Having trouble? <button onClick={() => setPage('contact')} className="mdrg-link">Contact us</button>
        </p>
      </div>
    </div>
  </div>
);

// ============================================
// POLICY PAGES
// ============================================
const SiteMapPage = ({ setPage }: { setPage: (page: PageType) => void }) => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Site Map" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">Main Pages</h2>
            <ul className="space-y-2">
              <li><button onClick={() => setPage('home')} className="mdrg-link">Home</button></li>
              <li><button onClick={() => setPage('contact')} className="mdrg-link">Contact Us</button></li>
              <li><button onClick={() => setPage('callback')} className="mdrg-link">Request a Callback</button></li>
              <li><button onClick={() => setPage('make-payment')} className="mdrg-link">Make a Payment</button></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">Services</h2>
            <ul className="space-y-2">
              <li><button onClick={() => setPage('business-debt')} className="mdrg-link">Business Debt Recovery</button></li>
              <li><button onClick={() => setPage('commercial-debt')} className="mdrg-link">Commercial Debt Recovery</button></li>
              <li><button onClick={() => setPage('consumer-debt')} className="mdrg-link">Consumer Debt Recovery</button></li>
              <li><button onClick={() => setPage('corporate-debt')} className="mdrg-link">Corporate Debt Collection</button></li>
              <li><button onClick={() => setPage('mediation')} className="mdrg-link">Mediation</button></li>
              <li><button onClick={() => setPage('tracing')} className="mdrg-link">Tracing</button></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">About Us</h2>
            <ul className="space-y-2">
              <li><button onClick={() => setPage('our-story')} className="mdrg-link">Our Story</button></li>
              <li><button onClick={() => setPage('why-choose-us')} className="mdrg-link">Why Choose MDRG?</button></li>
              <li><button onClick={() => setPage('faqs')} className="mdrg-link">FAQs</button></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">Client Portal</h2>
            <ul className="space-y-2">
              <li><button onClick={() => setPage('login')} className="mdrg-link">Login</button></li>
              <li><button onClick={() => setPage('signup')} className="mdrg-link">Sign Up</button></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-purple-900">Legal</h2>
            <ul className="space-y-2">
              <li><button onClick={() => setPage('terms')} className="mdrg-link">Terms of Use</button></li>
              <li><button onClick={() => setPage('privacy')} className="mdrg-link">Privacy Policy</button></li>
              <li><button onClick={() => setPage('dp-policy')} className="mdrg-link">DP Policy</button></li>
              <li><button onClick={() => setPage('cookie-policy')} className="mdrg-link">Cookie Policy</button></li>
              <li><button onClick={() => setPage('compliance')} className="mdrg-link">Compliance</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TermsPage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Terms of Use" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            These Terms of Use govern your use of the Managing Debt Responsibly Group website and services. By accessing or using our website, 
            you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-bold mb-4">2. Company Information</h2>
          <p className="text-gray-600 mb-4">
            Managing Debt Responsibly Group provides professional debt recovery services.
            Our address is 9 Surley Row, Emmer Green, Reading, RG4 8ND.
          </p>

          <h2 className="text-xl font-bold mb-4">3. Services</h2>
          <p className="text-gray-600 mb-4">
            MDRG LIMITED provides debt recovery services including business debt recovery, commercial debt recovery, 
            consumer debt recovery, corporate debt collection, mediation, and tracing services.
          </p>

          <h2 className="text-xl font-bold mb-4">4. No Win, No Fee</h2>
          <p className="text-gray-600 mb-4">
            Our debt recovery services operate on a no win, no fee basis. This means you only pay our commission 
            when we successfully recover your debt. Our standard commission rate is 15% of the amount recovered.
          </p>

          <h2 className="text-xl font-bold mb-4">5. Client Obligations</h2>
          <p className="text-gray-600 mb-4">
            By using our services, you confirm that:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>You have the legal right to pursue the debt</li>
            <li>The information you provide is accurate and complete</li>
            <li>You will cooperate with our team during the recovery process</li>
            <li>You will notify us of any payments received directly from the debtor</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            While we make every effort to recover your debts, we cannot guarantee successful recovery in all cases. 
            Our liability is limited to the amount of commission paid to us for the specific case.
          </p>

          <h2 className="text-xl font-bold mb-4">7. Governing Law</h2>
          <p className="text-gray-600 mb-4">
            These Terms of Use are governed by and construed in accordance with the laws of England and Wales. 
            Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <h2 className="text-xl font-bold mb-4">8. Changes to Terms</h2>
          <p className="text-gray-600 mb-4">
            We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately 
            upon posting on this website. Your continued use of the website following any changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-xl font-bold mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms of Use, please contact us at enquiries@managingdebtresponsiblygroup.co.uk 
            or call us on 020 4577 1660.
          </p>

          <p className="text-gray-500 text-sm mt-8">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  </div>
);

const PrivacyPage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Privacy Policy" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-4">
            Managing Debt Responsibly Group is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, store, and protect your personal information when you use our website and services.
          </p>

          <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Personal Information:</strong> Name, email address, phone number, company name, and address</li>
            <li><strong>Financial Information:</strong> Bank details for payment processing</li>
            <li><strong>Case Information:</strong> Details about debts you wish to recover</li>
            <li><strong>Technical Information:</strong> IP address, browser type, and usage data</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Provide and manage our debt recovery services</li>
            <li>Communicate with you about your cases</li>
            <li>Process payments and commissions</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">4. Data Protection</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organisational measures to protect your personal data 
            against unauthorised access, alteration, disclosure, or destruction. We are registered with 
            the Information Commissioner's Office (ICO) and comply with the UK General Data Protection Regulation (UK GDPR).
          </p>

          <h2 className="text-xl font-bold mb-4">5. Data Sharing</h2>
          <p className="text-gray-600 mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Debtors and their representatives (as necessary for recovery)</li>
            <li>Legal professionals (when legal action is required)</li>
            <li>Regulatory authorities (when required by law)</li>
            <li>Service providers who assist in our operations</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">6. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Under data protection law, you have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Request restriction of processing</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">7. Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies to enhance your browsing experience. For more information, please see our Cookie Policy.
          </p>

          <h2 className="text-xl font-bold mb-4">8. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or wish to exercise your data protection rights, 
            please contact us at enquiries@managingdebtresponsiblygroup.co.uk or write to us at our registered address.
          </p>

          <p className="text-gray-500 text-sm mt-8">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  </div>
);

const DPPolicyPage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Data Protection Policy" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">1. Policy Statement</h2>
          <p className="text-gray-600 mb-4">
            Managing Debt Responsibly Group is committed to ensuring that all personal data is processed in accordance with 
            the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. 
            This policy sets out how we comply with data protection laws and protect the rights of data subjects.
          </p>

          <h2 className="text-xl font-bold mb-4">2. Data Protection Principles</h2>
          <p className="text-gray-600 mb-4">
            We adhere to the following data protection principles:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Lawfulness, Fairness, and Transparency:</strong> Data is processed lawfully, fairly, and transparently</li>
            <li><strong>Purpose Limitation:</strong> Data is collected for specified, explicit, and legitimate purposes</li>
            <li><strong>Data Minimisation:</strong> Only data necessary for the purpose is collected</li>
            <li><strong>Accuracy:</strong> Data is kept accurate and up to date</li>
            <li><strong>Storage Limitation:</strong> Data is kept only as long as necessary</li>
            <li><strong>Integrity and Confidentiality:</strong> Data is processed securely</li>
            <li><strong>Accountability:</strong> We are responsible for demonstrating compliance</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">3. Data Subject Rights</h2>
          <p className="text-gray-600 mb-4">
            We respect and facilitate the exercise of data subject rights including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Right to be informed</li>
            <li>Right of access</li>
            <li>Right to rectification</li>
            <li>Right to erasure (right to be forgotten)</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
            <li>Rights related to automated decision-making</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organisational measures to ensure data security, including:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Encryption of sensitive data</li>
            <li>Access controls and authentication</li>
            <li>Regular security assessments</li>
            <li>Staff training on data protection</li>
            <li>Incident response procedures</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">5. Data Breach Procedures</h2>
          <p className="text-gray-600 mb-4">
            In the event of a personal data breach, we will:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Assess the risk to data subjects</li>
            <li>Notify the ICO within 72 hours where required</li>
            <li>Inform affected data subjects where necessary</li>
            <li>Document the breach and our response</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">6. Contact Information</h2>
          <p className="text-gray-600 mb-4">
            For data protection enquiries, please contact us at enquiries@managingdebtresponsiblygroup.co.uk 
            or write to Data Protection Officer, 9 Surley Row, 
            Emmer Green, Reading, RG4 8ND.
          </p>

          <p className="text-gray-500 text-sm mt-8">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  </div>
);

const CookiePolicyPage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Cookie Policy" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">1. What Are Cookies</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>

          <h2 className="text-xl font-bold mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">
            Managing Debt Responsibly Group uses cookies for the following purposes:
          </p>

          <h3 className="text-lg font-semibold mb-2">Necessary Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are essential for the website to function properly. They enable core functionality 
            such as security, network management, and accessibility. You cannot opt out of these cookies.
          </p>

          <h3 className="text-lg font-semibold mb-2">Analytics Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies help us understand how visitors interact with our website by collecting and 
            reporting information anonymously. This helps us improve our website and services.
          </p>

          <h3 className="text-lg font-semibold mb-2">Marketing Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are used to track visitors across websites. The intention is to display ads 
            that are relevant and engaging for the individual user.
          </p>

          <h2 className="text-xl font-bold mb-4">3. Managing Cookies</h2>
          <p className="text-gray-600 mb-4">
            You can manage your cookie preferences at any time by clicking on "Cookie Settings" in the footer 
            of our website. You can also control cookies through your browser settings:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
          </ul>

          <h2 className="text-xl font-bold mb-4">4. Third-Party Cookies</h2>
          <p className="text-gray-600 mb-4">
            Some cookies may be placed by third-party services that appear on our pages. 
            We do not control the setting of these cookies. Please check the third-party websites for more information.
          </p>

          <h2 className="text-xl font-bold mb-4">5. Changes to This Policy</h2>
          <p className="text-gray-600 mb-4">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page 
            with an updated revision date.
          </p>

          <h2 className="text-xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about our Cookie Policy, please contact us at enquiries@managingdebtresponsiblygroup.co.uk.
          </p>

          <p className="text-gray-500 text-sm mt-8">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// COMPLIANCE PAGE
// ============================================
const CompliancePage = () => (
  <div className="min-h-screen flex flex-col">
    <PageBanner title="Compliance" subtitle="Our commitment to legal, regulatory, and operational standards" />
    <div className="flex-1 bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose max-w-none">
          
          {/* Regulatory Compliance Statement */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Regulatory Compliance Statement</h2>
            <p className="text-gray-600 mb-4">
              Managing Debt Responsibly Group is committed to operating in full compliance with all applicable 
              laws and regulations governing debt recovery services in the United Kingdom. We maintain strict 
              adherence to industry standards and best practices to ensure ethical and lawful operations.
            </p>
            <p className="text-gray-600 mb-4">
              Our operations are conducted in accordance with the Financial Conduct Authority (FCA) guidelines, 
              the Consumer Credit Act 1974, the Data Protection Act 2018, and all other relevant legislation. 
              We focus exclusively on unregulated debt types that do not require FCA authorisation, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Commercial debts (B2B transactions)</li>
              <li>Commercial and residential rent arrears</li>
              <li>Professional service fees</li>
              <li>Utility and telecommunications debts</li>
              <li>Other non-credit service fees</li>
            </ul>
            <p className="text-gray-600">
              We do not collect regulated consumer credit debts (loans, credit cards, hire purchase agreements) 
              as these require FCA authorisation.
            </p>
          </section>

          {/* Data Protection and Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Data Protection and Privacy Compliance</h2>
            <p className="text-gray-600 mb-4">
              We take data protection seriously and are fully committed to complying with the General Data 
              Protection Regulation (GDPR) and the UK Data Protection Act 2018.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Data Protection Commitments:</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Lawful Processing:</strong> We only process personal data where we have a lawful basis to do so</li>
              <li><strong>Data Minimisation:</strong> We collect only the data necessary for debt recovery purposes</li>
              <li><strong>Accuracy:</strong> We maintain accurate and up-to-date records</li>
              <li><strong>Storage Limitation:</strong> We retain data only for as long as necessary</li>
              <li><strong>Security:</strong> We implement appropriate technical and organisational measures to protect data</li>
              <li><strong>Transparency:</strong> We provide clear information about how we use personal data</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>ICO Registration:</strong> We are registered with the Information Commissioner's Office (ICO) 
              under registration number ZA123456.
            </p>
            <p className="text-gray-600">
              For more information about how we handle personal data, please refer to our{' '}
              <a href="#" className="text-purple-700 hover:underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-purple-700 hover:underline">Data Protection Policy</a>.
            </p>
          </section>

          {/* Anti-Fraud and Anti-Money Laundering */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Anti-Fraud and Anti-Money Laundering Commitment</h2>
            <p className="text-gray-600 mb-4">
              Managing Debt Responsibly Group is committed to preventing fraud and money laundering in all 
              aspects of our business operations. We have implemented robust policies and procedures to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Verify the identity of our clients and debtors</li>
              <li>Monitor transactions for suspicious activity</li>
              <li>Report suspicious activities to the appropriate authorities</li>
              <li>Maintain accurate records of all transactions</li>
              <li>Train our staff on fraud prevention and detection</li>
              <li>Conduct due diligence on all business relationships</li>
            </ul>
            <p className="text-gray-600">
              We work closely with law enforcement agencies and regulatory bodies to ensure compliance with 
              the Proceeds of Crime Act 2002 and the Money Laundering, Terrorist Financing and Transfer of 
              Funds (Information on the Payer) Regulations 2017.
            </p>
          </section>

          {/* Consumer Protection */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Consumer Protection and Fair Business Practices</h2>
            <p className="text-gray-600 mb-4">
              We are committed to treating all customers fairly and in accordance with the highest ethical standards. 
              Our approach to debt recovery is guided by the following principles:
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Our Fair Treatment Commitment:</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Transparency:</strong> Clear communication about debts and recovery processes</li>
              <li><strong>Respect:</strong> Treating all individuals with dignity and respect</li>
              <li><strong>Proportionality:</strong> Taking appropriate and proportionate actions</li>
              <li><strong>Flexibility:</strong> Working with debtors to find suitable repayment arrangements</li>
              <li><strong>Support:</strong> Providing information about debt advice services where appropriate</li>
              <li><strong>No Harassment:</strong> Never using harassment, oppression, or unfair practices</li>
            </ul>
            <p className="text-gray-600 mb-4">
              We adhere to the Credit Services Association (CSA) Code of Practice and the FCA's Consumer Duty 
              principles where applicable. Our staff are trained to handle all cases with professionalism and 
              empathy.
            </p>
            <p className="text-gray-600">
              If you feel you have been treated unfairly, please contact our Customer Services team or refer 
              to our Complaints Procedure.
            </p>
          </section>

          {/* Information Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Information Security and Data Handling Standards</h2>
            <p className="text-gray-600 mb-4">
              Protecting the confidentiality, integrity, and availability of information is a top priority 
              for Managing Debt Responsibly Group. We have implemented comprehensive information security 
              measures including:
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Measures:</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li><strong>Encryption:</strong> All sensitive data is encrypted in transit and at rest</li>
              <li><strong>Access Control:</strong> Role-based access controls and multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and penetration testing</li>
              <li><strong>Incident Response:</strong> Comprehensive breach detection and response procedures</li>
              <li><strong>Staff Training:</strong> Regular security awareness training for all employees</li>
              <li><strong>Secure Infrastructure:</strong> Industry-leading cloud services with robust security</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Technology Partnership:</strong> We partner with Zoho for our business services and 
              operational infrastructure. Zoho maintains industry-recognised security certifications including 
              ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II, and GDPR compliance.
            </p>
            <p className="text-gray-600">
              Our security practices are regularly reviewed and updated to address emerging threats and 
              maintain compliance with evolving standards.
            </p>
          </section>

          {/* Zoho Security Certifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Zoho Security Certifications</h2>
            <p className="text-gray-600 mb-4">
              As part of our commitment to information security and data protection, we partner with Zoho 
              for our business services and operational infrastructure. Zoho maintains the following 
              industry-recognised security certifications and compliance standards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="/certificates/Zoho_ISO27001_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 27001</p>
                  <p className="text-sm text-gray-500">Information Security Management</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO27017_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 27017</p>
                  <p className="text-sm text-gray-500">Cloud Security Controls</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO27018_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 27018</p>
                  <p className="text-sm text-gray-500">Cloud Privacy Protection</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO27701_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 27701</p>
                  <p className="text-sm text-gray-500">Privacy Information Management</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO22301_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 22301</p>
                  <p className="text-sm text-gray-500">Business Continuity Management</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO9001_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 9001</p>
                  <p className="text-sm text-gray-500">Quality Management System</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_ISO9001WCAG_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">ISO</div>
                <div>
                  <p className="font-semibold text-gray-800">ISO 9001 & WCAG</p>
                  <p className="text-sm text-gray-500">Quality & Web Accessibility</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_SOC2_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">SOC</div>
                <div>
                  <p className="font-semibold text-gray-800">SOC 2 Type II</p>
                  <p className="text-sm text-gray-500">Service Organization Controls</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_SOC1_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">SOC</div>
                <div>
                  <p className="font-semibold text-gray-800">SOC 1 Type II</p>
                  <p className="text-sm text-gray-500">Financial Reporting Controls</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_SOC2HIPAA_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">SOC</div>
                <div>
                  <p className="font-semibold text-gray-800">SOC 2 & HIPAA</p>
                  <p className="text-sm text-gray-500">Healthcare Data Protection</p>
                </div>
              </a>
              <a 
                href="/certificates/Zoho_GOBD_Certificate.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-sm">DE</div>
                <div>
                  <p className="font-semibold text-gray-800">GoBD</p>
                  <p className="text-sm text-gray-500">German Tax Compliance</p>
                </div>
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Click on any certificate above to view the official documentation. These certifications demonstrate 
              Zoho's commitment to maintaining the highest standards of security, privacy, and compliance.
            </p>
          </section>

          {/* Company Registration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Company Registration and Business Verification</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Company Name</p>
                  <p className="font-semibold text-gray-800">Managing Debt Responsibly Group</p>
                </div>
                <div>
                  <p className="text-gray-500">ICO Registration</p>
                  <p className="font-semibold text-gray-800">ZA123456</p>
                </div>
                <div>
                  <p className="text-gray-500">Registered Address</p>
                  <p className="font-semibold text-gray-800">9 Surley Row, Emmer Green, Reading, RG4 8ND</p>
                </div>
                <div>
                  <p className="text-gray-500">Operating Hours</p>
                  <p className="font-semibold text-gray-800">Mon-Thu: 9am-5:15pm, Fri: 9am-4pm</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Our business operations are conducted transparently and in accordance with all applicable 
              company law requirements. We maintain accurate company records and file all required 
              documentation with Companies House.
            </p>
          </section>

          {/* Contact for Compliance */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Contact Our Compliance Team</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our compliance practices or would like to report a concern, 
              please contact us:
            </p>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:enquiries@managingdebtresponsiblygroup.co.uk" className="text-purple-700 hover:underline">
                  enquiries@managingdebtresponsiblygroup.co.uk
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Telephone:</strong>{' '}
                <a href="tel:02045771660" className="text-purple-700 hover:underline">
                  020 4577 1660
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> 9 Surley Row, Emmer Green, Reading, RG4 8ND
              </p>
            </div>
          </section>

          <p className="text-gray-500 text-sm mt-8">Last updated: February 2026</p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [currentPage, setPage] = useState<PageType>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const openCookieSettings = () => {
    if ((window as any).openCookieSettings) {
      (window as any).openCookieSettings();
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setPage} />;
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'signup':
        return <SignupPage setPage={setPage} />;
      case 'dashboard':
        return <DashboardPage setPage={setPage} />;
      case 'admin-login':
        return <AdminLoginPage setPage={setPage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage setPage={setPage} />;
      case 'reset-password':
        return <ResetPasswordPage setPage={setPage} />;
      case 'contact':
        return <ContactPage />;
      case 'help':
        return <HelpPage setPage={setPage} />;
      case 'business-debt':
        return <BusinessDebtPage setPage={setPage} />;
      case 'commercial-debt':
        return <ServicePage title="Commercial Debt Recovery" description="Professional commercial debt recovery services for businesses of all sizes." setPage={setPage} />;
      case 'consumer-debt':
        return <ServicePage title="Consumer Debt Recovery" description="Ethical and effective consumer debt collection services." setPage={setPage} />;
      case 'corporate-debt':
        return <ServicePage title="Corporate Debt Collection" description="Specialised corporate debt recovery for large enterprises." setPage={setPage} />;
      case 'mediation':
        return <ServicePage title="Mediation Services" description="Professional mediation to resolve disputes without court proceedings." setPage={setPage} />;
      case 'tracing':
        return <ServicePage title="Tracing Services" description="Locate missing debtors with our advanced tracing technology." setPage={setPage} />;
      case 'our-story':
        return <OurStoryPage setPage={setPage} />;
      case 'why-choose-us':
        return <WhyChooseUsPage setPage={setPage} />;
      case 'faqs':
        return <FAQsPage setPage={setPage} />;
      case 'callback':
        return <CallbackPage setPage={setPage} />;
      case 'make-payment':
        return <MakePaymentPage setPage={setPage} />;
      case 'sitemap':
        return <SiteMapPage setPage={setPage} />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'dp-policy':
        return <DPPolicyPage />;
      case 'cookie-policy':
        return <CookiePolicyPage />;
      case 'compliance':
        return <CompliancePage />;
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} setPage={setPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer setPage={setPage} onCookieSettingsClick={openCookieSettings} />
      <CookieConsent />
    </div>
  );
}

export default App;
