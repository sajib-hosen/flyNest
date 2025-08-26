import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnrollStudentInputDto {
  @ApiProperty({
    description: 'The ID of the student to enroll',
    example: '58',
  })
  @IsNotEmpty()
  studentId: string;
}
