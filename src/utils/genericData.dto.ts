import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenericPaginationDto {
  @ApiProperty({
    description: 'No. of items in a page',
    example: 20,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Page number (starting from 1)',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  page: number;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Flag to retrieve all results without pagination',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  retrieveAll?: boolean;
}
