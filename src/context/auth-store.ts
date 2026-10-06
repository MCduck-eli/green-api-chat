import { create } from "zustand";

interface AuthState {
    idInstance: string;
    apiTokenInstance: string;
    login: (id: string, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    idInstance: localStorage.getItem("idInstance") || "",
    apiTokenInstance: localStorage.getItem("apiTokenInstance") || "",

    login: (id, token) => {
        localStorage.setItem("idInstance", id);
        localStorage.setItem("apiTokenInstance", token);
        set({ idInstance: id, apiTokenInstance: token });
    },

    logout: () => {
        localStorage.removeItem("idInstance");
        localStorage.removeItem("apiTokenInstance");
        set({ idInstance: "", apiTokenInstance: "" });
    },
}));
