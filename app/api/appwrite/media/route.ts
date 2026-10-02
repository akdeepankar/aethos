import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

function getAppwriteStorage() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

  if (!apiKey) {
    throw new Error("Missing APPWRITE_API_KEY in environment");
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const storage = new Storage(client);

  return { client, storage, endpoint, projectId };
}

// GET /api/appwrite/media or GET /api/appwrite/media?fileId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const { storage, endpoint, projectId } = getAppwriteStorage();

    // If fileId is passed, stream the file content through backend proxy to bypass unauthenticated 401 errors
    if (fileId) {
      const fileMeta = await storage.getFile("aethos_pdfs", fileId).catch(() => null);
      const fileBytes = await storage.getFileView("aethos_pdfs", fileId);

      return new NextResponse(fileBytes, {
        headers: {
          "Content-Type": fileMeta?.mimeType || "application/pdf",
          "Content-Disposition": `inline; filename="${fileMeta?.name || "document.pdf"}"`,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    const host = req.nextUrl.origin || "http://localhost:3000";
    const res = await storage.listFiles("aethos_pdfs");

    const files = res.files.map((f) => ({
      id: f.$id,
      name: f.name,
      size: f.sizeOriginal,
      type: f.mimeType || "application/octet-stream",
      url: `${host}/api/appwrite/media?fileId=${f.$id}`,
      uploadedAt: new Date(f.$createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      category: f.name.endsWith(".html") ? "Report HTML" : f.name.endsWith(".pdf") ? "Research PDF" : "General",
    }));

    return NextResponse.json({ success: true, total: res.total, files });
  } catch (error: unknown) {
    console.error("Error in GET /api/appwrite/media:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error), files: [] },
      { status: 500 }
    );
  }
}

// POST /api/appwrite/media
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "General";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const { storage, endpoint, projectId } = getAppwriteStorage();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const safeFileId = `file_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
    const inputFile = InputFile.fromBuffer(fileBuffer, file.name);

    const created = await storage.createFile("aethos_pdfs", safeFileId, inputFile, [
      Permission.read(Role.any()),
    ]);

    const host = req.nextUrl.origin || "http://localhost:3000";
    const storedFile = {
      id: created.$id,
      name: created.name,
      size: created.sizeOriginal,
      type: created.mimeType || file.type || "application/octet-stream",
      url: `${host}/api/appwrite/media?fileId=${created.$id}`,
      uploadedAt: new Date(created.$createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      category: file.name.endsWith(".html") ? "Report HTML" : file.name.endsWith(".pdf") ? "Research PDF" : category,
    };

    return NextResponse.json({ success: true, file: storedFile });
  } catch (error: unknown) {
    console.error("Error uploading to Appwrite Storage:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/appwrite/media?id=fileId
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing file id parameter" }, { status: 400 });
    }

    const { storage } = getAppwriteStorage();
    await storage.deleteFile("aethos_pdfs", id);

    return NextResponse.json({ success: true, action: "deleted", id });
  } catch (error: unknown) {
    console.error("Error deleting file from Appwrite Storage:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
