import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),

  courseVideo: f({ video: { maxFileSize: "1GB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),

  coursePdf: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
      return { uploadedBy: "admin" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
