import { colors, components } from '../lib/theme';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

/** Simple file preview pill with name and remove button */
interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

/** Displays a file name in a pill format with a remove button */
export const FilePreview = ({ file, onRemove }: FilePreviewProps) => (
  <div className={components.filePill.base}>
    {/* Document icon */}
    <DocumentIcon className={`h-3.5 w-3.5 ${colors.primary.light} ${colors.primary.dark} mr-1.5`} />
    
    {/* Truncated file name */}
    <span className={`truncate max-w-[100px] ${colors.text.secondary}`}>{file.name}</span>
    
    {/* Remove button */}
    <button
      onClick={(e) => {
        e.stopPropagation();  // Prevent event from bubbling to parent
        onRemove();
      }}
      className={components.filePill.remove}
      aria-label="Remove file"
    >
      <XMarkIcon className="h-3.5 w-3.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400" />
    </button>
  </div>
); 