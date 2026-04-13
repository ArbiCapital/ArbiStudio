import { NextResponse, type NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Auth disabled during development — all routes accessible
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
