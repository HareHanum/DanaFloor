import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = ["/courses", "/profile"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => path.startsWith(route)) && user) {
    return NextResponse.redirect(new URL("/courses", request.url));
  }

  // Protect platform routes (but allow lesson pages through for previews)
  const isLessonPage = /^\/courses\/[^/]+\/lessons\/[^/]+$/.test(path);
  if (
    PROTECTED_ROUTES.some((route) => path.startsWith(route)) &&
    !user &&
    !isLessonPage
  ) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => path.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|pdf)$).*)",
  ],
};
