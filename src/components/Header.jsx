import { Link } from "react-router-dom"
import MyNavLink from "./MyNavLink"
import { useEffect, useRef } from "react"

const Header = () => {

    const header = useRef(null)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            header.current.classList.toggle('sticky', window.scrollY > 0)
        })
    },[])

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
                    "
                >

                <MyNavLink to='/'>
                    Home
                </MyNavLink>
                <MyNavLink to='/movies'>
                    Movies
                </MyNavLink>
                <MyNavLink to='/series'>
                    Series
                </MyNavLink>

                </div>
            </nav>
        </header>
    )
}

export default Header