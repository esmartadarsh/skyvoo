import React, { useCallback } from 'react';
import SeatButton from './SeatButton';

function SeatGrid({ processedRows, seatLetters, selectedSeats, onSeatClick, onSeatHover, onSeatLeave, getSeatColor }) {
    const handleSeatClick = useCallback(
        (seat) => () => onSeatClick(seat),
        [onSeatClick]
    );

    const handleSeatHover = useCallback(
        (seat) => (e) => onSeatHover(seat, e),
        [onSeatHover]
    );

    return (
        <div className="bg-[#f1f0f29e] shadow-sm rounded-xl py-8 px-20 border border-gray-200">

            {/* Top Header Row */}
            <div className="grid grid-cols-10 justify-items-center mb-6">
                <div></div>
                <div></div>
                {seatLetters.map((letter, idx) => (
                    <React.Fragment key={letter}>
                        {idx === 3 && <div className="w-8"></div>}
                        <div className="text-gray-700 font-bold text-lg">{letter}</div>
                    </React.Fragment>
                ))}
            </div>

            {/* Seat Rows */}
            <div className="space-y-2">
                {processedRows.map(row => {
                    const rowSeatsMap = Object.fromEntries(row.seats.map(seat => [seat.letter, seat]));

                    return (
                        <div key={row.rowNumber} className="grid grid-cols-10 justify-items-center items-center">
                            <div></div>

                            {/* Row Number */}
                            <div className="text-gray-700 font-semibold text-lg text-start">
                                <div>{row.rowNumber}</div>
                            </div>

                            {/* Seats A–C */}
                            {['A', 'B', 'C'].map(letter => {
                                const seat = rowSeatsMap[letter];
                                return seat ? (
                                    <div key={seat.number} className="relative flex flex-col items-center">
                                        {selectedSeats.has(seat.number) ? (
                                            <div className="p-[3px] bg-white border-2 border-indigo-500 rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out">
                                                <SeatButton
                                                    seat={seat}
                                                    onClick={handleSeatClick(seat)}
                                                    onHover={handleSeatHover(seat)}
                                                    onLeave={onSeatLeave}
                                                    getSeatColor={() => getSeatColor(seat)}
                                                />
                                            </div>
                                        ) : (
                                            <SeatButton
                                                seat={seat}
                                                onClick={handleSeatClick(seat)}
                                                onHover={handleSeatHover(seat)}
                                                onLeave={onSeatLeave}
                                                getSeatColor={() => getSeatColor(seat)}
                                            />
                                        )}

                                    </div>
                                ) : (
                                    <div key={letter} className="w-16 h-16 bg-gray-50"></div>
                                );
                            })}


                            {/* Aisle Divider */}
                            <div className="flex items-center justify-between w-8">
                                <div className="h-10 w-1 border-gray-400 border-l-2 border-dashed opacity-40"></div>
                                <div className="h-10 w-1 border-gray-400 border-r-2 border-dashed opacity-40"></div>
                            </div>

                            {/* Seats D–F */}
                            {['D', 'E', 'F'].map(letter => {
                                const seat = rowSeatsMap[letter];
                                return seat ? (
                                    <div key={seat.number} className="relative flex flex-col items-center">
                                        {selectedSeats.has(seat.number) ? (
                                            <div className="p-[3px] bg-white border-2 border-indigo-500 rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out">
                                                <SeatButton
                                                    seat={seat}
                                                    onClick={handleSeatClick(seat)}
                                                    onHover={handleSeatHover(seat)}
                                                    onLeave={onSeatLeave}
                                                    getSeatColor={() => getSeatColor(seat)}
                                                />
                                            </div>
                                        ) : (
                                            <SeatButton
                                                seat={seat}
                                                onClick={handleSeatClick(seat)}
                                                onHover={handleSeatHover(seat)}
                                                onLeave={onSeatLeave}
                                                getSeatColor={() => getSeatColor(seat)}
                                            />
                                        )}

                                    </div>
                                ) : (
                                    <div key={letter} className="w-16 h-16 bg-gray-50"></div>
                                );
                            })}

                        </div>
                    );

                })}
            </div>
        </div>
    )
}

export default SeatGrid