import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassInputDto } from './dto/create-class.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import { classes, students } from 'src/drizzle/schema/schema';
import { EnrollStudentInputDto } from './dto/enroll-students.input.dto';

@Injectable()
export class ClassesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  // -------------------- Create a new class --------------------
  async createClass(input: CreateClassInputDto) {
    const [newClass] = await this.db
      .insert(classes)
      .values({
        name: input.name,
        section: input.section,
      })
      .returning();

    return newClass;
  }

  // -------------------- Enroll a student to a class --------------------
  async enrollStudentToClass(classId: number, input: EnrollStudentInputDto) {
    const studentIdNum = Number(input.studentId);
    const [student] = await this.db
      .select()
      .from(students)
      .where(eq(students.id, studentIdNum));

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${input.studentId} not found`,
      );
    }

    // Update student's classId
    const [updatedStudent] = await this.db
      .update(students)
      .set({ classId })
      .where(eq(students.id, studentIdNum))
      .returning();

    return updatedStudent;
  }

  // -------------------- Get all students of a class --------------------
  async getStudentsOfClass(classId: number) {
    const studentsOfClass = await this.db
      .select()
      .from(students)
      .where(eq(students.classId, classId));

    return studentsOfClass;
  }
}
