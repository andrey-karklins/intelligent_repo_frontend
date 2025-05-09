import { colors, components } from '../lib/theme';
import { motion } from 'framer-motion';

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
            className={`${components.button.icon} ${colors.text.muted} ${colors.primary.hover.light} ${colors.primary.hover.dark}`}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  </motion.div>
); 