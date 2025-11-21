const mongoose = require('mongoose');

const busRideSchema = new mongoose.Schema({
    route: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    ridership: {
        type: Number,
        default: 1
    },
    paymentMethod: {
        type: String,
        enum: ['OMNY', 'MetroCard', 'No Fare'],
        required: true
    },
    latitude: Number,
    longitude: Number,
    vehicleId: String
}, {
    timestamps: true
});

module.exports = mongoose.model('BusRide', busRideSchema);