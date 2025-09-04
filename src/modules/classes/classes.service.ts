import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassInputDto } from './dto/create-class.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { and, eq } from 'drizzle-orm';
import {
  attendanceSheet,
  attendanceStudents,
  classes,
  students,
} from 'src/drizzle/schema/schema';
import { EnrollStudentInputDto } from './dto/enroll-students.input.dto';
import * as dayjs from 'dayjs';

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

  async attendStudent(studentId: number) {
    const today = dayjs().format('YYYY-MM-DD');

    // 1. check if today's attendance sheet exists
    let [attendance] = await this.db
      .select()
      .from(attendanceSheet)
      .where(eq(attendanceSheet.date, today));

    if (!attendance) {
      // create new attendance sheet for today
      const [newAttendance] = await this.db
        .insert(attendanceSheet)
        .values({
          date: today,
          teacher: 1,
        })
        .returning();

      attendance = newAttendance;
    }

    // 2. check if this student is already marked
    const [existing] = await this.db
      .select()
      .from(attendanceStudents)
      .where(
        and(
          eq(attendanceStudents.attendanceId, attendance.id),
          eq(attendanceStudents.studentId, studentId),
        ),
      );

    if (!existing) {
      // insert relation (student attended today)
      await this.db.insert(attendanceStudents).values({
        attendanceId: attendance.id,
        studentId,
      });
    }

    // 3. return all students for today
    const students = await this.db
      .select({
        id: attendanceStudents.studentId,
      })
      .from(attendanceStudents)
      .where(eq(attendanceStudents.attendanceId, attendance.id));

    return students.map((s) => s.id);
  }

  async getAttendanceByDate(date: string) {
    if (!date) throw new BadRequestException('date is required');

    // 1. find the attendance sheet for the date
    const [attendance] = await this.db
      .select()
      .from(attendanceSheet)
      .where(eq(attendanceSheet.date, date));

    if (!attendance) return null;

    // 2. get all students for this attendance sheet
    const attendedStudents = await this.db
      .select({
        id: students.id,
        name: students.name,
        classId: students.classId,
      })
      .from(attendanceStudents)
      .innerJoin(students, eq(attendanceStudents.studentId, students.id))
      .where(eq(attendanceStudents.attendanceId, attendance.id));

    // 3. return structured result
    return {
      attendanceId: attendance.id,
      date: attendance.date,
      teacher: attendance.teacher,
      students: attendedStudents,
    };
  }
}
