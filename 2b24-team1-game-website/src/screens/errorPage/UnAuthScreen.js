import React from "react";
import '../../css/ErrorPage.css'

function UnAuthScreen() {
    return (
        <main className="errorScreen">
            <h1>403 Unauthorized</h1>
            <h2>Access to this page is not allowed!</h2>
            <h2>Please login first to do so</h2>
            <button className="errBtn" onClick={() => window.location.href='/login'}>To Login</button>
        </main>
    )
}

export default UnAuthScreen;