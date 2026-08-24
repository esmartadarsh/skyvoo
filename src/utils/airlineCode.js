const logos = import.meta.glob('../assets/imgs/AirlinesLogos/*.png', {
    eager: true,
    import: 'default'
});

export const getAirlineLogo = (code) => {
    const path = `../assets/imgs/AirlinesLogos/${code}.png`;
    const logo = logos[path];

    return logo;
};