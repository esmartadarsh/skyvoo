import React from "react";

const Button = ({
    children,
    onClick,
    className = "",
    type = "button",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full sm:w-auto bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium px-6 py-2.5 rounded-full flex items-center justify-center gap-2 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;