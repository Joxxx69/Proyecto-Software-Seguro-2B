import React from "react";
import { Profile } from "./Profile";
import { RouteSelect } from "./RouteSelect";
import { TbChevronLeftPipe, TbChevronRightPipe } from "react-icons/tb";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = ({ expanded, setExpanded }) => {
    const { roles } = useAuth();

    return (
        <nav className={`h-full py-4 pl-4 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0 ${expanded ? 'xl:w-[15%] lg:w-1/5 md:w-1/4 w-1/2' : 'xl:w-[4%] lg:w-[8%] md:w-[10%] w-[12%]'}`}>
            <button onClick={() => setExpanded(curr => !curr)} className={`p-1.5 flex  rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 hover:text-azul-marino-500 ${expanded ? 'self-end' : ' justify-center'}`}>
                {expanded ? <TbChevronLeftPipe className='size-5' /> : <TbChevronRightPipe className='size-5' />}
            </button>
            <div className='py-4 flex items-center justify-center h-24'>
                <img src="./Logo.png" alt="Consentimiento Logo" className={`overflow-hidden transition-all  duration-300 ${expanded ? 'max-h-16 max-w-full' : 'max-h-10 max-w-full'} object-contain`} />
            </div>

            <RouteSelect expanded={expanded} roles={roles} />

            <Profile expanded={expanded} />
        </nav>
    );
};
