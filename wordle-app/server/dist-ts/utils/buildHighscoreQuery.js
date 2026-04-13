function buildHighscoreQuery(filters) {
    const query = {};
    if (filters.length !== undefined) {
        query.length = filters.length;
    }
    if (filters.unique !== undefined) {
        query.unique = filters.unique;
    }
    return query;
}
export default buildHighscoreQuery;
