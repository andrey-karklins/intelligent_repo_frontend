'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { colors } from './lib/theme';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { UploadView } from './components/UploadView';
import { documentsApi } from './lib/api/documents';
import { View, Message } from './lib/types';
import { UploadStatus } from './lib/api/documents';

export default function Home() {
  // =========== State Management ===========
  
  // View state
  const [currentView, setCurrentView] = useState<View>('chat');

  // Chat states
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {role: 'assistant', content: 'Hello! What would you like to know?'}
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Upload states
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========== Event Handlers ===========

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
  const handleUploadSubmit = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus(null);
    
    const status = await documentsApi.uploadDocuments(files, description);
    setUploadStatus(status);
    
    if (status?.success) {
      setFiles([]);
      setDescription('');
    }
    
    setIsUploading(false);
  };

  // =========== Main Render ===========

  return (
    <div className={`min-h-screen ${colors.background.gradient} flex flex-col`}>
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center -mt-20">
        <AnimatePresence mode="wait">
          {currentView === 'chat' ? (
            <ChatView
              message={message}
              setMessage={setMessage}
              chatHistory={chatHistory}
              isLoading={isLoading}
              handleChatSubmit={handleChatSubmit}
            />
          ) : (
            <UploadView
              files={files}
              setFiles={setFiles}
              description={description}
              setDescription={setDescription}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              isUploading={isUploading}
              uploadStatus={uploadStatus}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleUploadSubmit={handleUploadSubmit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
