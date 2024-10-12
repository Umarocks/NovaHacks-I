import React from "react";
import "../CSS/ChatIcon.css";
import { useState } from "react";
function ChatIcon({ isChatIcon, setIsChatIcon }) {
  const toggleChatIcon = () => {
    setIsChatIcon(!isChatIcon);
  };

  return (
    <>
      <button className="group p-6 absolute z-10 flex" onClick={toggleChatIcon}>
        <svg
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="white"
          strokeWidth="2"
          viewBox="0 0 24 24"
          height="44"
          width="44"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 stroke-white-500 hover:scale-125 duration-200 hover:stroke-blue-500"
          fill="none"
        >
          <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
          <path d="M8 9h8"></path>
          <path d="M8 13h6"></path>
          <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"></path>
        </svg>
      </button>
    </>
  );
}

export default ChatIcon;
