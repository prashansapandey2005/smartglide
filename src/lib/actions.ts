"use server";

import { db } from "./db";
import { revalidatePath } from "next/cache";

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
