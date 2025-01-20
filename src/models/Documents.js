import mongoose from 'mongoose';

const documentsSchema = new mongoose.Schema({
	agreement: {
		type: String,
		required: [true, 'Agreement document is required'],
	},
	privacyDocument: {
		type: String,
		required: [true, 'Privacy document is required'],
	},
	platformRegulation: {
		type: String,
		required: [true, 'Platform regulation document is required'],
	}
}, {
	timestamps: true,
	indexes: [{ unique: true, sparse: true, fields: ['agreement', 'privacyDocument', 'platformRegulation'] }]
});

const Documents = mongoose.models.Documents || mongoose.model('Documents', documentsSchema);
export default Documents;