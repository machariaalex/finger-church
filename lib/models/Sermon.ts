import mongoose, { Schema, Document } from 'mongoose';

export interface ISermon extends Document {
  title: string;
  speaker: string;
  date: Date;
  topic: string;
  type: 'video' | 'audio' | 'written';
  url: string;
  description: string;
  thumbnail?: string;
  createdAt: Date;
}

const SermonSchema = new Schema<ISermon>({
  title: { type: String, required: true },
  speaker: { type: String, required: true },
  date: { type: Date, required: true },
  topic: { type: String, required: true },
  type: { type: String, enum: ['video', 'audio', 'written'], required: true },
  url: { type: String, required: true },
  description: { type: String },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Sermon || mongoose.model<ISermon>('Sermon', SermonSchema);
