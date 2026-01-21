import React, { useState } from 'react';
import { Download, Search, Calendar, Filter, ChevronDown, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp'

const mockData = [
    {
        id: 1,
        dateTime: '05/11/2025 09:25:44',
        subRetailerId: 'EZP001237',
        subRetailerName: 'QuickPay Hub',
        retailerName: 'FinEdge Technologies',
        userName: 'EZP001237',
        referenceNo: 'TXN45PLX',
        supplierRefNo: 'QR8732',
        productName: 'Mobile Recharge',
        description: 'Prepaid Mobile Top-Up',
        debit: '249.00',
        credit: '0.00',
        balance: '15,781.50',
        userRemarks: 'Recharge successful'
    },
    {
        id: 2,
        dateTime: '06/11/2025 16:12:09',
        subRetailerId: 'EZP001237',
        subRetailerName: 'QuickPay Hub',
        retailerName: 'FinEdge Technologies',
        userName: 'EZP001237',
        referenceNo: 'TXN46RDN',
        supplierRefNo: 'UPI90021',
        productName: 'Electricity',
        description: 'Bill Payment',
        debit: '1,432.00',
        credit: '0.00',
        balance: '14,349.50',
        userRemarks: 'Bill paid successfully'
    },
    {
        id: 3,
        dateTime: '07/11/2025 10:41:30',
        subRetailerId: '',
        subRetailerName: '',
        retailerName: 'FinEdge Technologies',
        userName: 'FIN100024',
        referenceNo: 'ADJ984HF',
        supplierRefNo: 'NEFT20251107321',
        productName: 'Wallet Funding',
        description: 'Admin Credit',
        debit: '0.00',
        credit: '100,000.00',
        balance: '114,349.50',
        userRemarks: 'Manual top-up successful'
    },
    {
        id: 4,
        dateTime: '08/11/2025 13:58:22',
        subRetailerId: 'EZP004562',
        subRetailerName: 'SmartPay Kiosk',
        retailerName: 'FinEdge Technologies',
        userName: 'EZP004562',
        referenceNo: 'TXN47WQZ',
        supplierRefNo: 'AIR567Q',
        productName: 'Airline',
        description: 'Flight Booking',
        debit: '12,580.00',
        credit: '0.00',
        balance: '101,769.50',
        userRemarks: 'Domestic booking'
    },
    {
        id: 5,
        dateTime: '09/11/2025 18:22:15',
        subRetailerId: 'FIN100024',
        subRetailerName: 'FinEdge Technologies',
        retailerName: 'FinEdge Technologies',
        userName: 'FIN100024',
        referenceNo: 'CRN2025D1',
        supplierRefNo: '',
        productName: 'Incentive',
        description: 'Monthly Performance Bonus',
        debit: '0.00',
        credit: '2,000.00',
        balance: '103,769.50',
        userRemarks: 'Incentive credited'
    }
];

function Statement() {
    const [activeTab, setActiveTab] = useState('wallet');
    const [statementType, setStatementType] = useState('statement');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [fromDate, setFromDate] = useState('2025-01-11');
    const [toDate, setToDate] = useState('2025-11-11');
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState('10');
    const [showFilters, setShowFilters] = useState(false);

    const [columnVisibility, setColumnVisibility] = useState({
        dateTime: true,
        subRetailerId: true,
        subRetailerName: true,
        retailerName: true,
        userName: true,
        referenceNo: true,
        supplierRefNo: true,
        productName: true,
        description: true,
        debit: true,
        credit: true,
        balance: true,
        userRemarks: true,
        paxName: true,
        paxMobile: true,
        operatorName: true,
        all: true
    });

    const toggleColumn = (column) => {
        if (column === 'all') {
            const newValue = !columnVisibility.all;
            const newVisibility = {};
            Object.keys(columnVisibility).forEach(key => {
                newVisibility[key] = newValue;
            });
            setColumnVisibility(newVisibility);
        } else {
            setColumnVisibility({
                ...columnVisibility,
                [column]: !columnVisibility[column]
            });
        }
    };

    const handleExport = () => {
        alert('Exporting data to Excel...');
    };

    const filteredData = mockData.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div>

            <div className="relative max-w-7xl mx-auto z-888">
                {/* Header */}
                <div className="bg-[#78080B] rounded-t-xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-white tracking-wide">ACCOUNT STATEMENT</h1>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-b-xl shadow-xl">
                    {/* Tabs */}
                    {/* <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('wallet')}
                            className={`px-8 py-4 font-semibold transition-all ${activeTab === 'wallet'
                                ? 'text-teal-600 border-b-3 border-teal-600 bg-teal-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            WALLET
                        </button>
                        <button
                            onClick={() => setActiveTab('flight')}
                            className={`px-8 py-4 font-semibold transition-all ${activeTab === 'flight'
                                ? 'text-teal-600 border-b-3 border-teal-600 bg-teal-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            FLIGHT WALLET
                        </button>
                    </div> */}

                    <div className="p-6">
                        {/* Statement Type */}
                        {/* <div className="flex items-center gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="statementType"
                                    value="mini"
                                    checked={statementType === 'mini'}
                                    onChange={(e) => setStatementType(e.target.value)}
                                    className="w-4 h-4 text-teal-600"
                                />
                                <span className="font-medium text-gray-700">Mini Statement</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="statementType"
                                    value="statement"
                                    checked={statementType === 'statement'}
                                    onChange={(e) => setStatementType(e.target.value)}
                                    className="w-4 h-4 text-teal-600"
                                />
                                <span className="font-medium text-gray-700">Statement</span>
                            </label>
                        </div> */}

                        {/* Balance Info */}
                        {/* <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 mb-6 border border-teal-200">
                            <div className="flex flex-wrap gap-6 text-sm font-medium">
                                <span className="text-gray-700">Flight Wallet = <span className="text-teal-700 font-bold">₹346,159.06</span></span>
                                <span className="text-gray-700">OD Given = <span className="text-teal-700 font-bold">₹0.00</span></span>
                                <span className="text-gray-700">Outstanding Amount = <span className="text-teal-700 font-bold">₹0.00</span></span>
                            </div>
                        </div> */}

                        {/* Date Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                >
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex items-end">
                                <button className="w-full bg-[#78080B] text-white px-6 py-2.5 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Fetch
                                </button>
                            </div>
                        </div>

                        {/* Column Visibility Controls */}
                        <div className="mb-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 text-[#78080B] font-medium hover:text-[#a54040] transition-colors mb-3"
                            >
                                <Filter size={18} />
                                {showFilters ? 'Hide' : 'Show'} Column Filters
                                <ChevronDown size={18} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {showFilters && (
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {Object.entries(columnVisibility).map(([key, value]) => (
                                            <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={() => toggleColumn(key)}
                                                    className="w-4 h-4 text-teal-600 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search and Controls */}
                        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                            <div className="flex-1 max-w-md relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search By..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Show</label>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => setRowsPerPage(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 bg-[#78080B] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-red-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    <Download size={18} />
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <table className="w-full min-w-[1400px]">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">S.NO</th>
                                        {columnVisibility.dateTime && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">DATE TIME</th>}
                                        {columnVisibility.subRetailerId && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">SUB RETAILER ID</th>}
                                        {columnVisibility.subRetailerName && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">SUB RETAILER NAME</th>}
                                        {columnVisibility.retailerName && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">RETAILER NAME</th>}
                                        {columnVisibility.userName && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">USER NAME</th>}
                                        {columnVisibility.referenceNo && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">REFERENCE NO.</th>}
                                        {columnVisibility.supplierRefNo && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">SUPPLIER REF NO.</th>}
                                        {columnVisibility.productName && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">PRODUCT NAME</th>}
                                        {columnVisibility.description && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">DESCRIPTION</th>}
                                        {columnVisibility.debit && <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">DEBIT</th>}
                                        {columnVisibility.credit && <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">CREDIT</th>}
                                        {columnVisibility.balance && <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">BALANCE</th>}
                                        {columnVisibility.userRemarks && <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">USER REMARKS</th>}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredData.map((row, index) => (
                                        <tr key={row.id} className="hover:bg-teal-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">{index + 1}</td>
                                            {columnVisibility.dateTime && <td className="px-4 py-3 text-sm text-gray-700">{row.dateTime}</td>}
                                            {columnVisibility.subRetailerId && <td className="px-4 py-3 text-sm text-gray-700">{row.subRetailerId}</td>}
                                            {columnVisibility.subRetailerName && <td className="px-4 py-3 text-sm text-gray-700">{row.subRetailerName}</td>}
                                            {columnVisibility.retailerName && <td className="px-4 py-3 text-sm text-gray-700">{row.retailerName}</td>}
                                            {columnVisibility.userName && <td className="px-4 py-3 text-sm text-gray-700">{row.userName}</td>}
                                            {columnVisibility.referenceNo && <td className="px-4 py-3 text-sm text-blue-600 font-medium">{row.referenceNo}</td>}
                                            {columnVisibility.supplierRefNo && <td className="px-4 py-3 text-sm text-gray-700">{row.supplierRefNo}</td>}
                                            {columnVisibility.productName && <td className="px-4 py-3 text-sm text-gray-700">{row.productName}</td>}
                                            {columnVisibility.description && <td className="px-4 py-3 text-sm text-gray-700">{row.description}</td>}
                                            {columnVisibility.debit && <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">{row.debit}</td>}
                                            {columnVisibility.credit && <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">{row.credit}</td>}
                                            {columnVisibility.balance && <td className="px-4 py-3 text-sm text-right text-gray-900 font-bold">{row.balance}</td>}
                                            {columnVisibility.userRemarks && <td className="px-4 py-3 text-sm text-gray-700">{row.userRemarks}</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Info */}
                        <div className="mt-4 flex justify-between items-center text-sm text-[#78080B]">
                            <span>Showing 1 to {filteredData.length} of {filteredData.length} entries</span>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-[#78080B] rounded-lg hover:bg-gray-50 transition-colors">Previous</button>
                                <button className="px-4 py-2 bg-[#78080B] text-white rounded-lg font-medium">1</button>
                                <button className="px-4 py-2 border border-[#78080B] rounded-lg hover:bg-gray-50 transition-colors">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statement;