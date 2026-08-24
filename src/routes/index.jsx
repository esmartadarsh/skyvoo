// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';

import { lazy, Suspense } from 'react';
import PageLoader from "@/components/layout/PageLoader";

import Home from '@/pages/Home';
const FlightSearch = lazy(() => import('@/pages/FlightSearch'));
const CompareFlights = lazy(() => import('@/pages/CompareFlights'));
const ReviewDetails = lazy(() => import('@/pages/ReviewDetails'));
const FlightSeatMap = lazy(() => import('@/pages/FlightSeatMap'));
const Payment = lazy(() => import('@/pages/Payment'));
const Profile = lazy(() => import('@/pages/Profile'));
const BookingLists = lazy(() => import('@/pages/BookingLists'));
const MarkUp = lazy(() => import('@/pages/MarkUp'));
const CouponsAndOffers = lazy(() => import('@/pages/CouponsAndOffers'));
const ComplaintRegister = lazy(() => import('@/pages/ComplaintRegister'));
const Statement = lazy(() => import('@/pages/Statement'));
const FlightReschedule = lazy(() => import('@/pages/FlightReschedule'));
const FlightCancellation = lazy(() => import('@/pages/FlightCancellation'));

import Layout from '@/components/layout/Layout';

import { FlightFilterProvider } from '@/contexts/FlightFilterContext';
import { CompareProvider } from '@/contexts/CompareContext';

export default function AppRoutes() {
    return (
        <CompareProvider>
            <Suspense fallback={< PageLoader />}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/review-details" element={<ReviewDetails />} />
                        <Route path="/flight-seat-map" element={<FlightSeatMap />} />
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

                    {/* Without layout */}
                    <Route
                        path="/flight-results"
                        element={
                            <FlightFilterProvider>
                                <FlightSearch />
                            </FlightFilterProvider>
                        }
                    />

                    <Route
                        path="/compare-flights"
                        element={
                            <CompareFlights />
                        }
                    />

                </Routes>

            </Suspense>
        </CompareProvider>
    );
}