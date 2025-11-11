export default async function getCroppedImg(imageSrc, crop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const size = Math.min(crop.width, crop.height);
    canvas.width = size;
    canvas.height = size;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.clip();

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        size,
        size
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
    });
}

function createImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (error) => reject(error));
        img.src = url;
    });
}
