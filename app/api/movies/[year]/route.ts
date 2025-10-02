import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: Request,
  context: { params: Promise<{ year: string }> } 
) {
  const { year } = await context.params; 
  const filePath = path.join(process.cwd(), "data", `${year}.json`);

  try {
    const file = await fs.readFile(filePath, "utf-8");
    const movies: string[] = JSON.parse(file);

    return NextResponse.json(movies);
  } catch (err) {
    console.error(`Failed to read movies for ${year}:`, err);
    return NextResponse.json({ error: "Movies not found" }, { status: 404 });
  }
}