import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  index,
  pgEnum as drizzlePgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

// 👇 Wrapper to fix ESLint "any" issue
const pgEnum = <T extends readonly [string, ...string[]]>(
  name: string,
  values: T,
) => drizzlePgEnum(name, values);

export const roleEnum = pgEnum('role', [
  UserRole.ADMIN,
  UserRole.USER,
  UserRole.MODERATOR,
] as const);

// ---------------- USERS ----------------
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').notNull().default(UserRole.USER),
  },
  (t) => ({
    emailIndex: index('users_email_idx').on(t.email),
  }),
);

// ---------------- CLASSES ----------------
export const classes = pgTable(
  'classes',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    section: varchar('section', { length: 10 }).notNull(),
  },
  (t) => ({
    nameIndex: index('classes_name_idx').on(t.name),
  }),
);

// ---------------- STUDENTS ----------------
export const students = pgTable(
  'students',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    age: integer('age').notNull(),
    classId: integer('class_id').references(() => classes.id),
    userId: integer('user_id').references(() => users.id),
  },
  (t) => ({
    classIndex: index('students_class_idx').on(t.classId),
    userIndex: index('students_user_idx').on(t.userId),
  }),
);

export const attendanceSheet = pgTable('attendanceSheet', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  teacher: integer('teacher').references(() => users.id),
});

export const attendanceStudents = pgTable('attendanceStudents', {
  id: serial('id').primaryKey(),
  attendanceId: integer('attendance_id')
    .references(() => attendanceSheet.id)
    .notNull(),
  studentId: integer('student_id')
    .references(() => students.id)
    .notNull(),
});

// ---------------- RELATIONS ----------------
export const usersRelations = relations(users, ({ one }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one }) => ({
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
}));
