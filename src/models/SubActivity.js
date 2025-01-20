import mongoose from 'mongoose';
import './Activity.js'

const SubActivitySchema = new mongoose.Schema({
    id_SubAct: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    SUBACT_name: {
      type: String,
      required: true,
      trim: true,
    },
    id_Act: {
      type: String,
      required: true,
      trim: true,
      ref: 'Activity',
    },
  }, {
    timestamps: true,
  });

 
  const SubActivity = mongoose.models.SubActivity || mongoose.model('SubActivity', SubActivitySchema);
  export default SubActivity;