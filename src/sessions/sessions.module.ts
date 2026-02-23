import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import {
  ConversationSession,
  ConversationSessionSchema,
} from './schemas/conversation-session.schema';
import {
  ConversationEvent,
  ConversationEventSchema,
} from './schemas/conversation-event.schema';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConversationSession.name, schema: ConversationSessionSchema },
      { name: ConversationEvent.name, schema: ConversationEventSchema },
    ]),
  ],
  providers: [SessionsService, EventsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
