function parseHighscoreFilters(rawFilters) {
    const filters = {};
    if (rawFilters.length !== undefined && rawFilters.length !== "") {
        const parsedLength = parseInt(String(rawFilters.length), 10);
        if (Number.isNaN(parsedLength) || parsedLength <= 0) {
            throw new Error("length must be a positive number");
        }
        filters.length = parsedLength;
    }
    if (rawFilters.unique === "true") {
        filters.unique = true;
    }
    else if (rawFilters.unique === "false") {
        filters.unique = false;
    }
    return filters;
}
export default parseHighscoreFilters;
