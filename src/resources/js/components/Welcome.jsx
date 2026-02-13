import React, { useState } from 'react'

function Welcome() {
    const [count, setCount] = useState(0)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="mb-8 flex justify-center gap-8">
                    <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                        <img 
                            src="https://vitejs.dev/logo.svg" 
                            className="h-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all duration-300" 
                            alt="Vite logo" 
                        />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
                            className="h-24 hover:drop-shadow-[0_0_2em_#61dafbaa] transition-all duration-300 animate-[spin_20s_linear_infinite]" 
                            alt="React logo" 
                        />
                    </a>
                </div>
                
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Vite + React
                </h1>
                
                <div className="mb-8">
                    <button
                        onClick={() => setCount((count) => count + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                    >
                        count is {count}
                    </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                    Edit <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-blue-600">src/components/Welcome.jsx</code> and save to test HMR
                </p>
                
                <p className="text-gray-500 text-sm">
                    Click on the Vite and React logos to learn more
                </p>
                
                <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        🎉 Selamat!
                    </h2>
                    <p className="text-gray-600">
                        Vite + React sudah berhasil dikonfigurasi dan berjalan dengan baik!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Welcome
