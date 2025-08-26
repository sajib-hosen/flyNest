import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateClassInputDto {
  @ApiProperty({
    description: 'Name of the class',
    example: 'Class 10',
  })
  @IsNotEmpty({ message: 'Class name is required' })
  name: string;

  @ApiProperty({
    description: 'Section of the class',
    example: 'A',
  })
  @IsNotEmpty({ message: 'Section is required' })
  section: string;
}
