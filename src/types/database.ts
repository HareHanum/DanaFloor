export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Views: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: "student" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          thumbnail_url: string | null;
          price_ils: number;
          subscription_price_ils: number | null;
          payment_type: "one_time" | "subscription";
          status: "draft" | "published" | "archived";
          comments_enabled: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          price_ils?: number;
          comments_enabled?: boolean;
          subscription_price_ils?: number | null;
          payment_type?: "one_time" | "subscription";
          status?: "draft" | "published" | "archived";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          thumbnail_url?: string | null;
          price_ils?: number;
          subscription_price_ils?: number | null;
          payment_type?: "one_time" | "subscription";
          status?: "draft" | "published" | "archived";
          comments_enabled?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          lesson_type: "video" | "text" | "quiz" | "download";
          mux_playback_id: string | null;
          mux_asset_id: string | null;
          duration_seconds: number | null;
          content_html: string | null;
          download_url: string | null;
          sort_order: number;
          is_preview: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          lesson_type?: "video" | "text" | "quiz" | "download";
          mux_playback_id?: string | null;
          mux_asset_id?: string | null;
          duration_seconds?: number | null;
          content_html?: string | null;
          download_url?: string | null;
          sort_order?: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          lesson_type?: "video" | "text" | "quiz" | "download";
          mux_playback_id?: string | null;
          mux_asset_id?: string | null;
          duration_seconds?: number | null;
          content_html?: string | null;
          download_url?: string | null;
          sort_order?: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: "active" | "expired" | "cancelled" | "refunded";
          payment_type: string;
          payplus_transaction_id: string | null;
          payplus_subscription_id: string | null;
          enrolled_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: "active" | "expired" | "cancelled" | "refunded";
          payment_type?: string;
          payplus_transaction_id?: string | null;
          payplus_subscription_id?: string | null;
          enrolled_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: "active" | "expired" | "cancelled" | "refunded";
          payment_type?: string;
          payplus_transaction_id?: string | null;
          payplus_subscription_id?: string | null;
          enrolled_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          status: "not_started" | "in_progress" | "completed";
          progress_seconds: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          course_id: string;
          status?: "not_started" | "in_progress" | "completed";
          progress_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          course_id?: string;
          status?: "not_started" | "in_progress" | "completed";
          progress_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          amount_ils: number;
          currency: string;
          status: "pending" | "completed" | "failed" | "refunded";
          payplus_transaction_id: string | null;
          payplus_payment_page_uid: string | null;
          payment_method: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          amount_ils: number;
          currency?: string;
          status: "pending" | "completed" | "failed" | "refunded";
          payplus_transaction_id?: string | null;
          payplus_payment_page_uid?: string | null;
          payment_method?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          amount_ils?: number;
          currency?: string;
          status?: "pending" | "completed" | "failed" | "refunded";
          payplus_transaction_id?: string | null;
          payplus_payment_page_uid?: string | null;
          payment_method?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_attachments: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          attachment_type: "file" | "link";
          file_url: string | null;
          link_url: string | null;
          file_name: string | null;
          file_size: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          attachment_type?: "file" | "link";
          file_url?: string | null;
          link_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          title?: string;
          attachment_type?: "file" | "link";
          file_url?: string | null;
          link_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_attachments_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_comments: {
        Row: {
          id: string;
          lesson_id: string;
          user_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          user_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          user_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_comments_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type LessonProgress = Database["public"]["Tables"]["lesson_progress"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type LessonAttachment = Database["public"]["Tables"]["lesson_attachments"]["Row"];
export type LessonComment = Database["public"]["Tables"]["lesson_comments"]["Row"];
