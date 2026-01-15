// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import FlightResults from './pages/FlightResults';
import CompareFlights from './pages/CompareFlights';
import ReviewDetails from './pages/ReviewDetails';
import FlightSeatMap from './pages/FlightSeatMap';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import BookingLists from './pages/BookingLists';
import MarkUp from './pages/MarkUp';
import CouponsAndOffers from './pages/CouponsAndOffers';
import ComplaintRegister from './pages/ComplaintRegister';
import Statement from './pages/Statement';
import FlightReschedule from './pages/FlightReschedule';
import FlightCancellation from './pages/FlightCancellation';

import { FlightFilterProvider } from './contexts/FlightFilterContext';
import { CompareProvider } from './features/flights/contexts/CompareContext';

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔹 Pages wrapped with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/review-details" element={<ReviewDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/booking-lists" element={<BookingLists />} />
          <Route path="/mark-up" element={<MarkUp />} />
          <Route path="/coupons-and-offers" element={<CouponsAndOffers />} />
          <Route path="/complaint-register" element={<ComplaintRegister />} />
          <Route path="/statement" element={<Statement />} />
          <Route path="/flight-reschedule" element={<FlightReschedule />} />
          <Route path="/flight-cancellation" element={<FlightCancellation />} />
        </Route>

        {/* 🔹 Pages without layout */}
        <Route
          path="/flight-results"
          element={
            <FlightFilterProvider>
              <CompareProvider>
                <FlightResults />
              </CompareProvider>
            </FlightFilterProvider>
          }
        />

        <Route
          path="/compare-flights"
          element={
            <CompareProvider>
              <CompareFlights />
            </CompareProvider>
          }
        />

        {/* Modal Opening */}
        <Route path="/flight-seat-map" element={<FlightSeatMap />} />

      </Routes>
    </Router>
  );
}

export default App;
