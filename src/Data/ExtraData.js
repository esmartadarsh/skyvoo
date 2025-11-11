const wheelchairOptions = [
    { name: "Unable to ascend and descend steps", code: "WCHS", price: "Free" },
    { name: "Unable to walk long distance", code: "WCHR", price: "Free" },
    { name: "Paraplegic", code: "WCHC", price: "Free" },
];

const mealsOptions = [
    { name: "Veg Sandwich", code: "VGSW", price: "Free" },
    { name: "Veg Meal", code: "VGML", price: "Free" },
    { name: "Vegetable Daliya", code: "VCC6", price: "Free" },
    { name: "Vegetable Pasta in Neapolitan sauce", code: "VCC5", price: "Free" },
    { name: "Vegtable in Red Thai Curry with Steamed Rice", code: "VCC2", price: "Free" },
    { name: "Non-Veg Sandwich", code: "NVSW", price: "Free" },
    { name: "Non-Veg Meal", code: "NVML", price: "Free" },
    { name: "Chicken schezwan on bed of fried rice", code: "NCC6", price: "Free" },
    { name: "Steamed rice with Tawa Fish masala and tadka masoor dal", code: "NCC5", price: "Free" },
    { name: "Tandoori Chicken tangri with chicken haryali tikka", code: "NCC4", price: "Free" },
    { name: "Steamed Rice with Chicken in Red Thai Curry", code: "NCC2", price: "Free" },
    { name: "Yellow Rice with Grilled Chicken", code: "NCC1", price: "Free" },
    { name: "Jain Hot Meal", code: "JNML", price: "Free" },
    { name: "Vegetarian Gluten-free Hot Meal", code: "GFVG", price: "Free" },
    { name: "Non - Vegetarian Gluten-free Hot Meal", code: "GFNV", price: "Free" },
    { name: "Vegetarian Gluten-free Cold Meal (Dhokla)", code: "GFCM", price: "Free" },
    { name: "Fruit Platter", code: "FPML", price: "Free" },
    { name: "Non - Vegetarian Diabetic Hot Meal", code: "DNVL", price: "Free" },
    { name: "Vegetarian Diabetic Hot Meal", code: "DBML", price: "Free" },
    { name: "Low cal salad Vegetarian", code: "LCVS", price: "₹244" },
    { name: "Low cal salad Non - Vegetarian", code: "LCNS", price: "₹244" },
];

const priorityBaggageOptions = [
    { name: "Bagout First 1 Bag", code: "BOF1", price: "₹100" },
    { name: "Bagout First 2 Bags", code: "BOF2", price: "₹200" },
    { name: "Bagout First 3 Bags", code: "BOF3", price: "₹300" },
];

const fastForwardOptions = [
    { name: "Priority Check In", code: "PRCP", price: "₹300" }
];

const extraBaggage = [
    { name: "Prepaid Excess Baggage 5kg", code: "EB05", price: "₹1900" },
    { name: "Prepaid Excess Baggage 10kg", code: "EB10", price: "₹3800" },
    { name: "Prepaid Excess Baggage 15kg", code: "EB15", price: "₹5700" },
    { name: "Prepaid Excess Baggage 20kg", code: "EB20", price: "₹7600" },
    { name: "Prepaid Excess Baggage 30kg", code: "EB30", price: "₹11400" },
];

const SSRTypes = ['Baggage', 'Meals', 'Complimentary Meals', 'Seat', 'Sports', 'BagOutFirst', 'Lounge', 'Celebration', 'CarryMore', 'FastForward', 'Wheelchair', 'FrequentFlyer', 'Others', 'Extra Legroom'];



const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

export { wheelchairOptions, mealsOptions, priorityBaggageOptions, fastForwardOptions, extraBaggage, SSRTypes, seatLetters }