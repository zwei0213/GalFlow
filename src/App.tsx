function App() {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-kachimushiro text-paper-white font-sans">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-jp font-bold text-transparent bg-clip-text bg-gradient-to-r from-sakura-pink to-torii-red">
                    VocabFlow
                </h1>
                <p className="text-xl opacity-80">Loading...</p>
                <div className="w-16 h-1 bg-torii-red mx-auto animate-pulse"></div>
            </div>
        </div>
    )
}

export default App
