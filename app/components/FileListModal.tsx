import { colors, components } from '../lib/theme';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

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
          <XMarkIcon className="h-5 w-5" />
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
                <DocumentIcon className={`h-4 w-4 ${colors.primary.light} ${colors.primary.dark} mr-2`} />
                <span className={`text-sm ${colors.text.secondary}`}>{file.name}</span>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label={`Remove ${file.name}`}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
); 