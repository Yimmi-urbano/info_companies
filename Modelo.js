const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  nameCompany: {
    type: String,
    required: true,
  },
  domain: String,
  typeCompany: String,
  typeService: String,
  categoryCompany: String,
  country: String,
  emailPrimary: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    default: function () {
      const userId = this.userId || '';
      const country = this.country || '';
      const date = Date.now();
      const cleanedUserId = userId.replace(/[^\w]/g, '');
      const cleanedCountry = country.replace(/[^\w]/g, '');
      const userIdPrefix = cleanedUserId.slice(0, 2).toUpperCase();
      const generatedStoreId = `${userIdPrefix}${cleanedCountry}${date}`;
      return generatedStoreId;
    },
  },
  configContact: {
    name: String,
    email: String,
    phoneCell: String,
    addressComercial: String,
    socialNet: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
      tiktok: String,
    },
  },
  currency: {
    symbol: String,
    currency: String
  },
  appearance: {
    logo: String,
    banner: String,
    theme: String,
    colors: {
      primary: String,
      secondary: String,
      third: String,
    },
  }
});

module.exports = mongoose.model('companies', collectionSchema);
