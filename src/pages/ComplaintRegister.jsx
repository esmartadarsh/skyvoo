import React, { useState } from 'react'
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Plus, Upload, X, Image as ImageIcon } from 'lucide-react'
import Header from '@/components/layout/Header';
import GrayFadedBg from '@/assets/imgs/grayfadedbg.webp';

function ComplaintRegister() {

    const [complaints, setComplaints] = useState([
        {
            id: 'CMP001',
            passengerName: 'Adarsh Joshi',
            flightNumber: 'AI202',
            date: '2024-11-08',
            category: 'Baggage',
            subject: 'Lost Baggage',
            description: 'My checked baggage did not arrive on flight AI202 from Delhi to Mumbai.',
            status: 'In Progress',
            priority: 'High',
            assignedTo: 'Sarah Johnson'
        },
        {
            id: 'CMP002',
            passengerName: 'Joshi Adarsh',
            flightNumber: 'AI145',
            date: '2024-11-09',
            category: 'Flight Delay',
            subject: 'Delayed Flight Without Notice',
            description: 'Flight was delayed by 3 hours with no prior communication.',
            status: 'Resolved',
            priority: 'Medium',
            assignedTo: 'Mike Chen'
        },
        {
            id: 'CMP003',
            passengerName: 'Testing Adarsh',
            flightNumber: 'AI567',
            date: '2024-11-10',
            category: 'Service',
            subject: 'Rude Staff Behavior',
            description: 'Ground staff at check-in counter was extremely rude and unhelpful.',
            status: 'Open',
            priority: 'Low',
            assignedTo: 'Unassigned'
        },
        {
            id: 'CMP004',
            passengerName: 'Testing Joshi',
            flightNumber: 'AI789',
            date: '2024-11-10',
            category: 'Refund',
            subject: 'Pending Refund for Cancelled Flight',
            description: 'Flight was cancelled but refund has not been processed after 15 days.',
            status: 'In Progress',
            priority: 'High',
            assignedTo: 'Sarah Johnson'
        },
        {
            id: 'CMP005',
            passengerName: 'Adarsh Testing Joshi',
            flightNumber: 'AI789',
            date: '2024-11-10',
            category: 'Refund',
            subject: 'Pending Refund for Cancelled Flight',
            description: 'Flight was cancelled but refund has not been processed after 15 days.',
            status: 'In Progress',
            priority: 'High',
            assignedTo: 'Sarah Johnson'
        },
        {
            id: 'CMP006',
            passengerName: 'Testing Adarsh Joshi',
            flightNumber: 'AI321',
            date: '2024-11-11',
            category: 'In-Flight',
            subject: 'Broken Entertainment System',
            description: 'In-flight entertainment system was not working throughout the 5-hour flight.',
            status: 'Closed',
            priority: 'Low',
            assignedTo: 'Mike Chen'
        },
        {
            id: 'CMP007',
            passengerName: 'Joshi Adarsh Testing',
            flightNumber: 'AI321',
            date: '2024-11-11',
            category: 'In-Flight',
            subject: 'Broken Entertainment System',
            description: 'In-flight entertainment system was not working throughout the 5-hour flight.',
            status: 'Closed',
            priority: 'Low',
            assignedTo: 'Mike Chen'
        },
        {
            id: 'CMP008',
            passengerName: 'Flight Adarsh',
            flightNumber: 'AI321',
            date: '2024-11-11',
            category: 'In-Flight',
            subject: 'Broken Entertainment System',
            description: 'In-flight entertainment system was not working throughout the 5-hour flight.',
            status: 'Closed',
            priority: 'Low',
            assignedTo: 'Mike Chen'
        },
        {
            id: 'CMP005',
            passengerName: 'Adarsh Flight',
            flightNumber: 'AI321',
            date: '2024-11-11',
            category: 'In-Flight',
            subject: 'Broken Entertainment System',
            description: 'In-flight entertainment system was not working throughout the 5-hour flight.',
            status: 'Closed',
            priority: 'Low',
            assignedTo: 'Mike Chen'
        },
    ])

    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [filterStatus, setFilterStatus] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [showRegisterForm, setShowRegisterForm] = useState(false)

    const [newComplaint, setNewComplaint] = useState({
        passengerName: '',
        flightNumber: '',
        category: 'Baggage',
        subject: '',
        description: '',
        priority: 'Medium',
        photo: null,
        photoPreview: null
    })

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700'
            case 'In Progress': return 'bg-yellow-100 text-yellow-700'
            case 'Resolved': return 'bg-green-100 text-green-700'
            case 'Closed': return 'bg-gray-100 text-gray-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600'
            case 'Medium': return 'text-orange-600'
            case 'Low': return 'text-blue-600'
            default: return 'text-gray-600'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <AlertCircle className="w-4 h-4" />
            case 'In Progress': return <Clock className="w-4 h-4" />
            case 'Resolved': return <CheckCircle className="w-4 h-4" />
            case 'Closed': return <XCircle className="w-4 h-4" />
            default: return <AlertCircle className="w-4 h-4" />
        }
    }

    const filteredComplaints = complaints.filter(complaint => {
        const matchesStatus = filterStatus === 'All' || complaint.status === filterStatus
        const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const handleRegisterComplaint = (e) => {
        e.preventDefault()

        const complaintId = `CMP${String(complaints.length + 1).padStart(3, '0')}`
        const today = new Date().toISOString().split('T')[0]

        const complaint = {
            id: complaintId,
            passengerName: newComplaint.passengerName,
            flightNumber: newComplaint.flightNumber,
            date: today,
            category: newComplaint.category,
            subject: newComplaint.subject,
            description: newComplaint.description,
            status: 'Open',
            priority: newComplaint.priority,
            assignedTo: 'Unassigned',
            photo: newComplaint.photo
        }

        setComplaints([complaint, ...complaints])
        setShowRegisterForm(false)
        setNewComplaint({
            passengerName: '',
            flightNumber: '',
            category: 'Baggage',
            subject: '',
            description: '',
            priority: 'Medium',
            photo: null,
            photoPreview: null
        })

        // Show success message
        alert('Complaint submitted successfully!')
    }

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB')
                return
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setNewComplaint({
                    ...newComplaint,
                    photo: file,
                    photoPreview: reader.result
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const removePhoto = () => {
        setNewComplaint({
            ...newComplaint,
            photo: null,
            photoPreview: null
        })
    }

    const statusCounts = {
        All: complaints.length,
        Open: complaints.filter(c => c.status === 'Open').length,
        'In Progress': complaints.filter(c => c.status === 'In Progress').length,
        Resolved: complaints.filter(c => c.status === 'Resolved').length,
        Closed: complaints.filter(c => c.status === 'Closed').length
    }

    return (
        <>
            <div>
                <div className="bg-[#78080B] shadow-sm border-b border-gray-200 relative z-900">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex justify-start items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Complaint Register</h1>
                                <p className="text-sm text-white mt-1">Manage and track customer complaints</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8 relative z-900">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((status) => (
                            <div
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`bg-white rounded-xl p-5 cursor-pointer transition-all duration-200 ${filterStatus === status
                                    ? 'ring-2 ring-blue-500 shadow-lg'
                                    : 'hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{status}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts[status]}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${getStatusColor(status)}`}>
                                        {getStatusIcon(status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-t-xl shadow-sm p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, passenger name, or flight number..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setShowRegisterForm(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#78080B] text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                Register Complaint
                            </button>
                        </div>
                    </div>

                    {/* Complaints Table */}
                    <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Passenger</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Flight</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredComplaints.map((complaint) => (
                                        <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-medium text-gray-900">{complaint.id}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-gray-700">{complaint.passengerName}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="font-mono text-sm text-gray-600">{complaint.flightNumber}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{complaint.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-700">{complaint.subject}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{complaint.date}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                                                    {complaint.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                                    {getStatusIcon(complaint.status)}
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedComplaint(complaint)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* Register Complaint Modal */}
            {showRegisterForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-9999">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Register New Complaint</h2>
                                    <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                                </div>
                                <button
                                    onClick={() => setShowRegisterForm(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleRegisterComplaint} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Passenger Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newComplaint.passengerName}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, passengerName: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="Enter passenger name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Flight Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newComplaint.flightNumber}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, flightNumber: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="e.g., AI202"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={newComplaint.category}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Baggage">Baggage</option>
                                        <option value="Flight Delay">Flight Delay</option>
                                        <option value="Service">Service</option>
                                        <option value="Refund">Refund</option>
                                        <option value="In-Flight">In-Flight</option>
                                        <option value="Booking">Booking</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={newComplaint.priority}
                                        onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newComplaint.subject}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    value={newComplaint.description}
                                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Provide detailed information about your complaint..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Photo (Optional)
                                </label>

                                {!newComplaint.photoPreview ? (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 bg-gray-50"
                                        >
                                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600 font-medium">Click to upload photo</p>
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                                        <img
                                            src={newComplaint.photoPreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <ImageIcon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{newComplaint.photo?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                >
                                    Submit Complaint
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRegisterForm(false)
                                        setNewComplaint({
                                            passengerName: '',
                                            flightNumber: '',
                                            category: 'Baggage',
                                            subject: '',
                                            description: '',
                                            priority: 'Medium',
                                            photo: null,
                                            photoPreview: null
                                        })
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Complaint Detail Modal */}
            {
                selectedComplaint && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-9999">
                        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Complaint Details</h2>
                                        <p className="text-sm text-gray-500 mt-1">{selectedComplaint.id}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedComplaint(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Passenger Name</p>
                                        <p className="text-base text-gray-900 mt-1">{selectedComplaint.passengerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Flight Number</p>
                                        <p className="text-base text-gray-900 mt-1 font-mono">{selectedComplaint.flightNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date</p>
                                        <p className="text-base text-gray-900 mt-1">{selectedComplaint.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                        <p className="text-base text-gray-900 mt-1">{selectedComplaint.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Priority</p>
                                        <p className={`text-base font-medium mt-1 ${getPriorityColor(selectedComplaint.priority)}`}>
                                            {selectedComplaint.priority}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedComplaint.status)}`}>
                                            {getStatusIcon(selectedComplaint.status)}
                                            {selectedComplaint.status}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Subject</p>
                                    <p className="text-base text-gray-900 mt-1 font-medium">{selectedComplaint.subject}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <p className="text-base text-gray-700 mt-1 leading-relaxed">{selectedComplaint.description}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                                    <p className="text-base text-gray-900 mt-1">{selectedComplaint.assignedTo}</p>
                                </div>

                                {selectedComplaint.photo && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Attached Photo</p>
                                        <div className="rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={selectedComplaint.photoPreview || (selectedComplaint.photo instanceof File ? URL.createObjectURL(selectedComplaint.photo) : selectedComplaint.photo)}
                                                alt="Complaint evidence"
                                                className="w-full h-auto max-h-96 object-contain bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                                <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Update Status
                                </button>
                                <button className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                                    Add Comment
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ComplaintRegister