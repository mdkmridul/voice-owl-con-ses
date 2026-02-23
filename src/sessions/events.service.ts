import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
  ConversationEvent,
  ConversationEventType,
} from './schemas/conversation-event.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventPayloadDto } from './dto/createEventPayload.dto';
import { SessionsService } from './sessions.service';
import { ConversationSessionStatus } from './schemas/conversation-session.schema';
import { GenericPaginationDto } from 'src/utils/genericData.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(ConversationEvent.name)
    private eventModel: Model<ConversationEvent>,
    private readonly sessionsService: SessionsService,
  ) {}

  async CreateEvent(sessionId: string, eventData: CreateEventPayloadDto) {
    try {
      const session = await this.sessionsService.fetchSessionById(sessionId);

      if (!session) {
        throw new NotFoundException(`Session ${sessionId} not found`);
      }

      if (
        [
          ConversationSessionStatus.COMPLETED,
          ConversationSessionStatus.FAILED,
        ].includes(session.status) &&
        eventData.type !== ConversationEventType.SYSTEM
      ) {
        throw new NotFoundException(
          `Cannot create event for session ${sessionId} with status ${session.status}`,
        );
      }

      this.logger.debug(
        `Creating event FOR SESSION ID: ${sessionId}, type: ${eventData.type}`,
      );

      const record = await this.eventModel.create({
        eventId: uuidv4(),
        session: session._id,
        sessionId,
        type: eventData.type,
        payload: eventData.payload ?? {},
        timestamp: new Date(),
      });

      return {
        data: record,
        message: `Event created successfully.`,
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Error creating event FOR SESSION ID: ${sessionId}, type: ${eventData.type}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async GetEvents(sessionId: string, payload: GenericPaginationDto) {
    this.logger.debug(`Retrieving session with ID: ${sessionId}`);

    try {
      let { limit, page, sortBy } = payload;
      console.log(typeof page, typeof limit);

      const { sortOrder, retrieveAll } = payload;

      limit = retrieveAll ? 0 : limit; // if retrieveAll is true, ignore limit and return all
      page = page || 1;
      sortBy = sortBy || 'timestamp';
      const order = sortOrder === 'asc' ? 1 : -1;

      const session = await this.sessionsService.fetchSessionById(sessionId);

      if (!session) {
        return {
          data: null,
          message: `Session with ID ${sessionId} not found.`,
          success: false,
        };
      }

      const totalEvents = await this.eventModel.countDocuments({ sessionId });

      const events = await this.eventModel
        .find({ sessionId })
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = limit ? Math.ceil(totalEvents / limit) : 1;

      return {
        data: {
          session,
          events,
          totalEvents,
          totalPages,
          currentPage: page,
        },
        message: `Session retrieved successfully.`,
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving session with ID: ${sessionId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
