// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FlightResults from './pages/FlightResults';
import CompareFlights from './pages/CompareFlights';
import ReviewDetails from './pages/ReviewDetails';
import FlightSeatMap from './pages/FlightSeatMap.jsx';
import Profile from './pages/Profile.jsx';
import BookingLists from './pages/BookingLists.jsx';
import MarkUp from './pages/MarkUp.jsx';
import CouponsAndOffers from './pages/CouponsAndOffers.jsx';
import ComplaintRegister from './pages/ComplaintRegister.jsx';
import Payment from './pages/Payment.jsx';
import { FlightFilterProvider } from './contexts/FlightFilterContext.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/flight-results"
          element={
            <FlightFilterProvider>
              <FlightResults />
            </FlightFilterProvider>
          }
        />
        <Route path="/compare-flights" element={<CompareFlights />} />
        <Route path="/review-details" element={<ReviewDetails />} />
        <Route path="/flight-seat-map" element={<FlightSeatMap />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/my-profile" element={<Profile />} />
        <Route path="/booking-lists" element={<BookingLists />} />
        <Route path="/mark-up" element={<MarkUp />} />
        <Route path="/coupons-and-offers" element={<CouponsAndOffers />} />
        <Route path="/complaint-register" element={<ComplaintRegister />} />
      </Routes>

    </Router>
  );
}

export default App;