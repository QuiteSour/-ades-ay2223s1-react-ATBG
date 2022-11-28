import React from 'react';
import '../../css/ErrorPage.css'

function ServerErrScreen() {
    return(
        <main className='errorScreen'>
            <h1>500 Interval Server Error</h1>
            <h2>Seems like an error occured on our end...</h2>
            <button className='errBtn' onClick={() => window.location.href='/'}>Return Home</button>
        </main>
    )
}

export default ServerErrScreen;