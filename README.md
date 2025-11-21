# MTA Fleet Technologies Analytics Dashboard

Advanced Bus Operations Analysis: Ridership, Fare Evasion Detection & TSP Optimization

## 🚌 Overview

A comprehensive analytics dashboard for NYC MTA bus operations, providing real-time insights into ridership patterns, fare evasion detection, Transit Signal Priority (TSP) efficiency, and fleet optimization metrics.

## 🌐 Live Demo

**Live Application**: https://mta-bus-analytics1.netlify.app/
**GitHub Repository**: https://github.com/thepalakshah/mta-bus-analytics.git


## ✨ Features

- **Real-time Data Integration**: Live data from MTA Open Data Portal
- **Multi-dimensional Analysis**: 
  - Hourly ridership trends
  - Payment method distribution (OMNY, MetroCard, No Fare)
  - Fare evasion pattern detection
  - TSP impact analysis
  - Fleet optimization metrics
- **Interactive Visualizations**: Charts and graphs using Recharts library
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 📊 Dashboard Tabs

1. **Overview**: Key metrics and hourly ridership trends
2. **Fare Evasion Detection**: Pattern analysis for fare evasion
3. **TSP Analysis**: Transit Signal Priority impact comparison
4. **Fleet Optimization**: Current vs optimal performance metrics

## 🛠️ Tech Stack

### Frontend
- React.js
- Recharts (data visualization)
- Lucide React (icons)
- Tailwind CSS (styling)

### Backend
- Node.js
- Express.js
- Axios (API calls)

### Data Source
- MTA Open Data Portal API
- 379 NYC bus routes
- Real-time ridership data

## 📈 Key Metrics Displayed

- **Total Ridership**: Overall bus ridership count
- **Avg Per Route**: Average ridership per bus route
- **Peak Hour**: Time period with highest ridership
- **Top Route**: Highest performing bus route
- **Evasion Rate**: Fare evasion percentage
- **TSP Efficiency**: Transit Signal Priority effectiveness

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
node app.js
```

The frontend will run on `http://localhost:3000` and backend on `http://localhost:5000`

## 🔧 Configuration

Replace the MTA API endpoint in `frontend/src/App.js`:
```javascript
const response = await fetch('YOUR_MTA_API_ENDPOINT');
```
