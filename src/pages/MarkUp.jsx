import React, { useState } from 'react';
import { Plus, X, Plane, Globe, Trash2, Edit2 } from 'lucide-react';
import Select, { components } from 'react-select';
import Header from '@/components/layout/Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'

const airlineOptions = [
    { value: 'Aer Lingus', label: 'Aer Lingus' },
    { value: 'Aeromexico', label: 'Aeromexico' },
    { value: 'Air Arabia', label: 'Air Arabia' },
    { value: 'Air Canada', label: 'Air Canada' },
    { value: 'Air China', label: 'Air China' },
    { value: 'Air France', label: 'Air France' },
    { value: 'Air India', label: 'Air India' },
    { value: 'Air New Zealand', label: 'Air New Zealand' },
    { value: 'AirAsia', label: 'AirAsia' },
    { value: 'AirAsia India', label: 'AirAsia India' },
    { value: 'Alaska Airlines', label: 'Alaska Airlines' },
    { value: 'Alitalia', label: 'Alitalia' },
    { value: 'All Nippon Airways', label: 'All Nippon Airways (ANA)' },
    { value: 'American Airlines', label: 'American Airlines' },
    { value: 'Asiana Airlines', label: 'Asiana Airlines' },
    { value: 'Austrian Airlines', label: 'Austrian Airlines' },
    { value: 'Avianca', label: 'Avianca' },
    { value: 'Azul Brazilian Airlines', label: 'Azul Brazilian Airlines' },
    { value: 'Biman Bangladesh Airlines', label: 'Biman Bangladesh Airlines' },
    { value: 'British Airways', label: 'British Airways' },
    { value: 'Cathay Pacific', label: 'Cathay Pacific' },
    { value: 'China Eastern Airlines', label: 'China Eastern Airlines' },
    { value: 'China Southern Airlines', label: 'China Southern Airlines' },
    { value: 'Copa Airlines', label: 'Copa Airlines' },
    { value: 'Delta Airlines', label: 'Delta Airlines' },
    { value: 'EasyJet', label: 'EasyJet' },
    { value: 'EgyptAir', label: 'EgyptAir' },
    { value: 'Emirates', label: 'Emirates' },
    { value: 'Ethiopian Airlines', label: 'Ethiopian Airlines' },
    { value: 'Etihad Airways', label: 'Etihad Airways' },
    { value: 'Fiji Airways', label: 'Fiji Airways' },
    { value: 'Finnair', label: 'Finnair' },
    { value: 'flydubai', label: 'flydubai' },
    { value: 'Frontier Airlines', label: 'Frontier Airlines' },
    { value: 'Garuda Indonesia', label: 'Garuda Indonesia' },
    { value: 'Go First', label: 'Go First' },
    { value: 'Gol Linhas Aereas', label: 'Gol Linhas Aereas' },
    { value: 'Gulf Air', label: 'Gulf Air' },
    { value: 'Iberia', label: 'Iberia' },
    { value: 'IndiGo', label: 'IndiGo' },
    { value: 'Japan Airlines', label: 'Japan Airlines' },
    { value: 'JetBlue Airways', label: 'JetBlue Airways' },
    { value: 'Jetstar Airways', label: 'Jetstar Airways' },
    { value: 'Kenya Airways', label: 'Kenya Airways' },
    { value: 'KLM Royal Dutch Airlines', label: 'KLM Royal Dutch Airlines' },
    { value: 'Korean Air', label: 'Korean Air' },
    { value: 'LATAM Airlines', label: 'LATAM Airlines' },
    { value: 'Lufthansa', label: 'Lufthansa' },
    { value: 'Malaysia Airlines', label: 'Malaysia Airlines' },
    { value: 'Nepal Airlines', label: 'Nepal Airlines' },
    { value: 'Oman Air', label: 'Oman Air' },
    { value: 'Pakistan International Airlines', label: 'Pakistan International Airlines' },
    { value: 'Philippine Airlines', label: 'Philippine Airlines' },
    { value: 'Qantas', label: 'Qantas' },
    { value: 'Qatar Airways', label: 'Qatar Airways' },
    { value: 'Royal Air Maroc', label: 'Royal Air Maroc' },
    { value: 'Ryanair', label: 'Ryanair' },
    { value: 'SAS Scandinavian Airlines', label: 'SAS Scandinavian Airlines' },
    { value: 'Saudia', label: 'Saudia' },
    { value: 'Singapore Airlines', label: 'Singapore Airlines' },
    { value: 'South African Airways', label: 'South African Airways' },
    { value: 'Southwest Airlines', label: 'Southwest Airlines' },
    { value: 'SpiceJet', label: 'SpiceJet' },
    { value: 'Spirit Airlines', label: 'Spirit Airlines' },
    { value: 'Sri Lankan Airlines', label: 'Sri Lankan Airlines' },
    { value: 'Swiss International Air Lines', label: 'Swiss International Air Lines' },
    { value: 'TAP Air Portugal', label: 'TAP Air Portugal' },
    { value: 'Thai Airways', label: 'Thai Airways' },
    { value: 'Turkish Airlines', label: 'Turkish Airlines' },
    { value: 'United Airlines', label: 'United Airlines' },
    { value: 'Vietnam Airlines', label: 'Vietnam Airlines' },
    { value: 'Virgin Australia', label: 'Virgin Australia' },
    { value: 'Vistara', label: 'Vistara' },
    { value: 'WestJet', label: 'WestJet' },
    { value: 'Wizz Air', label: 'Wizz Air' }
];

function MarkUp() {

    const [markups, setMarkups] = useState([
        { id: 1, category: 'Domestic', type: 'Percentage', amount: '5%' },
        { id: 2, category: 'International', type: 'Fixed', amount: '₹50' },
        { id: 3, category: 'Air India', type: 'Percentage', amount: '3%' },
        { id: 4, category: 'Indigo', type: 'Percentage', amount: '9%' },
        { id: 5, category: 'Vistara', type: 'Fixed', amount: '10%' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [markupType, setMarkupType] = useState('location');
    const [locationType, setLocationType] = useState('domestic');
    const [selectedAirline, setSelectedAirline] = useState(null);
    const [valueType, setValueType] = useState('percentage');
    const [amount, setAmount] = useState('');

    const handleAddMarkup = () => {
        if (!amount) return;

        const newMarkup = {
            id: Date.now(),
            category: markupType === 'location'
                ? (locationType === 'domestic' ? 'Domestic' : 'International')
                : selectedAirline?.label,
            type: valueType === 'percentage' ? 'Percentage' : 'Fixed',
            amount: valueType === 'percentage' ? `${amount}%` : `${amount}`
        };

        setMarkups([...markups, newMarkup]);
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMarkupType('location');
        setLocationType('domestic');
        setSelectedAirline(null);
        setValueType('percentage');
        setAmount('');
    };

    // Custom styles for react-select
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            padding: '4px',
            borderWidth: '2px',
            borderColor: state.isFocused ? '#4f46e5' : '#e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(79, 70, 229, 0.1)' : 'none',
            '&:hover': {
                borderColor: '#4f46e5'
            }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#4f46e5'
                : state.isFocused
                    ? '#e0e7ff'
                    : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            padding: '12px 16px',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: '#4338ca'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        })
    };

    // Custom option component with icon
    const CustomOption = (props) => (
        <components.Option {...props}>
            <div className="flex items-center gap-2">
                <Plane size={16} className="text-[#a54040]" />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    );

    const handleDelete = (id) => {
        setMarkups(markups.filter(m => m.id !== id));
    };

    return (
        <>
            <div className="relative max-w-6xl mx-auto z-888 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                            Markup Management
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Configure pricing markups for flights and airlines
                        </p>
                    </div>

                    <div className="flex sm:items-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#78080B] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                        >
                            <Plus size={20} />
                            Add Markup
                        </button>
                    </div>
                </div>



                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm sm:text-base">
                            <thead>
                                <tr className="bg-[#78080B] text-white">
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {markups.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <Plane size={48} className="text-gray-300" />
                                                <p className="text-lg">No markups configured yet</p>
                                                <p className="text-sm">Click "Add Markup" to create your first markup rule</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    markups.map((markup, index) => (
                                        <tr
                                            key={markup.id}
                                            className={`border-b border-gray-100 hover:bg-red   -50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {markup.category === 'Domestic' || markup.category === 'International' ? (
                                                        <Globe size={18} className="text-[#a54040]" />
                                                    ) : (
                                                        <Plane size={18} className="text-[#a54040]" />
                                                    )}
                                                    <span className="font-medium text-gray-800">{markup.category}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${markup.type === 'Percentage'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {markup.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-lg font-semibold text-gray-800">{markup.amount}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const confirmed = window.confirm("Are you sure you want to delete this?");
                                                            if (confirmed) handleDelete(markup.id);
                                                        }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-2 sm:p-4 z-9999 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-[#78080B] text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
                            <h2 className="text-2xl font-bold">Add New Markup</h2>
                            <button
                                onClick={handleCloseModal}
                                className="hover:bg-white hover:text-black hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Markup Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Markup Type
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setMarkupType('location')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${markupType === 'location'
                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <Globe size={32} className={markupType === 'location' ? 'text-[#a54040]' : 'text-gray-400'} />
                                        <span className={`font-semibold ${markupType === 'location' ? 'text-[#a54040]' : 'text-gray-600'}`}>
                                            Location Based
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setMarkupType('airline')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${markupType === 'airline'
                                            ? 'border-indigo-600 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <Plane size={32} className={markupType === 'airline' ? 'text-[#a54040]' : 'text-gray-400'} />
                                        <span className={`font-semibold ${markupType === 'airline' ? 'text-[#a54040]' : 'text-gray-600'}`}>
                                            Airline Specific
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Location Type */}
                            {markupType === 'location' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Flight Type
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 flex-1">
                                            <input
                                                type="radio"
                                                name="locationType"
                                                value="domestic"
                                                className="w-5 h-5 text-blue-600"
                                                checked={locationType === 'domestic'}
                                                onChange={(e) => setLocationType(e.target.value)}
                                            />
                                            <span className="font-medium text-gray-700">Domestic</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 flex-1">
                                            <input
                                                type="radio"
                                                name="locationType"
                                                value="international"
                                                className="w-5 h-5 text-blue-600"
                                                checked={locationType === 'international'}
                                                onChange={(e) => setLocationType(e.target.value)}
                                            />
                                            <span className="font-medium text-gray-700">International</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Airline Selection */}
                            {markupType === 'airline' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Select Airline
                                    </label>
                                    <Select
                                        value={selectedAirline}
                                        onChange={setSelectedAirline}
                                        options={airlineOptions}
                                        styles={customSelectStyles}
                                        components={{ Option: CustomOption }}
                                        placeholder="Search and select an airline..."
                                        isSearchable
                                        className="text-base"
                                    />
                                </div>
                            )}

                            {/* Value Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Markup Value Type
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 flex-1">
                                        <input
                                            type="radio"
                                            name="valueType"
                                            value="percentage"
                                            checked={valueType === 'percentage'}
                                            onChange={(e) => setValueType(e.target.value)}
                                            className="w-5 h-5 text-green-600"
                                        />
                                        <span className="font-medium text-gray-700">Percentage (%)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 flex-1">
                                        <input
                                            type="radio"
                                            name="valueType"
                                            value="fixed"
                                            checked={valueType === 'fixed'}
                                            onChange={(e) => setValueType(e.target.value)}
                                            className="w-5 h-5 text-green-600"
                                        />
                                        <span className="font-medium text-gray-700">Fixed Amount ($)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                        {valueType === 'percentage' ? '%' : '$'}
                                    </span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder={valueType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMarkup}
                                    disabled={
                                        !amount ||
                                        (markupType === 'airline' && !selectedAirline)
                                    }
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Add Markup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MarkUp;