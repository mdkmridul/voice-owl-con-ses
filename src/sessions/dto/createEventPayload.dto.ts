import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConversationEventType } from '../schemas/conversation-event.schema';

export class CreateEventPayloadDto {
  @ApiProperty({
    description: 'Type of event',
    enum: ConversationEventType,
    example: ConversationEventType.USER_SPEECH,
  })
  @IsEnum(ConversationEventType)
  type: ConversationEventType;

  @ApiPropertyOptional({
    description: 'Language code (BCP-47)',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Event payload (shape depends on type)',
    example: { text: 'Hello there' },
    type: Object,
  })
  @IsOptional()
  payload?: Record<string, any>;
}
