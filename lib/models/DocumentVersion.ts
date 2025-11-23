import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IDocumentVersion extends MongoDocument {
  roomId: string;
  title: string;
  content: string;
  version: number;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  changeDescription?: string;
  createdAt: Date;
  contentHash: string; // For detecting actual content changes
}

const DocumentVersionSchema = new Schema<IDocumentVersion>({
  roomId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorName: {
    type: String
  },
  authorAvatar: {
    type: String
  },
  changeDescription: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  contentHash: {
    type: String,
    required: true
  }
});

// Compound index for efficient queries
DocumentVersionSchema.index({ roomId: 1, version: -1 });
DocumentVersionSchema.index({ roomId: 1, createdAt: -1 });

export const DocumentVersion = mongoose.models.DocumentVersion || 
  mongoose.model<IDocumentVersion>('DocumentVersion', DocumentVersionSchema);
