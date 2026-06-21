import mongoose, { Schema, Document } from 'mongoose';

export interface IAgent extends Document {
  name: string;
  phone: string;
  email?: string;
  agentCode: string;
  password?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  status: 'pending' | 'approved' | 'rejected';
  firebaseUid?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    agentCode: { type: String, unique: true, sparse: true },
    password: { type: String },
    mustChangePassword: { type: Boolean, default: true },
    isActive: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    firebaseUid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
