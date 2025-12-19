import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    video: { maxFileSize: "32MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      try {
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
          throw new Error("No auth token");
        }

        const user = await verifyAuth(token);

        if (!user) {
          throw new Error("Unauthorized");
        }

        return {
          userId: user.userId,
        };
      } catch (err) {
        console.error("❌ Upload middleware error:", err);
        throw new Error("Unauthorized upload");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload complete (server)");
      console.log("User:", metadata.userId);
      console.log("File URL:", file.url);

      return {
        url: file.url || file.ufsUrl,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
