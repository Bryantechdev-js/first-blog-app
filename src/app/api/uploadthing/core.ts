import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 10 },
    video: { maxFileSize: "32MB", maxFileCount: 3 },
  })
    .middleware(async () => {
      const store = cookies();
      const token = store.get("token")?.value;
      const user = await verifyAuth(token);

      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadComplete(({ file, metadata }) => {
      return {
        url: file.ufsUrl,
        uploadedBy: metadata.userId,
      };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
