import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSessionPayloadDto } from './dto/createSessionPayload.dto';
import { SessionsService } from './sessions.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventPayloadDto } from './dto/createEventPayload.dto';
import { GenericPaginationDto } from 'src/utils/genericData.dto';

@Controller('sessions')
@ApiTags('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create or upsert a conversation session' })
  @ApiCreatedResponse({
    description: 'Session created or already existed',
  })
  async createSession(@Body() payload: CreateSessionPayloadDto) {
    const { sessionId } = payload;
    return this.sessionsService.CreateSession(sessionId, payload);
  }

  @Get(':sessionId')
  @ApiOperation({
    summary: 'Get a conversation session (with events populated)',
  })
  @ApiOkResponse({ description: 'Session retrieved' })
  async getSession(
    @Param('sessionId') sessionId: string,
    @Query() payload: GenericPaginationDto,
  ) {
    return this.eventsService.GetEvents(sessionId, payload);
  }

  @Post(':sessionId/events')
  @ApiOperation({ summary: 'Add an event to a conversation session' })
  @ApiCreatedResponse({ description: 'Event added to session' })
  async addEventToSession(
    @Param('sessionId') sessionId: string,
    @Body() eventData: CreateEventPayloadDto,
  ) {
    return this.eventsService.CreateEvent(sessionId, eventData);
  }

  @Post(':sessionId/complete')
  @ApiOperation({ summary: 'Mark a conversation session as complete' })
  @ApiCreatedResponse({ description: 'Session marked as complete' })
  async completeSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.closeSession(sessionId);
  }
}
