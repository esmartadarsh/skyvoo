import React, { useState } from "react";
import { Briefcase, Plane, Check } from "lucide-react";



export default function BaggageModal({
  onClose,
  baggageList = [],
  routeLabel = "",
  travellerInfo = null,
  initialSelectedBaggage = [],
  onSave,
}) {
  // Flatten all BaggageList entries from all segments and deduplicate
  const apiItems = baggageList.flatMap((seg) => seg.BaggageList ?? []);
  const uniqueApiItems = [];
  const seenIds = new Set();
  apiItems.forEach(item => {
    const id = item.SSRKey || item.Code || item.Description;
    if (id && !seenIds.has(id)) {
      seenIds.add(id);
      uniqueApiItems.push(item);
    }
  });
  const allItems = uniqueApiItems.length > 0 ? uniqueApiItems : [];

  const [selectedItems, setSelectedItems] = useState(initialSelectedBaggage || []);

  const getItemId = (item) => item.SSRKey || item.Code || item.Description;

  const isSelected = (item) => {
    const id = getItemId(item);
    return selectedItems.some((s) => getItemId(s) === id);
  };

  const toggleItem = (item) => {
    if (isSelected(item)) {
      // Deselect if already selected
      setSelectedItems([]);
    } else {
      // Replace any existing selection — only 1 allowed
      setSelectedItems([item]);
    }
  };

  const totalTravellerCost = selectedItems.reduce(
    (sum, item) => sum + (Number(item.Amount) || 0),
    0
  );

  const travellerDisplayName = travellerInfo
    ? [travellerInfo.firstName, travellerInfo.lastName].filter(Boolean).join(" ") ||
    travellerInfo.label
    : "Traveller";

  const handleSave = () => {
    if (onSave) {
      onSave(selectedItems);
    }
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        bg-black/50
        flex items-center justify-center
        px-2 sm:px-4
      "
      onClick={onClose}
    >
      <div
        className="p-6 sm:p-8 bg-white shadow-xl w-full sm:max-w-lg lg:max-w-xl rounded-2xl max-h-[90vh] flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Add Extra Baggage
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Selection for: <span className="text-[#78080B] font-semibold">{travellerDisplayName}</span>
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-black text-xl font-bold p-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Flight Info */}
        {routeLabel && (
          <div className="bg-blue-600 text-white p-3 rounded-lg mt-3 flex items-center gap-3">
            <Plane size={18} className="shrink-0" />
            <div>
              <div className="font-semibold text-xs sm:text-sm">
                {routeLabel}
              </div>
              <div className="text-[11px] text-blue-100">
                Select one extra baggage option only
              </div>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex-1 overflow-y-auto pb-2 space-y-3 mt-4 p-1">
          {allItems.map((item) => {
            const selected = isSelected(item);
            return (
              <BaggageOption
                key={getItemId(item)}
                item={item}
                isSelected={selected}
                onToggle={() => toggleItem(item)}
              />
            );
          })}
        </div>

        {/* Footer Summary & Save CTA */}
        <div className="border-t pt-4 mt-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {selectedItems.length} {selectedItems.length === 1 ? "option" : "options"} selected
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900">
              Total: ₹ {totalTravellerCost.toLocaleString("en-IN")}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#78080B] hover:bg-[#5c0608] text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition"
          >
            Apply Baggage
          </button>
        </div>
      </div>
    </div>
  );
}

function BaggageOption({ item, isSelected, onToggle }) {
  const { Description, Amount } = item;
  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer flex items-center justify-between gap-3 p-3.5 sm:p-4 border rounded-xl transition ${isSelected
        ? "border-[#78080B] bg-red-50/40 ring-1 ring-[#78080B]"
        : "border-slate-200 hover:border-slate-300 bg-white"
        }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Briefcase
          size={20}
          className={isSelected ? "text-[#78080B] shrink-0" : "text-slate-400 shrink-0"}
        />
        <span className="text-xs sm:text-sm font-medium text-slate-800 capitalize truncate">
          {Description.toLowerCase()}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-bold text-sm sm:text-base text-slate-900 whitespace-nowrap">
          ₹ {Amount?.toLocaleString("en-IN")}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${isSelected
            ? "bg-[#78080B] text-white shadow-sm"
            : "border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
        >
          {isSelected ? (
            <>
              <Check size={14} /> Added
            </>
          ) : (
            "Add"
          )}
        </button>
      </div>
    </div>
  );
}

