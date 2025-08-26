import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentInputDto } from './dto/create-student.input.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { students, classes, users } from 'src/drizzle/schema/schema';
import { eq, ilike, or, count } from 'drizzle-orm';
import {
  AllStudentResponse,
  StudentsResponseDto,
} from './dto/students.response.dto';

@Injectable()
export class StudentsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  // ---------------- Create student ----------------
  async createStudents(
    input: CreateStudentInputDto,
  ): Promise<StudentsResponseDto> {
    const [newStudent] = await this.db
      .insert(students)
      .values({
        name: input.name,
        age: input.age,
      })
      .returning();

    return newStudent;
  }

  // ---------------- Get all students ----------------
  async getAllStudents(
    pageNo = 1,
    perPage = 10,
    search?: string,
  ): Promise<AllStudentResponse> {
    pageNo = pageNo < 1 ? 1 : pageNo;
    perPage = perPage < 1 ? 1 : perPage;
    const skipTotal = (pageNo - 1) * perPage;

    const where = search
      ? or(
          ilike(students.name, `%${search}%`),
          ilike(classes.name, `%${search}%`),
          ilike(users.name, `%${search}%`),
        )
      : undefined;

    const data = await this.db
      .select({
        id: students.id,
        name: students.name,
        age: students.age,
        class: classes.name,
        section: classes.section,
        userName: users.name,
        userEmail: users.email,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(where ?? undefined)
      .limit(perPage)
      .offset(skipTotal);

    const totalCount = await this.db
      .select({ count: count(students.id) })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(where ?? undefined);

    return {
      pageNo,
      perPage,
      total: Number(totalCount[0]?.count ?? 0),
      data,
    };
  }

  // ---------------- Get student by ID ----------------
  async getStudentById(id: number): Promise<StudentsResponseDto> {
    const [student] = await this.db
      .select({
        id: students.id,
        name: students.name,
        age: students.age,
        class: classes.name,
        section: classes.section,
        userName: users.name,
        userEmail: users.email,
      })
      .from(students)
      .leftJoin(classes, eq(students.classId, classes.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(students.id, id));

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }
}
