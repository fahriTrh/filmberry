import { NavLink } from "react-router-dom"

const MyNavLink = ({ to, children, isButton = false, onClick }) => {

    if (isButton) {
        return (
            <button
                onClick={onClick}
                className="
                    hover:text-primary
                    duration-300
                "
            >
                {children}
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
            </button>
        )
    }

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
                {children}
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