import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { error } from "console";
import { utapi } from "./uploadthing";
import { images } from "./db/schema";
import analyticsServerClient from "./analytics";
import { redirect } from "next/navigation";



export async function getMyImages() {
     const user = await auth();
      if (!user.userId) throw new Error("Unauthorized");
    
      
      const images = await db.query.images.findMany({
        where: (model) => eq(model.userId,user.userId),
        orderBy: (model, {desc}) => desc (model.id),
      });

      return images;
}

export async function getImage(id: number) {
  const user = await auth();
   if (!user.userId) throw new Error("Unauthorized");
 
   
   const image = await db.query.images.findFirst({
     where: (model, {eq}) => eq(model.id,id),
   });

   if (!image) throw new Error("Image Not Found");

   if (image.userId !==user.userId) throw new Error ("Unauthorized");

   return image;
}
export async function deleteImage(id: number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");


  const image = await db.query.images.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!image) throw new Error("Image Not Found");

  if (image.userId !== user.userId) throw new Error("Unauthorized");

  const fileKey = image.url?.split("/").pop();

  if (!fileKey) throw new Error("Invalid file key");

   await utapi.deleteFiles(fileKey);

   await db.delete(images).where(and(eq(images.id,id), eq (images.userId, user.userId)));

   analyticsServerClient.capture({
    distinctId: user.userId,
    event: "Delete  Image",
    properties: {
      imageId: id,
    },
   });
   
   redirect("/?deleted=true");
}