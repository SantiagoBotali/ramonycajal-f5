import { NextResponse } from "next/server";
import { createMatch, getMatches } from "@/lib/matches-store";

export const dynamic = "force-dynamic";

function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Error inesperado";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET() {
  try {
    const matches = await getMatches();
    return NextResponse.json({ matches });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const match = await createMatch(await request.json());
    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
