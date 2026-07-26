import { NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/oauth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  return handleOAuthCallback(request, "google", searchParams);
}
