// src/pages/DashboardLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { FiRss, FiPlusCircle, FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
    const auth = useSelector(state => state.auth);
    return (
        <div className="flex h-screen bg-[var(--color-primary-bg)] text-[var(--color-text-light)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-secondary-bg)] hidden md:flex flex-col p-4">
                <h2 className="text-xl font-bold mb-6">My Blog Dashboard</h2>
                <nav className="flex flex-col gap-2">
                    <NavItem to="/dashboard/blogs" icon={<FiRss />} label="Blogs Feed" />
                    <NavItem to="/dashboard/create-blog" icon={<FiPlusCircle />} label="Create Blog" />
                    <NavItem to={`/dashboard/user/blogs/${auth.username}`} icon={<FiUser />} label="My Blogs" />
                </nav>
            </aside>

            {/* Mobile Sidebar */}
            <aside className="md:hidden fixed bottom-0 w-full bg-[var(--color-secondary-bg)] flex justify-around p-2">
                <MobileNavItem to="/dashboard/blogs" icon={<FiRss />} />
                <MobileNavItem to="/dashboard/create-blog" icon={<FiPlusCircle />} />
                <MobileNavItem to={`/dashboard/user/blogs/${auth.username}`} icon={<FiUser />} />
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${isActive
                    ? "bg-[var(--color-accent)] text-white"
                    : "hover:bg-[var(--color-accent-hover)] text-[var(--color-text-muted)]"
                }`
            }
        >
            {icon}
            {label}
        </NavLink>
    );
}

function MobileNavItem({ to, icon }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `p-2 rounded-lg transition ${isActive
                    ? "bg-[var(--color-accent)] text-white"
                    : "hover:bg-[var(--color-accent-hover)] text-[var(--color-text-muted)]"
                }`
            }
        >
            {icon}
        </NavLink>
    );
}
