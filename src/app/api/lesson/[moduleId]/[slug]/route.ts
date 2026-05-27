import { NextResponse } from "next/server";
import { getSubmodule } from "@/lib/curriculum";
import { getLessonHtml } from "@/lib/content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ moduleId: string; slug: string }> }
) {
  const { moduleId, slug } = await params;
  const id = parseInt(moduleId, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid module id" }, { status: 400 });
  }

  const submodule = getSubmodule(id, slug);
  if (!submodule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const html = getLessonHtml(id, slug);
  if (!html) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json({ html, submodule });
}
