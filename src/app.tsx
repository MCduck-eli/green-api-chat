import { lazy, Suspense } from "react";
import { useAuthStore } from "./context/auth-store";
import { Loader } from "./components/ui/loader";

const Login = lazy(() => import("./pages/login"));
const Chat = lazy(() => import("./pages/chat"));

const App = () => {
    const { idInstance, apiTokenInstance } = useAuthStore();

    return (
        <Suspense fallback={<Loader />}>
            {idInstance && apiTokenInstance ? <Chat /> : <Login />}
        </Suspense>
    );
};

export default App;
