import { supabase } from '../lib/supabase';
import type { AdminState, Review, SkillSwapRequest, Message, VerificationDocument } from '../types';

export const promoteToAdmin = async (userId: string): Promise<void> => {
  const { error } = await supabase.rpc('promote_to_admin', { user_id: userId });
  if (error) throw error;
};

export const getAdminDashboardStats = async (): Promise<AdminState> => {
  const [
    { count: pendingVerifications },
    { count: pendingReviews },
    { count: activeDisputes },
    { count: flaggedMessages }
  ] = await Promise.all([
    supabase
      .from('verification_documents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('skill_swap_requests')
      .select('*', { count: 'exact', head: true })
      .eq('dispute_status', 'pending'),
    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_flagged', true)
      .is('admin_review_status', null)
  ]);

  return {
    pendingVerifications: pendingVerifications || 0,
    pendingReviews: pendingReviews || 0,
    activeDisputes: activeDisputes || 0,
    flaggedMessages: flaggedMessages || 0
  };
};

export const getPendingVerifications = async (): Promise<VerificationDocument[]> => {
  const { data, error } = await supabase
    .from('verification_documents')
    .select(`
      *,
      user:users(name, email),
      skill:skills(name)
    `)
    .eq('status', 'pending');

  if (error) throw error;
  return data;
};

export const reviewVerification = async (
  documentId: string,
  approved: boolean,
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('verification_documents')
    .update({
      status: approved ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      admin_notes: notes
    })
    .eq('id', documentId);

  if (error) throw error;
};

export const getFlaggedReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:users!reviewer_id(name, email),
      skill:skills(name)
    `)
    .eq('status', 'flagged');

  if (error) throw error;
  return data;
};

export const moderateReview = async (
  reviewId: string,
  action: 'approve' | 'remove',
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('reviews')
    .update({
      status: action === 'approve' ? 'approved' : 'removed',
      admin_notes: notes
    })
    .eq('id', reviewId);

  if (error) throw error;
};

export const getActiveDisputes = async (): Promise<SkillSwapRequest[]> => {
  const { data, error } = await supabase
    .from('skill_swap_requests')
    .select(`
      *,
      requester:users!requester_id(name, email),
      provider:users!provider_id(name, email),
      requested_skill:skills!requested_skill_id(name),
      offered_skill:skills!offered_skill_id(name)
    `)
    .eq('dispute_status', 'pending');

  if (error) throw error;
  return data;
};

export const resolveDispute = async (
  requestId: string,
  resolution: string,
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('skill_swap_requests')
    .update({
      dispute_status: 'resolved',
      dispute_resolution: resolution,
      admin_notes: notes
    })
    .eq('id', requestId);

  if (error) throw error;
};

export const getFlaggedMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id(name, email),
      recipient:users!recipient_id(name, email)
    `)
    .eq('is_flagged', true)
    .is('admin_review_status', null);

  if (error) throw error;
  return data;
};

export const reviewFlaggedMessage = async (
  messageId: string,
  action: 'approve' | 'remove',
  notes?: string
): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({
      admin_review_status: 'reviewed',
      is_flagged: action === 'approve' ? false : true,
      admin_notes: notes
    })
    .eq('id', messageId);

  if (error) throw error;
};