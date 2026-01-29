import React from 'react';
import Cropper from 'react-easy-crop';

const ImageCropModal = ({
    imageSrc,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    onCancel,
    onConfirm
}) => {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-9999 p-4">
            <div className="bg-slate-900 rounded-2xl p-4 w-full max-w-md">
                <div className="relative w-full h-72 rounded-xl overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>

                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full mt-4"
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onCancel} className="text-gray-300">Cancel</button>
                    <button
                        onClick={onConfirm}
                        className="bg-amber-500 px-4 py-2 rounded-xl text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ImageCropModal);
