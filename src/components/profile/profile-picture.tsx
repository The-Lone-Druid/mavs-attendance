"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@prisma/client";
import { Upload } from "lucide-react";

interface ProfilePictureProps {
  user: User;
}

export function ProfilePicture({ user }: ProfilePictureProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      toast.success("Profile picture updated");
      // Refresh the page to show new image
      window.location.reload();
    } catch (error) {
      toast.error("Failed to upload profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-full">
        {user.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {user.name[0].toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => document.getElementById("picture-upload")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {loading ? "Uploading..." : "Upload New Picture"}
        </Button>
        <input
          id="picture-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
} 