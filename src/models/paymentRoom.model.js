import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userIdTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zoom', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  statusTeacher: { type: String, enum: ['unpaid', 'pending', 'completed', 'failed'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', PaymentSchema);
export { Payment };
