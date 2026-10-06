export const Loader = () => {
    return (
        <div className="min-h-screen bg-[#111111] flex items-center justify-center">
            <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                    className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                ></div>
                <div
                    className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                ></div>
            </div>
        </div>
    );
};
