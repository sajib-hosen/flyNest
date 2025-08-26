import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ---------------- USERS ----------------
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').notNull(),
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
