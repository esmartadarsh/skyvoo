import { Pencil } from "lucide-react";

function MobileSearchSummary({ onEdit }) {

    return (
        <div className="lg:hidden filterglasseffect rounded-xl shadow-sm px-4 py-3 mb-2  cursor-pointer active:scale-[0.98] transition-transform" style={{ zIndex: 2 }} >
            <div className="grid grid-cols-[1fr_auto] gap-3 items-center">

                {/* Search Summary */}
                <div className="flex flex-col">
                    <span className="text-xs xs:text-sm font-semibold text-gray-900">
                        New Delhi → Mumbai
                    </span>
                    <span className="text-xs xs:text-sm text-gray-600">
                        16 Jan · 1 Adult · Economy
                    </span>
                </div>

                {/* Edit Action */}
                <div className="flex flex-col items-center gap-1 text-xs xs:text-sm font-medium text-[#78080B]">
                    <Pencil button size={16} onClick={() => onEdit(true)} />
                    <span>Edit</span>
                </div>

            </div>
        </div>
    )
}

export default MobileSearchSummary;