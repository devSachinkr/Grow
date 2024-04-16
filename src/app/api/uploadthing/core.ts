import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
const f = createUploadthing();

const authUser = () => {
  const user = auth();
  if (!user) throw new Error("Not Authorized");
  return user;
};

export const ourFileRouter = {
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(authUser)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
