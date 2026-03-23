import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
