import { NextRequest, NextResponse } from "next/server";
import { Client, Users, TablesDB, ID } from "node-appwrite";

function getAppwriteServices() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

  if (!apiKey) {
    throw new Error("Missing APPWRITE_API_KEY in environment");
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const users = new Users(client);
  const tablesDB = new TablesDB(client);
  const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";

  return { users, tablesDB, databaseId };
}

// GET /api/appwrite/users — Fetches all registered Appwrite Auth users + their roles from users_meta
export async function GET() {
  try {
    const { users, tablesDB, databaseId } = getAppwriteServices();

    // 1. Fetch real Appwrite Auth accounts
    const authList = await users.list();

    // 2. Fetch users_meta table
    let metaRows: Record<string, any> = {};
    try {
      const metaList = await tablesDB.listRows(databaseId, "users_meta");
      for (const row of metaList.rows) {
        metaRows[row.userId || row.$id] = row;
      }
    } catch (e) {
      console.warn("Could not fetch users_meta rows:", e);
    }

    // 3. Merge Auth users with metadata
    const memberList = authList.users.map((u) => {
      const meta = metaRows[u.$id] || {};
      const formattedDate = new Date(u.registration).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      let role = meta.role || (u.labels?.includes("admin") ? "Admin" : u.email.includes("deepak") ? "Admin" : "Institutional");
      let status = u.status ? (meta.status || "Active") : "Suspended";

      return {
        id: u.$id,
        name: u.name || meta.name || u.email.split("@")[0],
        email: u.email,
        role: role as "Admin" | "Institutional" | "Pro" | "Standard",
        status: status as "Active" | "Pending" | "Suspended",
        joinedDate: meta.joinedAt || formattedDate,
        emailVerified: u.emailVerification,
        provider: "Google OAuth2",
        labels: u.labels || [],
      };
    });

    return NextResponse.json({
      success: true,
      total: memberList.length,
      users: memberList,
    });
  } catch (error: unknown) {
    console.error("Error fetching Appwrite users:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/appwrite/users — Create or Invite a member in Appwrite Auth
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role = "Institutional", password } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const { users, tablesDB, databaseId } = getAppwriteServices();
    const userId = ID.unique();

    // Create user in Appwrite Auth
    const tempPassword = password || Math.random().toString(36).slice(2) + "A1!aethos";
    const newAuthUser = await users.create(userId, email, undefined, tempPassword, name || email.split("@")[0]);

    // Update labels
    if (role === "Admin") {
      await users.updateLabels(userId, ["admin"]);
    }

    // Save to users_meta
    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const metaData = {
      userId: newAuthUser.$id,
      email: newAuthUser.email,
      name: newAuthUser.name,
      role: role,
      status: "Active",
      joinedAt: formattedDate,
    };

    try {
      await tablesDB.createRow(databaseId, "users_meta", newAuthUser.$id, metaData);
    } catch (err) {
      console.warn("Notice saving users_meta:", err);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newAuthUser.$id,
        name: newAuthUser.name,
        email: newAuthUser.email,
        role: role,
        status: "Active",
        joinedDate: formattedDate,
        emailVerified: false,
        provider: "Appwrite Auth",
      },
    });
  } catch (error: unknown) {
    console.error("Error creating Appwrite user:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/appwrite/users — Update member role, name, or status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const { users, tablesDB, databaseId } = getAppwriteServices();

    // 1. Update Auth name if provided
    if (name) {
      try {
        await users.updateName(id, name);
      } catch (e) {
        console.warn("Could not update auth name:", e);
      }
    }

    // 2. Update Auth status (block/unblock) if provided
    if (status) {
      try {
        await users.updateStatus(id, status === "Active");
      } catch (e) {
        console.warn("Could not update auth status:", e);
      }
    }

    // 3. Update Auth labels
    if (role) {
      try {
        const labels = role === "Admin" ? ["admin"] : [role.toLowerCase()];
        await users.updateLabels(id, labels);
      } catch (e) {
        console.warn("Could not update auth labels:", e);
      }
    }

    // 4. Update users_meta table in TablesDB
    const metaData: Record<string, any> = {};
    if (name) metaData.name = name;
    if (role) metaData.role = role;
    if (status) metaData.status = status;

    try {
      await tablesDB.getRow(databaseId, "users_meta", id);
      await tablesDB.updateRow(databaseId, "users_meta", id, metaData);
    } catch {
      // Create if missing
      try {
        const authUser = await users.get(id);
        await tablesDB.createRow(databaseId, "users_meta", id, {
          userId: id,
          email: authUser.email,
          name: name || authUser.name,
          role: role || "Institutional",
          status: status || "Active",
          joinedAt: new Date(authUser.registration).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });
      } catch (err) {
        console.warn("Failed creating users_meta row on patch:", err);
      }
    }

    return NextResponse.json({ success: true, id, updated: { name, role, status } });
  } catch (error: unknown) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/appwrite/users?id=6ab3c...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const { users, tablesDB, databaseId } = getAppwriteServices();

    // 1. Delete from users_meta
    try {
      await tablesDB.deleteRow(databaseId, "users_meta", id);
    } catch (e) {
      console.warn("Notice deleting users_meta row:", e);
    }

    // 2. Delete from Appwrite Auth
    try {
      await users.delete(id);
    } catch (e) {
      console.warn("Notice deleting Appwrite Auth user:", e);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    console.error("Error deleting Appwrite user:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
