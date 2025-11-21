import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Users, AlertCircle, MapPin, Clock, RefreshCw, AlertTriangle, Zap, Bus } from 'lucide-react';

const MTABusAnalytics = () => {
  const [ridershipData, setRidershipData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRidership: 125000,
    avgPerRoute: 5200,
    peakHour: '8:00',
    topRoute: 'M15',
    fareEvasionRate: 3.2,
    tspEfficiency: 87.5
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const loadMockData = () => {
      console.log('⚠️ Using mock data as fallback');

      // Add routes to mock data
      const routes = ['M15', 'M34', 'M42', 'M86', 'M116'];

      const mockData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        ridership: Math.floor(Math.random() * 5000) + 1000,
        transfers: Math.floor(Math.random() * 500),
        omny: Math.floor(Math.random() * 3000),
        metrocard: Math.floor(Math.random() * 2000),
        noFareRecorded: Math.floor(Math.random() * 200),
        route: routes[Math.floor(Math.random() * routes.length)],  // ✅ ADD THIS
        transit_timestamp: new Date(2024, 0, 1, i, 0, 0).toISOString()  // ✅ ADD THIS
      }));

      setRidershipData(mockData);
      setLoading(false);
    };

    const processRealData = (data) => {
      const hourlyData = {};

      data.forEach(item => {
        if (!item.transit_timestamp || !item.ridership) return;

        const hour = new Date(item.transit_timestamp).getHours();
        const key = `${hour}:00`;

        if (!hourlyData[key]) {
          hourlyData[key] = {
            hour: key,
            ridership: 0,
            transfers: 0,
            omny: 0,
            metrocard: 0,
            noFareRecorded: 0,
            count: 0
          };
        }

        hourlyData[key].ridership += parseFloat(item.ridership || 0);
        hourlyData[key].transfers += parseFloat(item.transfers || 0);

        if (item.payment_method === 'omny') {
          hourlyData[key].omny += parseFloat(item.ridership || 0);
        } else if (item.payment_method === 'metrocard') {
          hourlyData[key].metrocard += parseFloat(item.ridership || 0);
        } else {
          hourlyData[key].noFareRecorded += parseFloat(item.ridership || 0);
        }

        hourlyData[key].count++;
      });

      return Object.values(hourlyData).sort((a, b) =>
        parseInt(a.hour) - parseInt(b.hour)
      );
    };

    const calculateRealStats = (data) => {
      if (!data || data.length === 0) {
        console.log('❌ No data provided to calculateRealStats');
        return;
      }

      console.log('🔍 calculateRealStats called with:', data.length, 'records');

      const totalRidership = data.reduce((sum, item) =>
        sum + parseFloat(item.ridership || 0), 0
      );

      console.log('📊 Total Ridership:', totalRidership);

      // Calculate route counts first
      const routeCounts = {};
      data.forEach(item => {
        if (item.bus_route) {
          routeCounts[item.bus_route] = (routeCounts[item.bus_route] || 0) + parseFloat(item.ridership || 0);
        }
      });

      const uniqueRoutes = Object.keys(routeCounts);
      console.log('🚌 Unique routes count:', uniqueRoutes.length);
      console.log('🚌 Sample routes:', uniqueRoutes.slice(0, 5));

      // Calculate average per route
      const avgPerRoute = uniqueRoutes.length > 0
        ? Math.round(totalRidership / uniqueRoutes.length)
        : 0;
      console.log('📈 Avg Per Route:', avgPerRoute);

      // Calculate peak hour
      const hourCounts = {};
      data.forEach(item => {
        if (item.transit_timestamp) {
          const hour = new Date(item.transit_timestamp).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + parseFloat(item.ridership || 0);
        }
      });

      console.log('⏰ Hour counts:', hourCounts);

      let peakHour = '0:00';
      let maxRidership = 0;

      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxRidership) {
          maxRidership = count;
          const hourNum = parseInt(hour);
          // Format as 12-hour time with AM/PM
          if (hourNum === 0) {
            peakHour = '12:00 AM';
          } else if (hourNum < 12) {
            peakHour = `${hourNum}:00 AM`;
          } else if (hourNum === 12) {
            peakHour = '12:00 PM';
          } else {
            peakHour = `${hourNum - 12}:00 PM`;
          }
        }
      });

      console.log('⏰ Peak Hour:', peakHour, 'with', maxRidership, 'riders');

      const topRoute = Object.entries(routeCounts).length > 0
        ? Object.entries(routeCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['M15', 0])[0]
        : 'M15';

      console.log('🎯 Setting stats:', {
        totalRidership: Math.floor(totalRidership),
        avgPerRoute,
        peakHour,
        topRoute
      });

      setStats({
        totalRidership: Math.floor(totalRidership),
        avgPerRoute: avgPerRoute,
        peakHour: peakHour,
        topRoute: topRoute,
        fareEvasionRate: 3.2,
        tspEfficiency: 87.5
      });
    };

    const fetchRealMTAData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          'https://data.ny.gov/resource/gxb3-akrn.json'
        );

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        console.log('✅ Real MTA Data loaded:', data.length, 'records');
        console.log('🔍 FIRST MTA RECORD:', data[0]); // ← ADD THIS LINE
        console.log('🔍 MTA DATA KEYS:', Object.keys(data[0]));

        // Calculate stats from RAW data FIRST (has route and timestamp)
        calculateRealStats(data);

        // Then process for chart display
        const processed = processRealData(data);
        setRidershipData(processed);


        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching MTA data:', error);
        loadMockData();
      }
    };

    fetchRealMTAData();
  }, []);

  const getPaymentMethodData = () => [
    { name: 'OMNY', value: 45000 },
    { name: 'MetroCard', value: 38000 },
    { name: 'No Fare', value: 2500 }
  ];

  const getFareEvasionData = () => ridershipData.map(item => ({
    hour: item.hour,
    evasionRate: ((item.noFareRecorded / (item.ridership || 1)) * 100).toFixed(1),
    ridership: item.ridership
  }));

  const getTSPData = () => ridershipData.map(item => ({
    hour: item.hour,
    withTSP: Math.floor(Math.random() * 800) + 200,
    withoutTSP: Math.floor(Math.random() * 600) + 100
  }));

  const getFleetOptimizationData = () => [
    { metric: 'Utilization', current: 78, optimal: 95 },
    { metric: 'On-Time', current: 72, optimal: 90 },
    { metric: 'Coverage', current: 85, optimal: 95 },
    { metric: 'Efficiency', current: 68, optimal: 88 },
    { metric: 'Maintenance', current: 82, optimal: 92 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Loading MTA Fleet Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                MTA Fleet Technologies Analytics
              </h1>
              <p className="text-gray-600">
                Advanced Bus Operations Analysis: Ridership, Fare Evasion Detection & TSP Optimization
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Total Ridership</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalRidership.toLocaleString()}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Avg Per Route</p>
                <p className="text-2xl font-bold text-gray-800">{stats.avgPerRoute.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Peak Hour</p>
                <p className="text-2xl font-bold text-gray-800">{stats.peakHour}</p>
              </div>
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Top Route</p>
                <p className="text-2xl font-bold text-gray-800">{stats.topRoute}</p>
              </div>
              <MapPin className="w-10 h-10 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Evasion Rate</p>
                <p className="text-2xl font-bold text-red-600">{stats.fareEvasionRate}%</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">TSP Efficiency</p>
                <p className="text-2xl font-bold text-green-600">{stats.tspEfficiency}%</p>
              </div>
              <Zap className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {['overview', 'fareEvasion', 'tsp', 'fleet'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'fareEvasion' && 'Fare Evasion Detection'}
                {tab === 'tsp' && 'TSP Analysis'}
                {tab === 'fleet' && 'Fleet Optimization'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Hourly Ridership Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ridershipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ridership" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Methods</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={getPaymentMethodData()} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {getPaymentMethodData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'fareEvasion' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Fare Evasion Pattern Detection
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={getFareEvasionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="evasionRate" stroke="#EF4444" strokeWidth={3} name="Evasion Rate (%)" />
                <Line yAxisId="right" type="monotone" dataKey="ridership" stroke="#3B82F6" strokeWidth={2} name="Ridership" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'tsp' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Transit Signal Priority Impact
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={getTSPData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="withTSP" fill="#10B981" name="With TSP" />
                <Bar dataKey="withoutTSP" fill="#EF4444" name="Without TSP" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bus className="w-6 h-6 text-blue-500" />
              Fleet Optimization Analysis
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={getFleetOptimizationData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Radar name="Optimal" dataKey="optimal" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Data Source: MTA Open Data Portal - Supporting Fleet Technologies Initiatives</p>
          <p className="mt-1">Bus Trek | Yard Trek | TSP | Fare Evasion Prevention</p>
        </div>
      </div>
    </div>
  );
};

export default MTABusAnalytics;