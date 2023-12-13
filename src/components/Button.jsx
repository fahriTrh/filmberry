const Button = ({
    children,
    variant,
    onClick,
    dataId
}) => {

    return (
        <button
            onClick={onClick}
            data-id={dataId}
            className={`
                rounded-full
                text-white
                shadow-primary
                ${variant == 'sm' ? 
                'text-xs py-1 px-3' :
                'text-xs md:text-sm py-2 md:py-2.5 px-4 md:px-6'
                }
                bg-primary
                flex
                items-center
                gap-1
                md:gap-1.5
            `}
        >

                {
                    variant !== 'sm' && (
                        <img width={15} src="/assets/play-icon.png" alt="play" />
                    )
                }

                { children }

        </button>
    )
}

export default Button