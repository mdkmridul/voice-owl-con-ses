/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ConversationSessionStatus } from '../schemas/conversation-session.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionPayloadDto {
  @ApiProperty({
    description: 'Client-provided unique session identifier',
    example: 'session-12345',
  })
  @IsString()
  sessionId: string;

  @ApiPropertyOptional({
    description: 'Lifecycle status of the session',
    enum: ConversationSessionStatus,
    example: ConversationSessionStatus.INITIATED,
  })
  @IsOptional()
  @IsEnum(ConversationSessionStatus)
  status?: ConversationSessionStatus;

  @ApiPropertyOptional({
    description: 'Language code (BCP-47)',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Free-form metadata to persist with the session',
    example: { channel: 'web', campaign: 'spring' },
    type: Object,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
