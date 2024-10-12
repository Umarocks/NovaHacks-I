import React, { useState, useEffect } from "react";
import "../CSS/ChatInput.css";

function ChatInput() {
  const [triggerApiCall, setTriggerApiCall] = useState(false);
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");

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

      fetch("http://127.0.0.1:5000/api/prompt", requestOptions)
        .then((response) => response.json())
        .then((data) => {
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
      <p>HELLO</p>
      <div className="messageBox">
        <div className="fileUploadWrapper">
          <label htmlFor="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 337 337"
            >
              <circle
                strokeWidth="20"
                stroke="#6c6c6c"
                fill="none"
                r="158.5"
                cy="168.5"
                cx="168.5"
              ></circle>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M167.759 79V259"
              ></path>
              <path
                strokeLinecap="round"
                strokeWidth="25"
                stroke="#6c6c6c"
                d="M79 167.138H259"
              ></path>
            </svg>
            <span className="tooltip">Add an image</span>
          </label>
          <input type="file" id="file" name="file" />
        </div>
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
