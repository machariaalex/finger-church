import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  image?: string;
  category: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date },
  location: { type: String, required: true },
  image: { type: String },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
