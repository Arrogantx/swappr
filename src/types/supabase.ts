export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          bio: string | null
          profile_image: string | null
          rating: number
          review_count: number
          is_verified: boolean
          is_admin: boolean
          identity_verified: boolean
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name: string
          bio?: string | null
          profile_image?: string | null
          rating?: number
          review_count?: number
          is_verified?: boolean
          is_admin?: boolean
          identity_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          bio?: string | null
          profile_image?: string | null
          rating?: number
          review_count?: number
          is_verified?: boolean
          is_admin?: boolean
          identity_verified?: boolean
        }
      }
      skills: {
        Row: {
          id: string
          created_at: string
          name: string
          category: string
          description: string
          experience_level: string
          tags: string[]
          user_id: string
          rating: number
          review_count: number
          is_verified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          category: string
          description: string
          experience_level: string
          tags: string[]
          user_id: string
          rating?: number
          review_count?: number
          is_verified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          category?: string
          description?: string
          experience_level?: string
          tags?: string[]
          user_id?: string
          rating?: number
          review_count?: number
          is_verified?: boolean
        }
      }
      verification_documents: {
        Row: {
          id: string
          created_at: string
          type: string
          name: string
          url: string
          status: string
          user_id: string
          skill_id: string | null
          reviewed_at: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          type: string
          name: string
          url: string
          status?: string
          user_id: string
          skill_id?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          type?: string
          name?: string
          url?: string
          status?: string
          user_id?: string
          skill_id?: string | null
          reviewed_at?: string | null
          admin_notes?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          user_id: string
          skill_id: string
          reviewer_id: string
          rating: number
          comment: string
          status: string
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          skill_id: string
          reviewer_id: string
          rating: number
          comment: string
          status?: string
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          skill_id?: string
          reviewer_id?: string
          rating?: number
          comment?: string
          status?: string
          admin_notes?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          sender_id: string
          recipient_id: string
          content: string
          is_flagged: boolean
          admin_review_status: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          sender_id: string
          recipient_id: string
          content: string
          is_flagged?: boolean
          admin_review_status?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          is_flagged?: boolean
          admin_review_status?: string | null
          admin_notes?: string | null
        }
      }
      skill_swap_requests: {
        Row: {
          id: string
          created_at: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status: string
          message: string
          dispute_reason: string | null
          dispute_status: string | null
          dispute_resolution: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          requester_id: string
          provider_id: string
          requested_skill_id: string
          offered_skill_id: string
          status?: string
          message: string
          dispute_reason?: string | null
          dispute_status?: string | null
          dispute_resolution?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          requester_id?: string
          provider_id?: string
          requested_skill_id?: string
          offered_skill_id?: string
          status?: string
          message?: string
          dispute_reason?: string | null
          dispute_status?: string | null
          dispute_resolution?: string | null
          admin_notes?: string | null
        }
      }
    }
  }
}