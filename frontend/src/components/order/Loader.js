import React from 'react';

const Loader = () => {
    const loaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full screen height
    };

    const spinnerStyle = {
        width: '3rem',
        height: '3rem',
    };

    return (
        <div style={loaderStyle}>
            <div className="spinner-border" role="status" style={spinnerStyle}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
