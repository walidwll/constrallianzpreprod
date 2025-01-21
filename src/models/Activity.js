import mongoose from 'mongoose';


// Activity Schema
const ActivitySchema = new mongoose.Schema({
    id_Act: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Act_name: {
      type: String,
      required: true,
      trim: true,
    },
  }, {
    timestamps: true,
  });

  const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
  export default Activity;