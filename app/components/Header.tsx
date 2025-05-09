import { View } from '../lib/types';
import { colors, components } from '../lib/theme';
import { ChatBubbleLeftRightIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

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
        {[
          { id: 'chat', Icon: ChatBubbleLeftRightIcon },
          { id: 'upload', Icon: CloudArrowUpIcon }
        ].map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id as View)}
            className={`${components.button.tab} ${
              currentView === id
                ? `bg-white dark:bg-sky-600 ${colors.primary.light} dark:text-white shadow-lg ring-1 ring-sky-100 dark:ring-sky-500/20`
                : `${colors.text.muted} ${colors.primary.hover.light} ${colors.primary.hover.dark} hover:bg-white/50 dark:hover:bg-sky-600/20`
            }`}
            aria-label={`Switch to ${id} view`}
            aria-pressed={currentView === id}
          >
            <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </header>
); 