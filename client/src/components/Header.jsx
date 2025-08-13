import { useSelector } from "react-redux";
import { Link } from "react-router-dom"
import Input from "./Input";
function Header() {
    const { username, isLoggedIn, avatar } = useSelector(state => state.auth);

    return (
        <header className=" w-full flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <Link to="/"><h1 className="text-2xl font-bold text-blue-400">Blogify</h1></Link>
            <div className="flex-1">
                {isLoggedIn ? (
                    <>
                        <div className="w-full px-4 py-1 rounded flex gap-6 items-center justify-end">
                            <Input type="text" placeholder="Search..." className="w-1/2 px-4 py-2 rounded border border-gray-700" />
                            <Link to={`/profile/${username}`} className="text-sm font-medium">
                                <img src={avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-full px-4 py-1 rounded flex gap-6 items-center justify-end">
                            <Link to="/login" className="text-sm font-medium hover:text-blue-400">Login</Link>
                            <Link to="/signup" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header