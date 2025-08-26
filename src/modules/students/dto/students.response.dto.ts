import { ApiProperty } from '@nestjs/swagger';

export class StudentsResponseDto {
  @ApiProperty({
    description: 'Unique ID of the student',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the student',
    example: 'Jane Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Age of the student',
    example: 15,
  })
  age: number;

  @ApiProperty({
    description: 'Optional class ID the student belongs to',
    example: 3,
    required: false,
  })
  classId?: number; // changed from class_id to classId
}

export class AllStudentResponse {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  pageNo: number;

  @ApiProperty({
    description: 'Number of students per page',
    example: 10,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total number of students',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Array of student data',
    type: StudentsResponseDto,
    isArray: true,
  })
  data: StudentsResponseDto[];
}
