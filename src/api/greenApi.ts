import axios from "axios";

const API_URL = "https://4100.api.green-api.com";

export const sendMessage = async (
    idInstance: string,
    apiTokenInstance: string,
    phone: string,
    message: string,
) => {
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const payload = {
        chatId: `${phone}@c.us`,
        message: message,
    };
    const response = await axios.post(url, payload);
    return response.data;
};

export const receiveNotification = async (
    idInstance: string,
    apiTokenInstance: string,
) => {
    const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
    const response = await axios.get(url);
    return response.data;
};

export const deleteNotification = async (
    idInstance: string,
    apiTokenInstance: string,
    receiptId: number,
) => {
    const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    const response = await axios.delete(url);
    return response.data;
};
