const mongoose = require('mongoose');

const USER = 'duyngo0501';
const PASSWORD = 'duyngo123';
const DB_NAME = 'DuyNgoShop';

async function connect() {
  try {
    await mongoose.connect(
      'mongodb+srv://' +
        USER +
        ':' +
        PASSWORD +
        '@cluster0.cnshd.mongodb.net/' +
        DB_NAME +
        '?retryWrites=true&w=majority'
    );

    console.log('Connect succesfully!!');
  } catch (error) {
    console.log('Connect failure');
  }
}

module.exports = { connect };
