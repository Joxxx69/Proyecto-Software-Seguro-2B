import React, { useState, useEffect } from 'react'
import { TbLogout } from "react-icons/tb";
import { BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { logout, getUserInfo } from '../../services/auth/auth';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../../services/token/store';

const defaultProfilePic = `https://api.dicebear.com/9.x/initials/svg?seed=`;



export const Profile = ({ expanded }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook para la navegación
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = getToken('accessToken');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const user = await getUserInfo(decodedToken.id, token);
                    setUserInfo(user);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                // Manejo adicional del error si es necesario.
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        // Eliminar token de acceso
        setLoading(true);
        await logout();
        setLoading(false);
        navigate('/login'); // Redirige a la página de login
    };

    return (
        <div className='flex items-center justify-center gap-2 border-t  pt-4 border-slate-300'>


            <div className={`flex gap-2 items-center justify-center transition-all w-full `}  >
                {loading ? (
                    <div className={`flex items-center w-full ${expanded ? 'justify-between' : 'justify-center'}`} >
                        <p className={`open-sans ${expanded ? 'w-full' : 'hidden'}`}>Cerrando Sesión...</p>
                        <BiLoaderCircle className="animate-spin size-6 text-azul-marino-500" />
                    </div>
                ) : (
                    <>
                        <div className={`flex gap-2 items-center ${expanded ? 'w-full' : 'hidden'}`}>

                            <img
                                src={
                                    userInfo?.avatarUrl || defaultProfilePic + userInfo?.name
                                }
                                alt="Profile"
                                className="size-9 rounded shrink-0 shadow"
                            />
                            <div className='text-start open-sans overflow-hidden leading-4 w-max'>
                                <span className='font-semibold block text-azul-marino-500'>{userInfo.name}</span>
                                <span className='text-xs truncate block text-stone-500'>{userInfo.email}</span>
                            </div>
                        </div>
                        <button
                            className='hover:bg-rojo-100 h-min hover:text-rojo-500 text-stone-950  rounded  right-2 transition-colors p-1 '
                            onClick={handleLogout}
                        >
                            <TbLogout className=' size-6' />

                        </button>
                    </>
                )}
            </div>




        </div>
    )
}
