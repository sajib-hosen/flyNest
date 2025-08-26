import { ApiProperty } from '@nestjs/swagger';

export class ClassResponseDto {
  @ApiProperty({
    description: 'Unique ID of the class',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the class',
    example: 'Class 10',
  })
  name: string;

  @ApiProperty({
    description: 'Section of the class',
    example: 'A',
  })
  section: string;
}
