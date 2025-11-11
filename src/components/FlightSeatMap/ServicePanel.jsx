import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, Briefcase, Clock, Accessibility, ChevronDown } from 'lucide-react';
import { wheelchairOptions, mealsOptions, priorityBaggageOptions, fastForwardOptions, extraBaggage } from '../../Data/ExtraData';

// --- Place these ABOVE the ServicePanel function ---
const SmoothCollapse = React.memo(({ isOpen, children, id }) => {
    const ref = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");
    const wasOpenRef = useRef(isOpen);

    // Debug every render
    useEffect(() => {
        const element = ref.current;

        if (wasOpenRef.current !== isOpen) {
            wasOpenRef.current = isOpen;
        }

        if (!element) return;

        if (isOpen) {
            requestAnimationFrame(() => {
                setMaxHeight(`${element.scrollHeight}px`);
            });
        } else {
            setMaxHeight("0px");
        }
    }, [isOpen]);

    return (
        <div
            className="transition-all duration-500 ease-in-out overflow-hidden"
            style={{
                maxHeight,
                opacity: isOpen ? 1 : 0,
                marginTop: isOpen ? "8px" : "0px",
            }}
        >
            <div
                ref={ref}
                className={`transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
            >
                {children}
            </div>
        </div>
    );
});


const ServiceSection = React.memo(
    ({ id, title, icon: Icon, data, openSection, toggleSection, handleServiceClick }) => (
        <div className="border-b border-gray-200 pb-2 my-3">
            <button
                onClick={() => toggleSection(id)}
                className="w-full flex justify-between items-center"
            >
                <span className="flex items-center text-base font-semibold text-gray-800">
                    <Icon className="mr-2 w-5 h-5" />
                    {title}
                </span>
                <span className="text-xl">
                    <ChevronDown
                        className="w-5 h-5 transition-transform duration-500 ease-in-out"
                        style={{
                            transform: openSection === id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </span>
            </button>

            <SmoothCollapse id={id} isOpen={openSection === id}>
                {data.map((item) => (
                    <div
                        key={item.code}
                        onClick={handleServiceClick(item)}
                        className="cursor-pointer flex justify-between p-3 my-2 border border-gray-200 hover:bg-gray-50 rounded-lg transition"
                        role="button"
                        tabIndex={0}
                    >
                        <div>
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-sm font-semibold">
                                Code: <span className="font-normal">{item.code}</span>
                            </p>
                        </div>
                        <div>
                            <p className="px-2 py-1 rounded-lg text-sm font-medium text-gray-700 bg-gray-300">
                                {item.price}
                            </p>
                        </div>
                    </div>
                ))}
            </SmoothCollapse>
        </div>
    )
);

function ServicePanel({ setSelectedServices }) {
    const [openSection, setOpenSection] = useState(null);

    const handleAddService = useCallback((service) => {
        setSelectedServices((prev) => {
            if (prev.find((s) => s.code === service.code)) return prev;
            return [...prev, service];
        });
    }, [setSelectedServices]);

    const handleServiceClick = useCallback(
        (service) => () => handleAddService(service),
        [handleAddService]
    );

    const toggleSection = useCallback(
        (section) => setOpenSection((prev) => (prev === section ? null : section)),
        []
    );

    return (
        <div className="lg:col-span-3 bg-[#f1f0f29e] shadow-sm rounded-xl py-4 px-6 border border-gray-200 h-auto">
            <div className="flex items-center mt-2 mb-6">
                <UtensilsCrossed className="mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Special Services</h3>
            </div>

            <ServiceSection
                id="wheelchair"
                title="Wheelchair Assistance"
                icon={Accessibility}
                data={wheelchairOptions}
                openSection={openSection}
                toggleSection={toggleSection}
                handleServiceClick={handleServiceClick}
            />

            <ServiceSection
                id="meal"
                title="Meals"
                icon={UtensilsCrossed}
                data={mealsOptions}
                openSection={openSection}
                toggleSection={toggleSection}
                handleServiceClick={handleServiceClick}
            />

            <ServiceSection
                id="prioritybaggage"
                title="Priority Baggage"
                icon={Briefcase}
                data={priorityBaggageOptions}
                openSection={openSection}
                toggleSection={toggleSection}
                handleServiceClick={handleServiceClick}
            />

            <ServiceSection
                id="fastforwardservices"
                title="Fast Forward Options"
                icon={Clock}
                data={fastForwardOptions}
                openSection={openSection}
                toggleSection={toggleSection}
                handleServiceClick={handleServiceClick}
            />

            <ServiceSection
                id="extrabaggage"
                title="Extra Baggage"
                icon={Briefcase}
                data={extraBaggage}
                openSection={openSection}
                toggleSection={toggleSection}
                handleServiceClick={handleServiceClick}
            />

        </div>
    )
}

export default ServicePanel