import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  accepted: boolean;
}

const COOKIE_KEY = 'mdrg_cookie_consent';

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  accepted: false,
};

export function getCookiePreferences(): CookiePreferences {
  try {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cookie preferences:', e);
  }
  return defaultPreferences;
}

export function setCookiePreferences(prefs: CookiePreferences) {
  try {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving cookie preferences:', e);
  }
}

interface CookieConsentProps {
  onSettingsClick?: () => void;
}

export function CookieConsent({ onSettingsClick }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const prefs = getCookiePreferences();
    if (!prefs.accepted) {
      setShowBanner(true);
    }
    setPreferences(prefs);
  }, []);

  const acceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
      accepted: true,
    };
    setCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessaryOnly = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
      accepted: true,
    };
    setCookiePreferences(newPrefs);
    setPreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    const newPrefs = {
      ...preferences,
      accepted: true,
    };
    setCookiePreferences(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowBanner(false);
  };

  const closeSettings = () => {
    setShowSettings(false);
    if (!preferences.accepted) {
      setShowBanner(true);
    }
  };

  // Expose openSettings to parent
  useEffect(() => {
    if (onSettingsClick) {
      (window as any).openCookieSettings = openSettings;
    }
  }, [onSettingsClick]);

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                  <Cookie className="text-purple-900" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">We use cookies</h3>
                  <p className="text-gray-600 text-sm">
                    We use cookies to enhance your browsing experience, serve personalised content, and analyse our traffic. 
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <button 
                      onClick={openSettings}
                      className="text-purple-700 underline hover:text-purple-900"
                    >
                      Cookie Settings
                    </button>
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={acceptNecessaryOnly}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Necessary Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 text-sm font-medium"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Cookie className="text-purple-900" size={20} />
                </div>
                <h2 className="text-xl font-bold">Cookie Settings</h2>
              </div>
              <button 
                onClick={closeSettings}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-gray-600 text-sm">
                Manage your cookie preferences below. Necessary cookies are always enabled as they are essential for the website to function properly.
              </p>

              {/* Necessary Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="text-green-600" size={20} />
                    <h3 className="font-semibold">Necessary Cookies</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Always On</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Essential cookies required for the website to function. These cannot be disabled.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check className="text-purple-600" size={20} />
                    <h3 className="font-semibold">Analytics Cookies</h3>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.analytics ? 'bg-purple-900' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      preferences.analytics ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website by collecting anonymous data.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check className="text-purple-600" size={20} />
                    <h3 className="font-semibold">Marketing Cookies</h3>
                  </div>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      preferences.marketing ? 'bg-purple-900' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      preferences.marketing ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Used to deliver personalised advertisements and measure their effectiveness.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex gap-3">
              <button
                onClick={acceptNecessaryOnly}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Necessary Only
              </button>
              <button
                onClick={savePreferences}
                className="flex-1 px-4 py-2 bg-purple-900 text-white rounded-lg hover:bg-purple-800 font-medium"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CookieConsent;
