CREATE TABLE "attendanceSheet" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"teacher" integer
);
--> statement-breakpoint
CREATE TABLE "attendanceStudents" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendance_id" integer NOT NULL,
	"student_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"section" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"age" integer NOT NULL,
	"class_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendanceSheet" ADD CONSTRAINT "attendanceSheet_teacher_users_id_fk" FOREIGN KEY ("teacher") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendanceStudents" ADD CONSTRAINT "attendanceStudents_attendance_id_attendanceSheet_id_fk" FOREIGN KEY ("attendance_id") REFERENCES "public"."attendanceSheet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendanceStudents" ADD CONSTRAINT "attendanceStudents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classes_name_idx" ON "classes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "students_class_idx" ON "students" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "students_user_idx" ON "students" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");