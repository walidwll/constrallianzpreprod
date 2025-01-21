import mongoose from 'mongoose';
import './Activity.js'
import './SubActivity.js'

const subCompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  CIFNumber:{
    type: String,
    required: [true, 'Please enter the CIF of company '],
  },
  speciality: {
		type: String,
		enum: ['employee', 'material', 'machinery'],
		required: [true, 'Please select the company speciality'],
	},
  activity: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'activity',
    required: false 
  },  
  subActivities: [{
    type: String
   }], 
  
  subContractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubContractor',
  },
  employeesId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  machineryId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machinery',
  }],
  documents: {
    ownershipCertificate: {
      type: String,
      required: [true, 'Ownership certificate is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Ownership certificate URL cannot be empty'
      }
    },
    agreement: {
      type: String,
      required: [true, 'Agreement certificate is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Agreement certificate URL cannot be empty'
      }
    },

    obraliaRegistration: {
      type: String,
    },
    privacyDocument: {
      type: String,
      required: [true, 'Privacy document is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Privacy document URL cannot be empty'
      }
    },
    platformRegulation: {
      type: String,
      required: [true, 'Platform regulation document is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Platform regulation URL cannot be empty'
      }
    }
  },
  address: {
    addressligne1: { type: String, required: [true, 'Please enter the address ligne 1'] },
    addressComplementaire: { type: String,  default:""  },
    city: { type: String, required: [true, 'Please enter the city'] },
    postalCode: { type: String, required: [true, 'Please enter the postal Code'] },
    country: { type: String, required: [true, 'Please enter the country'] },
  },
  disponibility: {
    type: String, 
    enum: ['international', 'national', 'regional'],
    required: [true, 'Please specify the disponibility'],
  },
  regions: {
      type: [String],  // Only relevant if 'disponibility' is 'regional'
      enum: [
          'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
          'Canary Islands', 'Cantabria', 'Castile and Leon', 'Castile-La Mancha',
          'Catalonia', 'Extremadura', 'Galicia', 'Madrid', 'Murcia', 'Navarre',
          'La Rioja', 'Valencian Community'
      ],
      validate: {
          validator: function(value) {
              // If disponibility is regional, validate that regions are selected
              if (this.disponibility === 'regional') {
                  return value.length > 0; // At least one region must be selected
              }
              // If 'international' or 'national', no regions are needed
              return true;
          },
          message: 'Please select at least one region if you choose regional disponibility.',
      },
  },
  }, { timestamps: true });

// Add virtual fields for document URLs
subCompanySchema.virtual('documentUrls').get(function () {
  return {
    ownershipCertificate: this.documents?.ownershipCertificate || '',
    agreement: this.documents?.agreement || '',
    obraliaRegistration: this.documents?.obraliaRegistration || '',
    privacyDocument: this.documents?.privacyDocument || '',
    platformRegulation: this.documents?.platformRegulation || '',
  };
});

subCompanySchema.set('toJSON', { virtuals: true });
subCompanySchema.set('toObject', { virtuals: true });

const SubCompany = mongoose.models.SubCompany || mongoose.model('SubCompany', subCompanySchema);
export default SubCompany;