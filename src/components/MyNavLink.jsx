import { NavLink } from "react-router-dom"

const MyNavLink = ({ to, children }) => {
    return (
        <div
            className="
                group
                relative
            "
        >
            <NavLink 
                to={to}
                className="
                    hover:text-primary
                    duration-300
                "
                >
                    { children }
                    <span
                        className="
                            block
                            absolute
                            -bottom-1
                            left-0
                            right-full
                            group-hover:right-0
                            duration-300
                            h-0.5
                            bg-primary
                        "
                    >

                    </span>
            </NavLink>
        </div>
    )
}

export default MyNavLink