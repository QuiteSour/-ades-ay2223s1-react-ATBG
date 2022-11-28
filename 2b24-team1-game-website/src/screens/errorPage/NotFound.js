import React from 'react';
import '../../css/ErrorPage.css'

function NotFoundScreen () {

    return (
        <main className='errorScreen'>
            <h1>404 Not Found</h1>
            <h2>The page you are looking for does not exist</h2>
            <button className='errBtn' onClick={() => window.location.href='/'}>Return Home</button>
        </main>
    )
}

export default NotFoundScreen