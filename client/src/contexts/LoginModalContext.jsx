import { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export const LoginModalProvider = ({children}) => {
    const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

    const openLoginModal = () => setLoginModalIsOpen(true);
    const closeLoginModal = () => setLoginModalIsOpen(false);

    return (
        <LoginModalContext.Provider value={{ loginModalIsOpen, openLoginModal, closeLoginModal }} >
            {children}
        </LoginModalContext.Provider>
    )
}

export const useLoginModal = () => useContext(LoginModalContext);
