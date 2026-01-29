import React from 'react';

const ProfileStats = React.memo(({ stats }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group shadow-xl relative bg-white backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 border-3 hover:border-black transition-[background,transform,box-shadow] duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                            <div className={`w-12 h-12 bg-[#78080B] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>

                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
            ))}
        </div>
    );
});

export default ProfileStats;
