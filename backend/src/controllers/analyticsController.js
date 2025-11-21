const BusRide = require('../models/BusRide');

// Get overview analytics
exports.getOverview = async (req, res) => {
    try {
        // Get all rides
        const rides = await BusRide.find();

        // Total Ridership
        const totalRidership = rides.length;

        // Avg Per Route - Calculate unique routes and average
        const routesSet = new Set(rides.map(ride => ride.route));
        const uniqueRoutes = Array.from(routesSet);
        const avgPerRoute = uniqueRoutes.length > 0 ? Math.round(totalRidership / uniqueRoutes.length) : 0;

        // Peak Hour - Find hour with most ridership
        const hourlyRidership = {};
        rides.forEach(ride => {
            const hour = new Date(ride.timestamp).getHours();
            hourlyRidership[hour] = (hourlyRidership[hour] || 0) + 1;
        });

        let peakHour = '0:00';
        let maxRidership = 0;
        for (const [hour, count] of Object.entries(hourlyRidership)) {
            if (count > maxRidership) {
                maxRidership = count;
                peakHour = `${hour}:00`;
            }
        }

        // Top Route
        const routeCounts = {};
        rides.forEach(ride => {
            routeCounts[ride.route] = (routeCounts[ride.route] || 0) + 1;
        });
        const topRoute = Object.keys(routeCounts).reduce((a, b) =>
            routeCounts[a] > routeCounts[b] ? a : b, 'N/A'
        );

        // Evasion Rate - Calculate no fare percentage
        const noFareCount = rides.filter(ride => ride.paymentMethod === 'No Fare').length;
        const evasionRate = totalRidership > 0 ? ((noFareCount / totalRidership) * 100).toFixed(1) : 0;

        // TSP Efficiency (placeholder for now)
        const tspEfficiency = 87.5;

        // Hourly Trend Data
        const hourlyTrend = Object.keys(hourlyRidership)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(hour => ({
                hour: `${hour}:00`,
                ridership: hourlyRidership[hour]
            }));

        // Payment Methods
        const paymentMethods = {
            OMNY: 0,
            MetroCard: 0,
            'No Fare': 0
        };
        rides.forEach(ride => {
            paymentMethods[ride.paymentMethod]++;
        });

        const paymentPercentages = {
            OMNY: totalRidership > 0 ? Math.round((paymentMethods.OMNY / totalRidership) * 100) : 0,
            MetroCard: totalRidership > 0 ? Math.round((paymentMethods.MetroCard / totalRidership) * 100) : 0,
            'No Fare': totalRidership > 0 ? Math.round((paymentMethods['No Fare'] / totalRidership) * 100) : 0
        };

        res.json({
            kpis: {
                totalRidership,
                avgPerRoute,
                peakHour,
                topRoute,
                evasionRate: `${evasionRate}%`,
                tspEfficiency: `${tspEfficiency}%`
            },
            hourlyTrend,
            paymentMethods: paymentPercentages
        });

    } catch (error) {
        console.error('Error fetching overview:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};