import { createContext, useContext, useState } from 'react';

const RegisterModalContext = createContext();

export const RegisterModalProvider = ({children}) => {
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);

    const openRegisterModal = () => setRegisterModalIsOpen(true);
    const closeRegisterModal = () => setRegisterModalIsOpen(false);

    return (
        <RegisterModalContext.Provider value={{ registerModalIsOpen, openRegisterModal, closeRegisterModal }} >
            {children}
        </RegisterModalContext.Provider>
    )
}

export const useRegisterModal = () => useContext(RegisterModalContext);
