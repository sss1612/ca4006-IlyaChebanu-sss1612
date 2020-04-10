export const QUERY_FILTER = "query/QUERY_FILTER";

export const actions = {
    queryFilter: filterProps => ({
        type: QUERY_FILTER,
        payload: filterProps
    }),
}
