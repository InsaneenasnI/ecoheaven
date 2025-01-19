const mongoose = require('mongoose');

const carbonFootprintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    housing: {
        energyConsumption: {
            type: Number, // kWh za měsíc
            required: true
        },
        heatingType: {
            type: String,
            enum: ['plyn', 'elektřina', 'dálkové-vytápění', 'biomasa'],
            required: true
        },
        householdSize: {
            type: Number,
            required: true
        }
    },
    transportation: {
        carKilometers: {
            type: Number,
            default: 0
        },
        publicTransportKilometers: {
            type: Number,
            default: 0
        },
        bikeKilometers: {
            type: Number,
            default: 0
        }
    },
    diet: {
        type: String,
        enum: ['masitá', 'vegetariánská', 'veganská'],
        required: true
    },
    waste: {
        recycling: {
            type: Boolean,
            default: false
        },
        compost: {
            type: Boolean,
            default: false
        },
        wasteProduction: {
            type: Number, // kg za měsíc
            required: true
        }
    },
    totalFootprint: {
        type: Number, // kg CO2 za měsíc
        required: true
    }
});

// Metoda pro výpočet celkové uhlíkové stopy
carbonFootprintSchema.methods.calculateTotalFootprint = function () {
    let total = 0;

    // Výpočet pro bydlení
    const energyFootprint = this.housing.energyConsumption * 0.5; // 0.5 kg CO2 per kWh
    total += energyFootprint / this.housing.householdSize;

    // Výpočet pro dopravu
    total += this.transportation.carKilometers * 0.2; // 0.2 kg CO2 per km
    total += this.transportation.publicTransportKilometers * 0.05; // 0.05 kg CO2 per km

    // Výpočet pro stravu
    const dietFactors = {
        'masitá': 100,
        'vegetariánská': 50,
        'veganská': 30
    };
    total += dietFactors[this.diet];

    // Výpočet pro odpad
    total += this.waste.wasteProduction * 2; // 2 kg CO2 per kg odpadu
    if (this.waste.recycling) total -= 20;
    if (this.waste.compost) total -= 10;

    this.totalFootprint = total;
    return total;
};

module.exports = mongoose.model('CarbonFootprint', carbonFootprintSchema); 