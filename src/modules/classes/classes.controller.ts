import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassInputDto } from './dto/create-class.dto';
import { ClassResponseDto } from './dto/class.response.dto';
import { StudentsResponseDto } from '../students/dto/students.response.dto';
import { Roles } from 'src/decorators/user.roles.decorator';
import { AdminGuard } from 'src/guards/http/admin.guard';
import { AuthGuard } from 'src/guards/http/auth.guard';
import { EnrollStudentInputDto } from './dto/enroll-students.input.dto';
import { Public } from 'src/decorators/is.public';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiBody({ type: CreateClassInputDto })
  @ApiResponse({
    status: 201,
    description: 'Class successfully created',
    type: ClassResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createClass(@Body() createClassDto: CreateClassInputDto) {
    return await this.classesService.createClass(createClassDto);
  }

  @Post('/:id/enroll')
  @Roles('admin', 'teacher')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll a student to a class' })
  @ApiParam({ name: 'id', description: 'Class ID', type: Number, example: 1 })
  @ApiBody({ type: EnrollStudentInputDto })
  @ApiResponse({
    status: 200,
    description: 'Student successfully enrolled',
    type: StudentsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Class or student not found' })
  async enrollStudentToClass(
    @Param('id') classId: string,
    @Body() input: EnrollStudentInputDto,
  ) {
    return await this.classesService.enrollStudentToClass(+classId, input);
  }

  @Public()
  @Get('/:id/students')
  @ApiOperation({ summary: 'Get all students of a class' })
  @ApiParam({ name: 'id', description: 'Class ID', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'List of students in the class',
    type: StudentsResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async findAll(@Param('id') classId: string) {
    return await this.classesService.getStudentsOfClass(+classId);
  }
}
