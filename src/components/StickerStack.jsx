import React, { useState, useRef, useEffect } from "react";
import offer3 from "@/assets/imgs/offer3.webp";
import offer2 from "@/assets/imgs/offer2.webp";
import offer1 from "@/assets/imgs/offer.jpg";
import MoveUpRightArrow from "@/assets/vectors/MoveUpRightArrow.svg";

const images = [offer1, offer2, offer3];


function Sticker({ frontIndex, underIndex, onPeeled }) {
    const [peeled, setPeeled] = useState(false);
    const [instantReset, setInstantReset] = useState(false);
    const [visible, setVisible] = useState(true);
    const hasCalledOnPeeled = useRef(false);

    const peel = () => { if (!peeled) setPeeled(true); };

    const handleKey = e => {
        if ((e.key === "Enter" || e.key === " ") && !peeled) {
            e.preventDefault();
            peel();
        }
    };

    const handleTransitionEnd = e => {
        if (
            peeled &&
            e.propertyName.includes("transform") &&
            !hasCalledOnPeeled.current
        ) {
            hasCalledOnPeeled.current = true;

            // 🔹 Step 1: fade out peeled sticker
            setVisible(false);

            // Wait for fade-out to complete before resetting
            setTimeout(() => {
                // 🔹 Step 2: update image indexes
                onPeeled();

                // Hide & instantly reset peel state while invisible
                setInstantReset(true);
                setPeeled(false);

                // Let the DOM apply the reset silently (still opacity 0)
                requestAnimationFrame(() => {
                    setInstantReset(false);
                    hasCalledOnPeeled.current = false;

                    // 🔹 Step 3: fade back in AFTER reposition is done
                    requestAnimationFrame(() => {
                        setVisible(true);
                    });
                });
            }, 300); // match your fade-out duration
        }
    };



    useEffect(() => {
        const interval = setInterval(() => {
            if (!peeled) {
                setPeeled(true);
            }
        }, 3000); // every 3 seconds

        return () => clearInterval(interval);
    }, [peeled]);


    return (
        <>
            <div className="sticker-underneath">
                <div className="relative -top-[25px] -right-[10px] h-[95%] w-[95%]  bg-[#D9D9D9] rounded-2xl shadow-lg p-5"></div>
                <div className="sticker__holder">

                    <div className="sticker__content rounded-xl" style={{ background: `url(${images[underIndex]}) center/cover` }} >
                        <div className="sticker__shadow" />
                    </div>

                </div>
            </div>

            <div
                className={`sticker ${peeled ? "is-peeled" : ""} ${instantReset ? "instant-reset" : ""}`}
                role="button"
                onClick={peel}
                onKeyDown={handleKey}
                onTransitionEnd={handleTransitionEnd}
                style={{
                    // opacity: visible ? 1 : 0,
                    // transition: "opacity ease-in",
                }}
            >
                <div className="sticker__face sticker__face--front">
                    <div className="sticker__holder">
                        <div className="sticker__content rounded-xl" style={{ background: `url(${images[frontIndex]}) center/cover` }} >
                            <div className="absolute top-2 right-2 z-50 bg-black text-white rounded-full p-1 flex items-center justify-center">
                                <img src={MoveUpRightArrow} alt="arrow" className="w-3 h-3" />
                            </div>
                            <div className="sticker__shadow" />
                        </div>
                    </div>
                </div>

                <div className="sticker__face sticker__face--back">
                    <div className="sticker__holder">
                        <div className="sticker__content">
                            <div className="sticker__shadow" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function StickerStack() {
    const [frontIndex, setFrontIndex] = useState(0);
    const [underIndex, setUnderIndex] = useState(1);

    const handlePeeled = () => {
        const nextUnderIndex = (underIndex + 1) % images.length;
        setFrontIndex(underIndex);
        setUnderIndex(nextUnderIndex);
    };

    return (
        <>
            {/* <div className="relative  overflow-hidden"></div> */}
            <div className="wrapper relative">
                <Sticker
                    frontIndex={frontIndex}
                    underIndex={underIndex}
                    onPeeled={handlePeeled}
                />
                <div className="help">click or press Enter/Space to peel</div>
            </div>
        </>
    );
}
