// conversation-event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ConversationEventType {
  USER_SPEECH = 'user_speech',
  BOT_SPEECH = 'bot_speech',
  SYSTEM = 'system',
}

export type ConversationEventDocument = HydratedDocument<ConversationEvent>;

@Schema({
  collection: 'conversation_events',
  versionKey: false,
  timestamps: true,
})
export class ConversationEvent {
  @Prop({ type: String, required: true, index: true })
  eventId!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ConversationSession',
    required: true,
  })
  session!: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  sessionId!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ConversationEventType),
    index: true,
  })
  type!: ConversationEventType;

  @Prop({ type: Object, required: true })
  payload!: Record<string, any>;

  @Prop({ type: Date, required: true, index: true })
  timestamp!: Date;
}

export const ConversationEventSchema =
  SchemaFactory.createForClass(ConversationEvent);
ConversationEventSchema.index({ session: 1, eventId: 1 }, { unique: true });
