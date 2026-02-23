import { Injectable, Logger } from '@nestjs/common';

import { CreateSessionPayloadDto } from './dto/createSessionPayload.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ConversationSession,
  ConversationSessionStatus,
} from './schemas/conversation-session.schema';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @InjectModel(ConversationSession.name)
    private sessionModel: Model<ConversationSession>,
  ) {}

  async CreateSession(sessionId: string, payload: CreateSessionPayloadDto) {
    const { language, metadata, status } = payload;
    this.logger.debug(
      `Creating session with ID: ${sessionId}, language: ${language}`,
    );

    const createData = {
      sessionId,
      language,
      metadata,
      status: status || ConversationSessionStatus.INITIATED,
      startedAt: new Date(),
    };

    try {
      const record = await this.sessionModel.findOneAndUpdate(
        { sessionId },
        { $setOnInsert: createData },
        { upsert: true, new: true },
      );

      return {
        data: record,
        message: `Session created successfully.`,
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Error creating session with ID: ${createData.sessionId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async closeSession(sessionId: string) {
    this.logger.debug(`Closing session with ID: ${sessionId}`);

    try {
      const record = await this.sessionModel.findOneAndUpdate(
        {
          sessionId,
          status: { $ne: ConversationSessionStatus.COMPLETED }, // don’t re-apply if already same
        },
        {
          status: ConversationSessionStatus.COMPLETED,
          endedAt: new Date(),
        },
        { new: true },
      );

      if (!record) {
        return {
          data: null,
          message: `Session with ID ${sessionId} not found.`,
          success: false,
        };
      }

      return {
        data: record,
        message: `Session closed successfully.`,
        success: true,
      };
    } catch (error) {
      this.logger.error(
        `Error closing session with ID: ${sessionId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  async fetchSessionById(sessionId: string) {
    this.logger.debug(`Fetching session with ID: ${sessionId}`);

    try {
      return await this.sessionModel.findOne({ sessionId });
    } catch (error) {
      this.logger.error(
        `Error fetching session with ID: ${sessionId}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
