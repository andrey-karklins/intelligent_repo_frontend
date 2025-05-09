import { colors, components } from '../lib/theme';

/** Modal for displaying and managing uploaded files */
interface FileListModalProps {
  files: File[];
  onRemove: (index: number) => void;
  onClose: () => void;
}

/** Modal dialog showing complete list of uploaded files */
export const FileListModal = ({ files, onRemove, onClose }: FileListModalProps) => (
  <div className={`${components.modal.overlay} ${colors.overlay.backdrop}`} onClick={onClose}>
    <div 
      className={`${components.modal.panel} ${colors.overlay.panel}`}
      onClick={e => e.stopPropagation()}
    >
      {/* Header with title and close button */}
      <div className={components.modal.header}>
        <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Uploaded Files</h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${colors.text.muted} hover:bg-gray-100 dark:hover:bg-gray-700`}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* List of files with remove buttons */}
      <div className={components.modal.body}>
        <div className="space-y-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between ${colors.background.card} rounded-xl p-2.5 shadow-sm`}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${colors.primary.light} ${colors.primary.dark} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className={`text-sm ${colors.text.secondary}`}>{file.name}</span>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label={`Remove ${file.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
); 