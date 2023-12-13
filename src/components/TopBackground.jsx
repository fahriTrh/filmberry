const TopBackground = ({ title = '' }) => {
    return (
        <div
            className="
                w-full
                h-[180px]
                md:h-[200px]
                relative
            "
        >
            <img 
                src="/assets/background.webp"
                className="
                    w-full
                    h-full
                    object-cover
                    object-center
                " />

                <div
                    className="
                        absolute
                        bottom-2
                        text-center
                        w-full
                    "
                >
                    <h1
                        className="
                            text-lg
                            md:text-xl
                            font-semibold
                        "
                    >
                        { title }
                    </h1>
                </div>
        </div>
    )
}

export default TopBackground