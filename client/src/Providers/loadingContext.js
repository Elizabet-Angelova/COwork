import React, { createContext } from 'react';

const LoadingContext = createContext({
    loading: true,
    setLoading: () => {}
})

export default LoadingContext;