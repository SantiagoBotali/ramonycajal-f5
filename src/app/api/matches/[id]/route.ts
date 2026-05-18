import { NextResponse } from "next/server";
import { removeMatch, replaceMatch } from "@/lib/matches-store";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Error inesperado";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const match = await replaceMatch(id, await request.json());

    if (!match) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await removeMatch(id);

    if (!deleted) {
      return NextResponse.json({ error: "Partido no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
