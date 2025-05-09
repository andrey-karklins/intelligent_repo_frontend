import { useRef, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, components } from '../lib/theme';
import { FilePreview } from './FilePreview';
import { FileListModal } from './FileListModal';
import { UploadStatus } from '../lib/api/documents';
import { CloudArrowUpIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

/** Props for file upload interface */
interface UploadViewProps {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  isUploading: boolean;
  uploadStatus: UploadStatus | null;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  handleUploadSubmit: () => Promise<void>;
}

/** File upload interface with drag-and-drop */
export const UploadView = ({
  files,
  setFiles,
  description,
  setDescription,
  isDragging,
  setIsDragging,
  isUploading,
  uploadStatus,
  isModalOpen,
  setIsModalOpen,
  handleUploadSubmit
}: UploadViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Handle file selection from input */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  /** Handle drag over event */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /** Handle drag leave event */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /** Handle file drop event */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  /** Remove file at given index */
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      key="upload"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col items-center space-y-6"
    >
      {/* Title */}
      <h1 className={`text-4xl font-bold ${colors.text.primary}`}>Upload Documents</h1>
      <p className={`text-2xl ${colors.text.secondary}`}>Share your files securely</p>

      <div className="w-full max-w-2xl">
        {/* Status message */}
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`mb-6 p-4 rounded-xl text-sm ${
              uploadStatus.success 
                ? `${colors.status.success.bg} ${colors.status.success.text}`
                : `${colors.status.error.bg} ${colors.status.error.text}`
            }`}
            role="alert"
          >
            <p className="font-medium">{uploadStatus.message}</p>
          </motion.div>
        )}

        {/* Drop zone */}
        <div 
          className={`w-full rounded-2xl ${colors.background.input} border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-4
            ${isDragging 
              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 scale-[0.99]' 
              : 'border-sky-200 dark:border-sky-600 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-900/10'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          aria-label="Click or drag files to upload"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            aria-hidden="true"
          />
          <CloudArrowUpIcon className={`h-12 w-12 ${colors.primary.light} ${colors.primary.dark} mb-4`} aria-hidden="true" />
          <p className={`text-base ${colors.text.secondary} mb-1`}>Drag and drop files here, or click to select files</p>
          <p className={`text-sm ${colors.text.muted}`}>Upload any file type</p>
        </div>

        {/* File previews */}
        {files.length > 0 && (
          <div className="mb-4">
            <div className={components.filePill.container}>
              {files.slice(0, 3).map((file, index) => (
                <FilePreview
                  key={index}
                  file={file}
                  onRemove={() => removeFile(index)}
                />
              ))}
              {files.length > 3 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={components.filePill.base}
                  aria-label={`Show ${files.length - 3} more files`}
                >
                  <span className={colors.text.secondary}>+{files.length - 3} more</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Description input */}
        <div className="relative">
          <textarea
            id="description"
            rows={2}
            className={`${components.input.base} ${components.input.sizes.compact} ${colors.background.input}`}
            placeholder="Add a description for your files..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="File description"
          ></textarea>

          {/* Upload button */}
          <div className="absolute right-2 bottom-2">
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={files.length === 0 || isUploading}
              className={`${components.button.icon} ${
                files.length === 0 || isUploading
                  ? 'opacity-50'
                  : `${colors.text.muted} ${colors.primary.hover.light} ${colors.primary.hover.dark} hover:scale-110`
              } transition-all duration-200`}
              aria-label="Upload files"
            >
              {isUploading ? (
                <ArrowPathIcon className="animate-spin h-5 w-5" aria-hidden="true" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5 -rotate-90 translate-x-[1px] translate-y-[-1px]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* File list modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FileListModal
              files={files}
              onRemove={removeFile}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 