'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type View = 'chat' | 'upload';

export default function Home() {
  // View state
  const [currentView, setCurrentView] = useState<View>('chat');

  // Chat states
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
    {role: 'assistant', content: 'Hello! What would you like to know?'}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Upload states
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat handlers
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    setChatHistory(prev => [...prev, {role: 'user', content: userMessage}]);
    setIsLoading(true);
    
    try {
      // Simulate response for now
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: 'assistant', 
          content: 'This is a simulated response. The chat API integration will be implemented later.'
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant', 
        content: 'Sorry, there was an error processing your request. Please try again.'
      }]);
      setIsLoading(false);
    }
  };

  // Upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus(null);
    
    try {
      const formData = new FormData();
      
      // Add description
      formData.append('description', description || 'Description for these files');
      
      // Add each file to the files array in FormData
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Send the request to the Django backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({
          success: true,
          message: 'Files uploaded successfully!'
        });
        
        // Reset form on success
        setFiles([]);
        setDescription('');
      } else {
        setUploadStatus({
          success: false,
          message: data.message || 'Failed to upload files. Please try again.'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        success: false,
        message: 'An error occurred during upload. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-sky-100 dark:from-gray-900 dark:to-sky-950 flex flex-col">
      {/* Header with tab switch */}
      <header className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="MindWell Assistant" 
            className="h-28 w-auto object-contain absolute left-8 top-2"
          />
          
          {/* Tab Switch - Centered */}
          <div className="flex rounded-2xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm p-1.5 w-64 shadow-inner mx-auto">
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentView === 'chat'
                  ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-lg ring-1 ring-sky-100 dark:ring-sky-500/20'
                  : 'text-gray-500 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/50 dark:hover:bg-sky-600/20'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
              Chat
            </button>
            <button
              onClick={() => setCurrentView('upload')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                currentView === 'upload'
                  ? 'bg-white dark:bg-sky-600 text-sky-600 dark:text-white shadow-lg ring-1 ring-sky-100 dark:ring-sky-500/20'
                  : 'text-gray-500 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/50 dark:hover:bg-sky-600/20'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              Upload
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center -mt-20">
        <AnimatePresence mode="wait">
          {/* Chat View */}
          {currentView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center space-y-6"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to MindWell.</h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300">How can I help you today?</p>
              
              <div className="w-full max-w-2xl">
                <form onSubmit={handleChatSubmit} className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What do you want to know?"
                    className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 dark:text-white resize-none py-3 px-4 pr-14 text-base shadow-sm"
                    rows={1}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleChatSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2">
                    <button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      className="p-1.5 text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Upload View */}
          {currentView === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center space-y-6"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
              <p className="text-2xl text-gray-600 dark:text-gray-300">Share your files securely</p>

              <div className="w-full max-w-2xl">
                {uploadStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className={`mb-6 p-4 rounded-xl text-sm ${
                      uploadStatus.success 
                        ? 'bg-green-50/80 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                        : 'bg-red-50/80 text-red-800 dark:bg-red-800/20 dark:text-red-300'
                    }`}
                  >
                    <p className="font-medium">{uploadStatus.message}</p>
                  </motion.div>
                )}

                <div 
                  className={`w-full rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 mb-6
                    ${isDragging ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20 scale-[0.99]' : 'border-sky-200 dark:border-sky-600 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-sky-50/30 dark:hover:bg-sky-900/10'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-500 dark:text-sky-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-base text-gray-600 dark:text-gray-300 mb-1">Drag and drop files here, or click to select files</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload any file type</p>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-4 mb-6">
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-xl p-2 shadow-sm">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500 dark:text-sky-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    id="description"
                    rows={2}
                    className="w-full rounded-2xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 dark:text-white resize-none py-3 px-4 pr-14 text-base shadow-sm"
                    placeholder="Add a description for your files..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>

                  <div className="absolute right-2 bottom-2">
                    <button
                      type="button"
                      onClick={handleUploadSubmit}
                      disabled={files.length === 0 || isUploading}
                      className="p-1.5 text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
