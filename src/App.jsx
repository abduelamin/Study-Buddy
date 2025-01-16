import React, { useEffect, useState, CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import gsap from "gsap";
import "./App.css";
import Header from "./components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPaperPlane,
  faTrashAlt,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [userInput, setUserInput] = useState("");
  const [messageHistory, setMessageHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("history")) || [];
  });
  const [loading, setLoading] = useState(false);

  // handleSubmit is async because it needs to await the result of the mainChain.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedChatHistory = [...messageHistory, userInput];
    setMessageHistory(updatedChatHistory);
    setUserInput("");
    setLoading(true);
  
    try {
      const response = await fetch("https://studybuddy-backend-m98p.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userInput,
          chatHistory: updatedChatHistory,
        }),
      });
      const data = await response.json();
      setMessageHistory([...updatedChatHistory, data.response]);
      localStorage.setItem("history", JSON.stringify([...updatedChatHistory, data.response]));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setMessageHistory([]);
    localStorage.setItem("history", JSON.stringify([]));
  };

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <section className="chatContainer">
          <div className="tooltip">
            <div className="icon">i</div>
            <div className="tooltiptext">
              🤖 Study Buddy is powered by OpenAI's free tier, which has a limit
              of 3 requests per minute. Please wait a few seconds between
              submitting your questions. If the bot takes longer to respond,
              please allow up to 30 seconds for a reply.
            </div>
          </div>

          <div className="messagesContainer">
            {messageHistory.map((msg, index) => (
              <div
                key={index}
                className={`speech ${
                  index % 2 === 0 ? "speech-human" : "speech-ai"
                }`}
              >
                {msg}
              </div>
            ))}
            {loading && (
              <div>
                <SyncLoader color="#36d7b7" size={9} speedMultiplier={0.8} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
              placeholder="Ask Me Anything"
            />
            <button className="customButton" onClick={handleSubmit}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>

            <button
              className="customButton"
              onClick={handleClick}
              title="Clear Chat History"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </form>
        </section>
        <aside>
          <p>
            🤖 This AI is customised to provide responses based on my personal
            vanilla JavaScript notes.
          </p>
          <a
            href="https://drive.google.com/file/d/1Y943kBOkghIIze5LRre8SPxwI1BjFLCV/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="studyGuide">View Study Guide</button>
          </a>
        </aside>
      </main>
    </>
  );
}

export default App;

// TODO:   Enable user to upload their own files. AND fix API issue being open to the world.
