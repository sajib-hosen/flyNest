import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentInputDto } from './dto/create-student.input.dto';
import {
  AllStudentResponse,
  StudentsResponseDto,
} from './dto/students.response.dto';
import { Roles } from 'src/decorators/user.roles.decorator';
import { AuthGuard } from 'src/guards/http/auth.guard';
import { AdminGuard } from 'src/guards/http/admin.guard';
import { Public } from 'src/decorators/is.public';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles('admin', 'admin')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentInputDto })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Student successfully created',
    type: StudentsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(
    @Body() createStudentDto: CreateStudentInputDto,
  ): Promise<StudentsResponseDto> {
    return await this.studentsService.createStudents(createStudentDto);
  }

  @Get()
  @Roles('admin', 'teacher')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all students with optional search and pagination',
  })
  @ApiQuery({ name: 'pageNo', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Jane' })
  @ApiResponse({
    status: 200,
    description: 'List of students',
    type: AllStudentResponse,
    isArray: true,
  })
  async findAll(
    @Query('pageNo') pageNo?: number,
    @Query('perPage') perPage?: number,
    @Query('search') search?: string,
  ): Promise<AllStudentResponse> {
    return await this.studentsService.getAllStudents(pageNo, perPage, search);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a student by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Student found',
    type: StudentsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async findOne(@Param('id') id: string): Promise<StudentsResponseDto> {
    return await this.studentsService.getStudentById(+id);
  }
}
