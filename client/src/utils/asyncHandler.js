const asyncHandler = (requestHandler) => (...args) =>
    Promise.resolve(requestHandler(...args))
        .catch((err) => {
            console.log("Error in asyncHandler", err.response.data);
            const api = args[1];
            if (api?.rejectWithValue) {
                return api.rejectWithValue(
                    err?.response?.data?.message || err?.message || "Some error occurred"
                );
            }
        })

export {
    asyncHandler
}