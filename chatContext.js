import React, { useEffect, createContext, useContext, useState } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [editor, setEditor] = useState(false);
    const AddPostHandler = () => {
        setEditor(true);
    };

    return (
        <ChatContext.Provider
            value={{
                editor,
                setEditor,
                AddPostHandler,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;

// export const ChatState = () => {
//     return useContext(Chat);
// };
