# IT Services Vendor Management System

A modern, AI-powered vendor management system built with React, NestJS, and Material-UI. Features real-time chat with AI assistant for vendor information, comprehensive dashboard, and intelligent query processing.

## 🚀 Features

- **AI-Powered Chat Interface** - ChatGPT-like experience for vendor queries
- **Vendor Dashboard** - Statistics, ratings, and contract management
- **Real-time Data** - Live vendor information and analytics
- **Modern UI** - Material-UI components with professional design
- **Comprehensive Database** - Vendors, consultants, contracts, rate cards, services

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **Vite** for fast development and building
- **Axios** for API communication

### Backend
- **NestJS** with TypeScript
- **Prisma** ORM with PostgreSQL
- **Socket.IO** for real-time communication
- **Gemini AI** for intelligent responses

### Database
- **PostgreSQL** with comprehensive schema
- **Vendor profiles** with skills and ratings
- **Rate cards** with pricing information
- **Consultants** with availability and expertise
- **Contracts** with values and status
- **Services** with categories and pricing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Gemini API key

### Backend Setup

```bash
cd requisition-ui/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL and GEMINI_API_KEY

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database
curl -X POST http://localhost:3000/seed

# Start development server
npm run start:dev
```

### Frontend Setup

```bash
cd requisition-ui/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 Access URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

## 💬 AI Chat Features

The AI assistant can answer questions about:
- Vendor profiles and company details
- Rate cards and pricing information
- Available consultants and their skills
- Active contracts and project details
- Service offerings and capabilities
- Vendor comparisons and recommendations

### Sample Queries
- "Show me all vendors"
- "What are the rates for React developers?"
- "Who are the available consultants?"
- "Tell me about active contracts"
- "Compare vendor services"

## 📊 Dashboard Features

- **Total Vendors**: 2
- **Total Consultants**: 6
- **Active Contracts**: 4
- **Contract Value**: $645k
- **Average Rating**: 4.7/5

## 🚀 Deployment

### Frontend (Netlify)

1. **Build the frontend:**
```bash
cd requisition-ui/frontend
npm run build
```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables for backend URL

### Backend (Railway/Render/Vercel)

1. **Prepare for deployment:**
```bash
cd requisition-ui/backend
npm run build
```

2. **Deploy to Railway:**
   - Connect GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `GEMINI_API_KEY`
     - `PORT=3000`

3. **Update frontend API URL:**
   - Change `http://localhost:3000` to your deployed backend URL

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Frontend (Netlify)
```env
VITE_API_URL="https://your-backend-url.com"
```

## 📁 Project Structure

```
requisition-ui/
├── backend/
│   ├── src/
│   │   ├── ai/           # AI orchestration service
│   │   ├── chat/         # WebSocket chat functionality
│   │   ├── seed/         # Database seeding
│   │   └── requisition/  # Requisition management
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiChatInterface.tsx
│   │   │   └── VendorDashboard.tsx
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, please open an issue in the GitHub repository. 