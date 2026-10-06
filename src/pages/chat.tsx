import { useState, useEffect } from "react";
import { useAuthStore } from "../context/auth-store";
import {
    sendMessage,
    receiveNotification,
    deleteNotification,
} from "../api/greenApi";

const Chat = () => {
    const { idInstance, apiTokenInstance, logout } = useAuthStore();
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    const [activeChat, setActiveChat] = useState(() => {
        return localStorage.getItem("activeChat") || "";
    });

    const [messages, setMessages] = useState<
        { id: number; text: string; sender: "me" | "other" }[]
    >(() => {
        const saved = localStorage.getItem("chatMessages");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("activeChat", activeChat);
    }, [activeChat]);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    const startChat = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.trim()) {
            setActiveChat(cleanPhone);
            setPhone("");
            setMessages([]);
        }
    };

    const handleEditChat = () => {
        setPhone(activeChat);
        setActiveChat("");
        setMessages([]);
    };

    const handleDeleteChat = () => {
        setActiveChat("");
        setMessages([]);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            const currentMessage = message;
            setMessage("");
            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: currentMessage, sender: "me" },
            ]);

            try {
                await sendMessage(
                    idInstance,
                    apiTokenInstance,
                    activeChat,
                    currentMessage,
                );
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        if (!activeChat) return;

        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;

        const pollMessages = async () => {
            if (!isMounted) return;

            try {
                const data = await receiveNotification(
                    idInstance,
                    apiTokenInstance,
                );

                if (data && data.receiptId) {
                    console.log(data);

                    const body = data.body;

                    const isIncoming =
                        body?.typeWebhook === "incomingMessageReceived";
                    const incomingText =
                        body?.messageData?.textMessageData?.textMessage ||
                        body?.messageData?.extendedTextMessageData?.text;

                    const chatId = body?.senderData?.chatId || "";
                    const chatType = body?.senderData?.chatType || "";
                    const isPrivate =
                        !chatId.startsWith("-") &&
                        !chatId.includes("@g.us") &&
                        chatType !== "channel";

                    if (isIncoming && incomingText && isPrivate) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: Date.now(),
                                text: incomingText,
                                sender: "other",
                            },
                        ]);
                    }

                    await deleteNotification(
                        idInstance,
                        apiTokenInstance,
                        data.receiptId,
                    );

                    if (isMounted) {
                        pollMessages();
                    }
                    return;
                }
            } catch (error: any) {
                if (error?.response?.status !== 408) {
                    console.error(error);
                }
            }

            if (isMounted) {
                timeoutId = setTimeout(pollMessages, 3000);
            }
        };

        pollMessages();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [activeChat, idInstance, apiTokenInstance]);

    return (
        <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
            <div className="w-[350px] bg-[#212121] border-r border-black/20 flex flex-col z-20 shadow-2xl">
                <div className="p-4 flex items-center justify-between border-b border-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8774e1] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                            TG
                        </div>
                        <span className="font-semibold text-lg tracking-wide">
                            Telegram
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </div>

                <div className="p-3">
                    <form onSubmit={startChat} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Номер телефона (998...)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#0f0f0f] text-white px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-[#8774e1] text-sm transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-[#8774e1] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#7b66d6] transition-colors shrink-0"
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeChat && (
                        <div className="p-3 bg-[#8774e1]/10 border-l-2 border-[#8774e1] flex items-center justify-between hover:bg-[#8774e1]/20 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#8774e1] to-[#6a54c9] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {activeChat.substring(0, 2)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-medium text-white truncate">
                                        +{activeChat}
                                    </h3>
                                    <p className="text-[#8774e1] text-sm truncate">
                                        Чат открыт
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleEditChat}
                                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleDeleteChat}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-chat-pattern bg-[#0f0f0f] relative">
                {activeChat ? (
                    <>
                        <div className="h-[60px] bg-[#212121]/95 backdrop-blur-md border-b border-black/20 flex items-center px-6 shadow-sm z-10">
                            <div className="flex flex-col">
                                <span className="font-semibold text-white tracking-wide">
                                    +{activeChat}
                                </span>
                                <span className="text-[#8774e1] text-xs">
                                    в сети
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`max-w-[60%] px-4 py-2.5 rounded-2xl text-[15px] shadow-sm ${
                                        msg.sender === "me"
                                            ? "bg-[#8774e1] text-white self-end rounded-br-sm"
                                            : "bg-[#212121] text-white self-start rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[#0f0f0f]">
                            <form
                                onSubmit={handleSendMessage}
                                className="max-w-4xl mx-auto flex items-end gap-3"
                            >
                                <div className="flex-1 bg-[#212121] rounded-t-2xl rounded-b-2xl flex items-end p-1 shadow-sm">
                                    <button
                                        type="button"
                                        className="p-3 text-gray-500 hover:text-[#8774e1] transition-colors"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        placeholder="Написать сообщение..."
                                        className="flex-1 bg-transparent text-white px-2 py-3 outline-none placeholder-gray-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-14 h-14 bg-[#8774e1] hover:bg-[#7b66d6] rounded-full flex items-center justify-center text-white transition-all shadow-md shrink-0 active:scale-95"
                                >
                                    <svg
                                        className="w-6 h-6 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-[#212121]/80 px-6 py-2 rounded-full text-sm text-gray-400 backdrop-blur-sm shadow-sm">
                            Выберите, кому хотели бы написать
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
