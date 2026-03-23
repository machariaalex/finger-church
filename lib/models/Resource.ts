import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'article' | 'video' | 'other';
  category: string;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'article', 'video', 'other'], default: 'pdf' },
  category: { type: String, default: 'Bible Study' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
