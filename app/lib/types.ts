/** Available navigation views */
export type View = 'chat' | 'upload';

/** Chat message structure */
export type Message = {
  role: 'user' | 'assistant';
  content: string;
}; 