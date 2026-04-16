import { createClient } from "@/lib/supabase/server";
import PlatformHeader from "@/components/course/PlatformHeader";
import GuestLessonHeader from "@/components/course/GuestLessonHeader";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guest user (only reaches here for preview lessons)
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <GuestLessonHeader />
        <main className="pt-20">{children}</main>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <PlatformHeader
        userName={profile?.full_name || "משתמש"}
        userEmail={user.email || ""}
        isAdmin={profile?.role === "admin"}
      />
      <main className="pt-20">{children}</main>
    </div>
  );
}
