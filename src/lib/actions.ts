"use server";

import { db } from "./db";
import { revalidatePath } from "next/cache";

export async function getPopularCourses() {
  return await db.course.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' }
  });
}

export async function getPurchasedCourses(courseIds: string[]) {
  return await db.course.findMany({
    where: {
      id: { in: courseIds }
    }
  });
}

export async function getAdminCourses() {
  return await db.course.findMany({
    include: {
      sections: {
        include: {
          topics: true
        }
      }
    }
  });
}

export async function getCourseWithSyllabus(courseId: string) {
  return await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          topics: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });
}

export async function uploadVideoToTopic(topicId: string, filePath: string) {
  try {
    await db.topic.update({
      where: { id: topicId },
      data: { videoUrl: filePath },
    });
    
    // Revalidate paths so the UI updates
    revalidatePath("/admin");
    revalidatePath("/courses/[id]", "page");
    revalidatePath("/learn/[id]", "page");
    
    return { success: true };
  } catch (error) {
    console.error("Error saving video URL to DB:", error);
    return { success: false, error: "Failed to save to database" };
  }
}

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadVideoAction(formData: FormData, topicId: string) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "private", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = join(uploadDir, uniqueFilename);

  await writeFile(filePath, buffer);

  await uploadVideoToTopic(topicId, uniqueFilename);
  return { success: true, filePath: uniqueFilename };
}
