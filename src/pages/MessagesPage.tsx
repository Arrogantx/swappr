import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MessageList } from '../components/messages/MessageList';
import { MessageInput } from '../components/messages/MessageInput';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services/userService';

export const MessagesPage = () => {
  const { userId } = useParams();
  const { user, isAuthenticated } = useAuthStore();

  const { data: recipient } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)]">
      {recipient && (
        <div className="flex flex-col h-full">
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <img
                src={recipient.profileImage || 'https://via.placeholder.com/40'}
                alt={recipient.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold">{recipient.name}</h2>
                <p className="text-sm text-gray-500">{recipient.bio}</p>
              </div>
            </div>
          </div>

          <MessageList recipientId={userId!} />
          <MessageInput recipientId={userId!} />
        </div>
      )}
    </div>
  );
};