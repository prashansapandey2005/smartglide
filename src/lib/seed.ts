import { db } from './db';
import { courses } from '../data/courses';

async function main() {
  console.log('Seeding database with mock courses...');

  // First, clear existing data
  await db.topic.deleteMany();
  await db.section.deleteMany();
  await db.course.deleteMany();

  // Insert courses
  for (const mockCourse of courses) {
    const createdCourse = await db.course.create({
      data: {
        title: mockCourse.title,
        description: mockCourse.description,
        longDescription: mockCourse.longDescription || "Detailed description here.",
        price: mockCourse.price,
        originalPrice: mockCourse.originalPrice,
        instructor: mockCourse.instructor,
        tags: JSON.stringify(mockCourse.tags),
        features: JSON.stringify(mockCourse.features),
      }
    });

    // Create a default section and topic for testing video uploads
    const section = await db.section.create({
      data: {
        title: "Course Materials",
        courseId: createdCourse.id,
        order: 0
      }
    });

    await db.topic.create({
      data: {
        title: "Introduction Video",
        sectionId: section.id,
        order: 0,
        // No videoUrl yet, ready for upload
      }
    });

    console.log(`Created course: ${createdCourse.title}`);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
