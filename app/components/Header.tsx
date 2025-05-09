import { View } from '../lib/types';
import { colors, components } from '../lib/theme';

/** Props for the navigation header */
interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

/** Main navigation header with view switching */
export const Header = ({ currentView, setCurrentView }: HeaderProps) => (
  <header className="backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
      {/* App logo */}
      <img 
        src="/logo.png" 
        alt="LakeHub Assistant" 
        className="h-28 w-auto object-contain absolute left-8 top-2"
      />
      
      {/* View switcher */}
      <div className={`flex rounded-2xl ${colors.background.card} backdrop-blur-sm p-1.5 w-64 shadow-inner mx-auto`}>
        {['chat', 'upload'].map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view as View)}
            className={`${components.button.tab} ${
              currentView === view
                ? `bg-white dark:bg-sky-600 ${colors.primary.light} dark:text-white shadow-lg ring-1 ring-sky-100 dark:ring-sky-500/20`
                : `${colors.text.muted} ${colors.primary.hover.light} ${colors.primary.hover.dark} hover:bg-white/50 dark:hover:bg-sky-600/20`
            }`}
            aria-label={`Switch to ${view} view`}
            aria-pressed={currentView === view}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              {view === 'chat' ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              )}
            </svg>
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </header>
); 