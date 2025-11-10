import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);



