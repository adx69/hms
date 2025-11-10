import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  amount: {
    type: Number,
    required: true,
  },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    },
  ],
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partial'],
    default: 'Pending',
  },
  paymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema);



