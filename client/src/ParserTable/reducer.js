export default (state, { payload, direction, search, minPrice, maxPrice, minPercent, maxPercent, btsSales, btsDays  }) => {
    let newState = payload;
    minPrice = minPrice === "" ? Number.MIN_SAFE_INTEGER : minPrice;
    maxPrice = maxPrice === "" ? Number.MAX_SAFE_INTEGER : maxPrice;
    minPercent = minPercent === "" ? Number.MIN_SAFE_INTEGER : minPercent;
    maxPercent = maxPercent === "" ? Number.MAX_SAFE_INTEGER : maxPercent;
    if (search !== "") {
        newState = newState.slice().filter(i => i.name.toLowerCase().includes(search.toLowerCase().trim()));
    }
    if (direction.from !== "" && direction.to !== "") {
        const newItems = [];
        let from, to;
        for (let i of newState) {

            // from
            if (direction.from === "SM") {
                from = i.steam.sell_price;
            } else if (direction.from === "BTS") {
                from = i.bts.lowest_price;
            } else if (direction.from === "C5") {
                from = i.c5.price;
            } else if (direction.from === "C5(A)") {
                from = i.c5.buy_offer;
            } else if (direction.from === "BTS-AVG") {
                from = i.bts_avg.avg;
            }

            // to
            if (direction.to === "SM") {
                to = i.steam.sell_price - (i.steam.sell_price / 100) * 13;
            } else if (direction.to === "BTS") {
                to = i.bts.lowest_price - (i.bts.lowest_price / 100) * 4.85;
            } else if (direction.to === "C5") {
                to = (i.c5.price / 100) * 1.8 < 300 ? i.c5.price - (i.c5.price / 100) * 1.8 : i.c5.price - 300;
            } else if (direction.to === "C5(A)") {
                to = (i.c5.buy_offer / 100) * 1.8 < 300 ? i.c5.buy_offer - (i.c5.buy_offer / 100) * 1.8 : i.c5.buy_offer - 300;
            } else if (direction.to === "BTS-AVG") {
                to = i.bts_avg.avg - (i.bts_avg.avg / 100) * 4.85;
            }

            if (typeof from !== "string" && from > 0 && typeof to !== "string" && to > 0 && from > minPrice && from < maxPrice) {
                i.percent = Math.round(((to - from) / from) * 100 * 100) / 100;
                if (i.percent > minPercent && i.percent < maxPercent) {
                    newItems.push(i);
                }
            }
        }
        newState = newItems.sort((a, b) => (a.percent < b.percent ? 1 : b.percent < a.percent ? -1 : 0));
    }
    return newState;
};
