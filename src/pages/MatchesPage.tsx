import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { getSwapRequests } from '../services/swapService';
import { MatchCard } from '../components/matches/MatchCard';
import { MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export const MatchesPage = () => {
  const { user, isAuthenticated } = useAuthStore();

  const { data: swapRequests, isLoading } = useQuery({
    queryKey: ['swapRequests', user?.id],
    queryFn: () => getSwapRequests(user?.id!),
    enabled: !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your matches</h2>
        <p className="text-gray-600">
          Please sign in to see your skill swap requests and matches.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingRequests = swapRequests?.filter(req => req.status === 'pending') || [];
  const acceptedRequests = swapRequests?.filter(req => req.status === 'accepted') || [];
  const rejectedRequests = swapRequests?.filter(req => req.status === 'rejected') || [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>

      {/* Pending Requests */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Pending Requests</h2>
        </div>
        {pendingRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map(request => (
              <MatchCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow-sm">
            No pending requests
          </p>
        )}
      </section>

      {/* Accepted Matches */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold">Accepted Matches</h2>
        </div>
        {acceptedRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {acceptedRequests.map(request => (
              <MatchCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow-sm">
            No accepted matches yet
          </p>
        )}
      </section>

      {/* Rejected Requests */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-semibold">Rejected Requests</h2>
        </div>
        {rejectedRequests.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rejectedRequests.map(request => (
              <MatchCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8 bg-white rounded-lg shadow-sm">
            No rejected requests
          </p>
        )}
      </section>
    </div>
  );
};