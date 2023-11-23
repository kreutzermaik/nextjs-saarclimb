import { useState } from 'react';

export const useStore = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userImage, setUserImage] = useState("");

    return {
        isLoggedIn,
        setIsLoggedIn,
        userImage,
        setUserImage
    };
};
