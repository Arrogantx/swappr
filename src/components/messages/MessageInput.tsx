import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { sendMessage } from '../../services/messageService';
import { useQueryClient } from '@tanstack/react-query';

interface MessageInputProps {
  recipientId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ recipientId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setIsSending(true);
    try {
      await sendMessage(recipientId, message);
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', recipientId] });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};