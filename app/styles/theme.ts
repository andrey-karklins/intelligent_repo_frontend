// Color palette configuration
export const colors = {
  primary: {
    light: 'text-sky-500',
    dark: 'dark:text-sky-400',
    hover: {
      light: 'hover:text-sky-500',
      dark: 'dark:hover:text-sky-400'
    },
    bg: {
      light: 'bg-sky-50/80',
      dark: 'dark:bg-sky-800/20'
    }
  },
  background: {
    gradient: 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-gray-900 dark:to-sky-950',
    input: 'bg-gray-50 dark:bg-gray-800',
    card: 'bg-white/50 dark:bg-gray-800/50'
  },
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400'
  },
  status: {
    success: {
      bg: 'bg-green-50/80 dark:bg-green-800/20',
      text: 'text-green-800 dark:text-green-300'
    },
    error: {
      bg: 'bg-red-50/80 dark:bg-red-800/20',
      text: 'text-red-800 dark:text-red-300'
    }
  },
  overlay: {
    backdrop: 'bg-black/20 backdrop-blur-sm dark:bg-black/40',
    panel: 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm'
  }
};

// Common component styles
export const components = {
  input: {
    base: `w-full rounded-2xl border-0 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 
           dark:text-white resize-none shadow-sm`,
    sizes: {
      compact: 'py-3 px-4 pr-14 text-base'
    }
  },
  button: {
    icon: 'p-1.5 disabled:opacity-50 disabled:cursor-not-allowed',
    tab: `flex-1 flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium 
          transition-all duration-300`
  },
  filePill: {
    base: `inline-flex items-center rounded-full px-3 py-1 text-sm 
           bg-white/70 dark:bg-gray-800/70 shadow-sm hover:bg-white/90 dark:hover:bg-gray-700/90
           transition-all duration-200`,
    container: `flex flex-wrap gap-2 items-center`,
    remove: `ml-2 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
             transition-colors duration-200`
  },
  modal: {
    overlay: `fixed inset-0 z-50 flex items-start justify-center pt-16`,
    panel: `w-full max-w-lg rounded-xl shadow-lg p-4 max-h-[70vh] overflow-hidden flex flex-col`,
    header: `flex items-center justify-between pb-3 border-b dark:border-gray-700`,
    body: `overflow-y-auto flex-1 py-4`,
    footer: `pt-3 border-t dark:border-gray-700 flex justify-end`
  }
}; 