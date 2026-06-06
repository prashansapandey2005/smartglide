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
        orderBy: { order: 'asc' },
        include: {
          topics: {
            orderBy: { order: 'asc' },
            include: {
              contents: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
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
            orderBy: { order: 'asc' },
            include: {
              contents: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      }
    }
  });
}

export async function createCourse(data: any) {
  const course = await db.course.create({
    data: {
      title: data.title,
      description: data.description,
      longDescription: data.longDescription,
      price: parseFloat(data.price),
      originalPrice: parseFloat(data.originalPrice),
      instructor: data.instructor,
      tags: JSON.stringify(data.tags),
      features: JSON.stringify(data.features),
      imageUrl: data.imageUrl,
    }
  });
  revalidatePath("/admin");
  revalidatePath("/courses");
  return course;
}

export async function addSection(courseId: string, title: string) {
  const section = await db.section.create({
    data: {
      title,
      courseId,
    }
  });
  revalidatePath("/admin");
  return section;
}

export async function addTopic(sectionId: string, title: string) {
  const topic = await db.topic.create({
    data: {
      title,
      sectionId,
    }
  });
  revalidatePath("/admin");
  return topic;
}

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function addContent(formData: FormData) {
  const file = formData.get("file") as File;
  const topicId = formData.get("topicId") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string; // "VIDEO" or "PDF"

  if (!file || !topicId || !title || !type) {
    throw new Error("Missing required fields");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "private", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = join(uploadDir, uniqueFilename);

  await writeFile(filePath, buffer);

  const content = await db.content.create({
    data: {
      title,
      type,
      url: uniqueFilename,
      topicId,
    }
  });

  revalidatePath("/admin");
  revalidatePath("/courses/[id]", "page");
  revalidatePath("/learn/[id]", "page");
  return content;
}

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {}

  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = join(uploadDir, uniqueFilename);

  await writeFile(filePath, buffer);

  return `/uploads/${uniqueFilename}`;
}
