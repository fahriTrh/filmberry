import { Link, NavLink } from "react-router-dom"
import MyNavLink from "./MyNavLink"
import { useEffect, useRef } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";

const Header = () => {

    // login
    const { loginWithPopup, isAuthenticated, logout } = useAuth0();

    const header = useRef(null)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            header.current.classList.toggle('sticky', window.scrollY > 0)
        })
    }, [])

    return (
        <header
            ref={header}
            className="
                w-full
                fixed
                top-0
                z-50">

            <div className="h-2 w-full bg-primary"></div>
            <nav
                className="
                w-[90%]
                mx-auto
                lg:w-[85%]
                flex
                justify-between
                items-center
                py-4
                md:py-5"
            >
                <Link to='/'>
                    <img width={80} src="/assets/logo.png" alt="logo" />
                </Link>

                <div
                    className="
                        flex
                        gap-3
                        md:gap-4
                        text-xs
                        sm:text-sm
                        items-center
                    "
                >

                    {/* <MyNavLink to='/'>
                        Home
                    </MyNavLink> */}
                    <MyNavLink to='/movies'>
                        Movies
                    </MyNavLink>
                    <MyNavLink to='/series'>
                        Series
                    </MyNavLink>
                    {
                        isAuthenticated ? (
                            <>
                                <MyNavLink to='/dashboard'>
                                    Dashboard
                                </MyNavLink>
                                <Button variant='sm' onClick={logout}>
                                    Logout
                                </Button>
                                {/* <MyNavLink isButton={true} onClick={logout}>
                                    <BiLogOut className="ml-2" size={23} />
                                </MyNavLink> */}
                            </>
                        ) : (
                            <Button variant='sm' onClick={loginWithPopup}>
                                Login
                            </Button>
                        )
                    }

                </div>
            </nav>
        </header>
    )
}

export default Header