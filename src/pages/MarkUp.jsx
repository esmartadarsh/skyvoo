import React, { useState, useMemo } from 'react';
import { Plus, X, Plane, Globe, Trash2 } from 'lucide-react';
import Select, { components } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api.js';


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

    const {
        data: markupMasterData,
        isLoading: isMarkupMasterLoading,
        error: markupMasterError,
    } = useQuery({
        queryKey: ['markupMaster'],
        queryFn: async () => {
            const response = await api.post('/flight/GetMarkupMaster', {});

            if (!response.data?.IsSuccess) {
                throw new Error(
                    response.data?.ErrorMessage || 'Failed to fetch markup master'
                );
            }

            return response.data;
        }
    });

    const airlineOptions = useMemo(() => {
        const list = markupMasterData?.Data?.AirlineDetailList;
        if (Array.isArray(list) && list.length > 0) {
            return list.map((item) => ({
                value: item.CodeListId,
                label: item.CodeListDescription,
                codeListId: item.CodeListId,
            }));
        }
        return [];
    }, [markupMasterData]);

    const handleAddMarkup = () => {
        if (!amount) return;

        const newMarkup = {
            id: Date.now(),
            category: markupType === 'location'
                ? (locationType === 'domestic' ? 'Domestic' : 'International')
                : selectedAirline?.label,
            type: valueType === 'percentage' ? 'Percentage' : 'Fixed',
            amount: valueType === 'percentage' ? `${amount}%` : `₹${amount}`,
            airlineId: markupType === 'airline' ? selectedAirline?.value : null,
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
                            className="bg-[#78080B] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto cursor-pointer"
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
                                            className={`border-b border-gray-100 hover:bg-red-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
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
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                                className="hover:bg-white hover:text-black hover:bg-opacity-20 p-1 rounded-lg transition-colors cursor-pointer"
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
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${markupType === 'location'
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
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${markupType === 'airline'
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
                                    {markupMasterError && (
                                        <p className="text-xs text-red-500 mb-2">
                                            Failed to load airline list. Please try again.
                                        </p>
                                    )}
                                    <Select
                                        value={selectedAirline}
                                        onChange={setSelectedAirline}
                                        options={airlineOptions}
                                        isLoading={isMarkupMasterLoading}
                                        styles={customSelectStyles}
                                        components={{ Option: CustomOption }}
                                        placeholder={isMarkupMasterLoading ? "Loading airlines..." : "Search and select an airline..."}
                                        noOptionsMessage={() => isMarkupMasterLoading ? "Loading airlines..." : "No airlines found"}
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
                                        <span className="font-medium text-gray-700">Fixed Amount (₹)</span>
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
                                        {valueType === 'percentage' ? '%' : '₹'}
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
                                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMarkup}
                                    disabled={
                                        !amount ||
                                        (markupType === 'airline' && !selectedAirline)
                                    }
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
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