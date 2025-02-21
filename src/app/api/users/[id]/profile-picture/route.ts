import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.id !== parseInt(params.id)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Update user profile picture
    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: { profilePicture: blob.url },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[PROFILE_PICTURE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
