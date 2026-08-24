import { useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 10;

export const useInfiniteFlights = (flights) => {

    const [page, setPage] = useState(1);
    const loadMoreRef = useRef(null);
    const observerRef = useRef(null);

    const visibleFlights = useMemo(() => {
        return flights.slice(0, page * PAGE_SIZE);
    }, [flights, page]);

    useEffect(() => {
        setPage(1);
    }, [flights]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    page * PAGE_SIZE < flights.length
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1,
            }
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => observerRef.current?.disconnect();
    }, [page, flights.length]);

    return {
        visibleFlights,
        loadMoreRef,
    };
};