import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ConversationSessionDocument = HydratedDocument<ConversationSession>;

export enum ConversationSessionStatus {
  INITIATED = 'initiated',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Schema({
  collection: 'conversation_sessions',
  versionKey: false,
  timestamps: true,
})
export class ConversationSession {
  @Prop({ type: String, required: true, unique: true, index: true })
  sessionId!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ConversationSessionStatus),
    index: true,
  })
  status!: ConversationSessionStatus;

  @Prop({ type: String, required: true })
  language!: string; // e.g. "en", "fr"

  @Prop({ type: Date, required: true })
  startedAt!: Date;

  @Prop({ type: Date, default: null })
  endedAt!: Date | null;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: false })
  metadata?: Record<string, any>;
}

export const ConversationSessionSchema =
  SchemaFactory.createForClass(ConversationSession);

// Virtual relation to conversation events via sessionId (string)
ConversationSessionSchema.virtual('events', {
  ref: 'ConversationEvent',
  localField: 'sessionId',
  foreignField: 'sessionId',
});

// Ensure virtuals appear when converting to JSON/Object
ConversationSessionSchema.set('toJSON', { virtuals: true });
ConversationSessionSchema.set('toObject', { virtuals: true });

// Optional helpful compound index (status queries by time)
ConversationSessionSchema.index({ status: 1, startedAt: -1 });
