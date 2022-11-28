import React from "react";
import { BarLoader } from 'react-spinners';
import '../css/Loading.css'

function LoadingScreen() {
    return (
        <main className="loading">
            <div>
                <h1>Loading...</h1>
                <BarLoader width={400} height={20} />
            </div>
        </main>
    );
}

export default LoadingScreen;