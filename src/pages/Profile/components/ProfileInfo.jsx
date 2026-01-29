import React from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { maskPassport } from '@/utils/maskPassport';

const ProfileInfo = ({
    profileFields,
    userData,
    editData,
    isEditing,
    handleChange,
    handleEdit,
    handleSave,
    handleCancel,
}) => {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-3xl font-bold mb-2">Personal Information</h3>
                    <p className="text-gray-400">Manage your account details</p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-6 py-3 bg-[#78080B] text-white rounded-xl shadow-lg hover:shadow-[#78080B]"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="font-medium">Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg"
                        >
                            <Save className="w-4 h-4" />
                            <span className="font-medium">Save</span>
                        </button>

                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border-2 border-[#78080B] text-[#78080B] rounded-xl hover:bg-white/10"
                        >
                            <X className="w-4 h-4" />
                            <span className="font-medium">Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profileFields.map((field) => (
                    <div key={field.name} className="group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-3">
                            <field.icon className="w-4 h-4 text-amber-400" />
                            <span>{field.label}</span>
                        </label>

                        {isEditing ? (
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={editData[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition"
                            />
                        ) : (
                            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition">
                                {field.name === 'passportNumber'
                                    ? maskPassport(userData.passportNumber)
                                    : userData[field.name]}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(ProfileInfo);
