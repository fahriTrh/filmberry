import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { FaChevronDown } from "react-icons/fa";

export default function Dropdown({children}) {
    return (
        <Menu as="div" className="relative inline-block">
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20">
                Options
                <FaChevronDown className='mt-1' />
            </MenuButton>

            <MenuItems
                transition
                className="py-2 absolute right-0 z-10 mt-2 w-32 px-3 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
                <div className="py-1">
                    {children}
                </div>
            </MenuItems>
        </Menu>
    )
}
