DROP INDEX "idIndex";--> statement-breakpoint
CREATE INDEX "classes_name_idx" ON "classes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "students_class_idx" ON "students" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "students_user_idx" ON "students" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");