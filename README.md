# portAI - AI-Powered Investment Advisor

portAI is a dynamic fintech platform that leverages AI to transform investment strategies through multi-broker integration and intelligent data analysis.

## Features

- 🤖 AI-powered investment recommendations
- 📊 Real-time portfolio tracking
- 🔗 Web3 wallet integrations (MetaMask, Coinbase)
- 🏦 Multi-broker connectivity (Robinhood, IBKR)
- 🔐 Secure OAuth 2.0 authentication
- 📱 Responsive design for all devices

## Tech Stack

- Frontend: React + TypeScript
- UI Framework: Tailwind CSS + shadcn/ui
- State Management: TanStack Query
- Routing: Wouter
- Charts: Recharts
- Web3: MetaMask + Coinbase SDK

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/portai.git
cd portai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
portai/
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── server/             # Backend application
│   ├── services/       # Business logic
│   └── routes.ts       # API routes
└── shared/            # Shared types and utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.