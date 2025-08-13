import { Outlet } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"

function Layout() {
    return (
        <main className="min-h-screen max-w-8xl mx-auto flex flex-col justify-between">
            <Header />
            <Outlet />
            <Footer />
        </main>
    )
}

export default Layout