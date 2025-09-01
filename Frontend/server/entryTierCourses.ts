import { db } from "./db";
import { courses, lessons } from "@shared/schema";
import { eq } from "drizzle-orm";
import { realCourseContent } from './realCourseContent';

// Entry Tier Course Data - Based on attached PDFs
export async function seedEntryTierCourses() {
  try {
    console.log('Seeding Entry Tier courses...');

    // Clear existing Entry tier courses to update with real content
    const existingEntryCourses = await db.select().from(courses)
      .where(eq(courses.accessTier, "beginner"));
    
    if (existingEntryCourses.length > 0) {
      console.log('Updating Entry tier courses with real PDF content...');
      // Delete existing lessons first
      for (const course of existingEntryCourses) {
        await db.delete(lessons).where(eq(lessons.courseId, course.id));
      }
      // Delete existing courses
      await db.delete(courses).where(eq(courses.accessTier, "beginner"));
    }

    // Create all Entry tier courses with real content
    for (const [courseTitle, courseData] of Object.entries(realCourseContent)) {
      // Insert course
      const course = await db.insert(courses).values({
        title: courseTitle,
        description: courseData.description,
        track: "business",
        level: 1,
        accessTier: "beginner",
        isPublished: true
      }).returning();

      const courseId = course[0].id;

      // Insert lessons for this course
      if (courseData.lessons && courseData.lessons.length > 0) {
        await db.insert(lessons).values(
          courseData.lessons.map((lesson, index) => ({
            courseId,
            title: lesson.title,
            description: lesson.description,
            sharedContent: lesson.sharedContent,
            architectContent: lesson.architectContent,
            alchemistContent: lesson.alchemistContent,
            requiredTier: "beginner",
            order: index + 1,
            isPublished: true
          }))
        );
      }
    }

    console.log('✓ Entry tier courses successfully seeded with real PDF content');
  } catch (error) {
    console.error('Error seeding Entry tier courses:', error);
  }
}