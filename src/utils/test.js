you are the senior react developer and i am just a 6 months experienced 
i am creating a flight booking portal project in vite, it is still ongoing

these are the libraries that i am using

{
  "name": "skyvoo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.7",
    "@heroicons/react": "^2.2.0",
    "@splidejs/react-splide": "^0.7.12",
    "@tailwindcss/vite": "^4.1.12",
    "@tanstack/react-query": "^5.85.9",
    "axios": "^1.11.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.542.0",
    "react": "^19.1.1",
    "react-day-picker": "^9.11.1", 
    "react-dom": "^19.1.1",
    "react-easy-crop": "^5.5.3",
    "react-hook-form": "^7.62.0",
    "react-router-dom": "^7.8.2",
    "react-select": "^5.10.2",
    "tailwindcss": "^4.1.12"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.1.2"
  }
}

this the project architecture 



skyvoo/ 
├── node_modules/  
├── public/              
│   └── vite.svg 
├── src/                   
│   ├── assets/         
│   │   └── fonts
│   │   └── imgs
│   │   └── vectors
│   ├── components/ 

│   │   ├── common 

│   │   │   ├── Modals
│   │   │   │   └── BaggageModal.jsx  
│   │   │   │   └── FareRulesModal.jsx  
│   │   │   │   └── FlightPriceDetailsModal.jsx  
│   │   │   │   └── SignInModal.jsx  
│   │   │   │   └── TicketDetailsReviewModal.jsx  
│   │   │   │   └── TripBenefitsModal.jsx 
│   │   ├── flight
│   │   │   └── Filters.jsx 
│   │   │   └── FlightResultsHeader.jsx 
│   │   │   └── FlightResultsSearchHeader.jsx 
│   │   │   └── ViewFlightDetails.jsx  
│   │   ├── FlightSeatMap
│   │   │   └── FlightSeat.jsx 
│   │   │   └── SeatButton.jsx 
│   │   │   └── SeatGrid.jsx 
│   │   │   └── SeatTooltip.jsx 
│   │   │   └── ServicePanel.jsx 
│   │   │   └── SummaryPanel.jsx 
│   │   ├── layout
│   │   │   └── Header.jsx 
│   │   │   └── LoadingBar.jsx 
│   │   ├── BookingForm.jsx
│   │   ├── PromotionalCard.jsx
│   │   ├── StickerStack.jsx
│   ├── contexts/
│   │   ├── FlightFilterContext.jsx
│   ├── hooks
│   │   └── useSeatSelection.js
│   ├── pages
│   │   └── BookingLists.jsx
│   │   └── CompareFlights.jsx
│   │   └── ComplaintRegister.jsx
│   │   └── CouponsAndOffers.jsx
│   │   └── FlightCancellation.jsx
│   │   └── FlightReschedule.jsx
│   │   └── FlightResults.jsx
│   │   └── FlightSeatMap.jsx
│   │   └── Home.jsx
│   │   └── MarkUp.jsx
│   │   └── Payment.jsx
│   │   └── Profile.jsx
│   │   └── ReviewDetails.jsx
│   │   └── Statement.jsx
│   ├── services
│   │   └── flightsService.js
│   ├── styles
│   │   └── glass.css
│   │   └── glassButton.css
│   │   └── StickerStack.css
│   │   └── index.css
│   ├── utils 
│   │   └── formatDateTime.js
│   │   └── getCroppedImg.jsx


│   │   │   │   └── Filters.jsx  
│   │   │   │   └── FlightResultsHeader.jsx
│   │   │   │   └── ViewFlightDetails.jsx
│   │   ├── Modals
│   │   │   └── BaggageModal.jsx
│   │   │   └── FareRulesModal.jsx
│   │   │   └── FlightPriceDetailsModal.jsx
│   │   │   └── SignInModal.jsx
│   │   │   └── TripBenefitsModal.jsx
│   │   └── BookingForm.jsx 
│   │   └── Header.jsx
│   │   └── ProgressBar.jsx 
│   │   └── PromotionalCard.jsx
│   │   └── StickerStack.jsx
│   ├── contexts /
│   │   └── FlightFilterContext.jsx
│   ├── pages/
│   │   └── CompareFlights.jsx
│   │   └── FlightResults.jsx
│   │   └── Home.jsx
│   │   └── ReviewDetails.jsx
│   ├── utils /
│   │   └── formatDateTime.js
│   ├── glass.css
│   ├── glassButton.css 

│   ├── index.css
│   ├── StickerStack.css

│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point (renders <App />) 
├── .gitignore
├── eslint.config.js
├── index.html              # Root HTML file 
├── package-lock.json 
├── package.json            # Project metadata & scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js
└── README.md

give me suggestion or improvements, like thats how a senior developer would do this or that