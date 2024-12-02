import type { Message } from '../types';

const mockMessages: Message[] = [];

export const getMessages = async (recipientId: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMessages.filter(
    message => 
      (message.senderId === recipientId) || 
      (message.recipientId === recipientId)
  );
};

export const sendMessage = async (recipientId: string, content: string): Promise<Message> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newMessage: Message = {
    id: Math.random().toString(36).substr(2, 9),
    senderId: '1', // Mock user ID
    recipientId,
    content,
    createdAt: new Date(),
  };

  mockMessages.push(newMessage);
  return newMessage;
};