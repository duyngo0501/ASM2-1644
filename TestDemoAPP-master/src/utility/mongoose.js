module.exports = {
    multipleMongooseToObject: function(mongooseArrays) {
        return mongooseArrays.map(mongooseArrays => mongooseArrays.toObject());
    },
    moongoseToObject: function(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
}