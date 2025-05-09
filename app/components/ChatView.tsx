import { colors, components } from '../lib/theme';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

/** Chat message structure */
type Message = { role: 'user' | 'assistant'; content: string };

/** Props for the chat interface */
interface ChatViewProps {
  message: string;
  setMessage: (message: string) => void;
  chatHistory: Message[];
  isLoading: boolean;
  handleChatSubmit: (e: React.FormEvent) => void;
}

/** Main chat interface with message input */
export const ChatView = ({ message, setMessage, chatHistory, isLoading, handleChatSubmit }: ChatViewProps) => (
  <motion.div
    key="chat"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="flex flex-col items-center space-y-6"
  >
    {/* Welcome text */}
    <h1 className={`text-4xl font-bold ${colors.text.primary}`}>Welcome to LakeHub.</h1>
    <p className={`text-2xl ${colors.text.secondary}`}>How can I help you today?</p>
    
    {/* Message input */}
    <div className="w-full max-w-2xl">
      <form onSubmit={handleChatSubmit} className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want to know?"
          className={`${components.input.base} ${components.input.sizes.compact} ${colors.background.input}`}
          rows={1}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleChatSubmit(e);
            }
          }}
          aria-label="Chat message"
        />
        <div className="absolute right-2 bottom-2">
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className={`${components.button.icon} ${
              isLoading || !message.trim()
                ? 'opacity-50'
                : `${colors.text.muted} ${colors.primary.hover.light} ${colors.primary.hover.dark} hover:scale-110`
            } transition-all duration-200`}
            aria-label="Send message"
          >
            {isLoading ? (
              <ArrowPathIcon className="animate-spin h-5 w-5" aria-hidden="true" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5 -rotate-90 translate-x-[1px] translate-y-[-1px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </form>
    </div>
  </motion.div>
); 