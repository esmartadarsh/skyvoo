import React from 'react';
import { Bell, Shield, ChevronRight } from 'lucide-react';

const SettingsPanel = () => {
    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
                <h3 className="text-3xl font-bold mb-2">Account Settings</h3>
                <p className="text-gray-400">Manage your preferences and security</p>
            </div>

            <div className="space-y-6">
                {/* Notifications */}
                <Section icon={Bell} title="Notifications">
                    <Toggle
                        label="Email notifications"
                        description="Receive flight updates via email"
                        defaultChecked
                    />
                    <Toggle
                        label="SMS notifications"
                        description="Get text alerts for bookings"
                    />
                    <Toggle
                        label="Push notifications"
                        description="Mobile app notifications"
                    />
                </Section>

                {/* Security */}
                <Section icon={Shield} title="Security & Privacy">
                    <Action label="Change Password" />
                    <Action label="Two-Factor Authentication" />
                    <Action label="Privacy Settings" />
                </Section>

                {/* Danger zone */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <button className="px-6 py-3 bg-red-800 hover:bg-red-500 border border-red-500/50 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ---------- Reusable pieces ---------- */

const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
            <Icon className="w-7 h-7 text-[#78080B]" />
            <h4 className="font-bold text-lg">{title}</h4>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const Toggle = ({ label, description, defaultChecked }) => (
    <label
        key={label}
        className="flex items-center justify-between cursor-pointer group"
    >
        <div>
            <p className="font-medium group-hover:text-[#a54040] transition-colors">
                {label}
            </p>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>

        {/* Custom Switch */}
        <div className="relative">
            <input
                type="checkbox"
                defaultChecked={defaultChecked}
                className="sr-only peer"

            />
            <div className="w-12 h-6 bg-white/10 border border-white/20 rounded-full peer-checked:bg-[#a54040] transition-all duration-300"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-6"></div>
        </div>
    </label>
);


const Action = ({ label }) => (
    <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300 flex items-center justify-between group">
        <span className="font-medium group-hover:text-[#a54040] transition-colors">
            {label}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </button>
);

export default React.memo(SettingsPanel);
