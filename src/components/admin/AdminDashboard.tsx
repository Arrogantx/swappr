import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Flag, AlertTriangle, MessageSquare, UserPlus } from 'lucide-react';
import { getAdminDashboardStats } from '../../services/adminService';
import { AdminVerificationList } from './AdminVerificationList';
import { AdminReviewList } from './AdminReviewList';
import { AdminDisputeList } from './AdminDisputeList';
import { AdminMessageList } from './AdminMessageList';
import { AdminPromotionModal } from './AdminPromotionModal';
import { Button } from '../ui/Button';

export const AdminDashboard = () => {
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  
  const { data: stats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={() => setShowPromoteModal(true)}
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Promote Admin
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Verifications</p>
              <p className="text-2xl font-bold">{stats?.pendingVerifications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <Flag className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold">{stats?.pendingReviews || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Active Disputes</p>
              <p className="text-2xl font-bold">{stats?.activeDisputes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Flagged Messages</p>
              <p className="text-2xl font-bold">{stats?.flaggedMessages || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Requests */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
        <AdminVerificationList />
      </section>

      {/* Flagged Reviews */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Flagged Reviews</h2>
        <AdminReviewList />
      </section>

      {/* Active Disputes */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Active Disputes</h2>
        <AdminDisputeList />
      </section>

      {/* Flagged Messages */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Flagged Messages</h2>
        <AdminMessageList />
      </section>

      {showPromoteModal && (
        <AdminPromotionModal onClose={() => setShowPromoteModal(false)} />
      )}
    </div>
  );
};