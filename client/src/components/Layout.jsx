import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import RegisterModal from "./RegisterModal";
import LoginModal from './LoginModal';

export default function Layout() {
    return (
        <div>
            <NavBar />
            <main className="relative pt-16 md:pt-20 px-4">
                <Outlet />
                <RegisterModal />
                <LoginModal />
            </main>
        </div>
    )
}
