import { colors, components } from '../lib/theme';

/** Simple file preview pill with name and remove button */
interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

/** Displays a file name in a pill format with a remove button */
export const FilePreview = ({ file, onRemove }: FilePreviewProps) => (
  <div className={components.filePill.base}>
    {/* Document icon */}
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${colors.primary.light} ${colors.primary.dark} mr-1.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    
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
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
); 