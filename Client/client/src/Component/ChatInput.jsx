import React, { useState, useEffect } from "react";
import "../CSS/ChatInput.css";

import CircularIndeterminate from "./CircularIndeterminate";
function ChatInput() {
  const [triggerApiCall, setTriggerApiCall] = useState(false);
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (triggerApiCall) {
      const postData = {
        prompt: inputValue,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      setLoading(true);
      fetch("http://127.0.0.1:5000/api/prompt", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          console.log(data);
          setData(data);
          setTriggerApiCall(false); // Reset the trigger
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setTriggerApiCall(false); // Reset the trigger
        });
    }
  }, [triggerApiCall, inputValue]);

  const handleClick = () => {
    setTriggerApiCall(true);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="chatInput">
      <div className="messageBox">
        <input
          required=""
          placeholder="Message..."
          type="text"
          id="messageInput"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button id="sendButton" onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 664 663"
          >
            <path
              fill="none"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="33.67"
              stroke="#6c6c6c"
              d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
            ></path>
          </svg>
        </button>
        <div className="fileUploadWrapper">
          {loading && <CircularIndeterminate />}
        </div>
      </div>
      {data != null && (
        <div className="ResponseClass">
          Answer: {JSON.stringify(data.response)}
        </div>
      )}
    </div>
  );
}

export default ChatInput;
