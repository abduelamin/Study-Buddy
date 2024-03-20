import React, { useEffect, useState } from "react";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { createClient } from "@supabase/supabase-js";
// import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import gsap from "gsap";
import "./App.css";
import useFetchBase from "./Utilities/FetchBase";
import useRetriever from "./Utilities/Retriever";

function App() {
  const [userInput, setUserInput] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const retriever = useRetriever();
  const { fetchKnowledgeBase, baseData } = useFetchBase(); // Custom hook to form vector store one pageload only or unless knowlegebase has changed. I need to make a robust way of creating the vector base and then removing this from the app to avoid constant refreshing of the app populating th vector base unnecessarily.

  // BUG #1: Vecotr store is only storing half my knowledge base. I read supabase docs and there is no size limitations so theres an issue somehwere in my handling
  useEffect(() => {
    fetchKnowledgeBase();
  }, [baseData]);

  // Only try to create the model if openAIKey is available. I was having an issue with passing down openAIKey from the custom hook. this is because the openAIkEY IS A state varibale so the state may not always change byt the time the app,jsx component renders so it creates the new Chatopen with an empty object. This is only occurs because in my customhook, I am not calling the fetchknowedlgebase() hence the state doesn't change until I call it here in app.jsx. And when app.jsx renders if the fetchknowldgebase() doesn't make the state change quick enough before the new chatopenAI is intiialised then the error happens, therefore I must put it in an if statement to ensure that the state has updated before initinalsing my model.
  const OAIKEY = "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";

  const model = new ChatOpenAI({ openAIApiKey: OAIKEY });

  // const model = new ChatOpenAI({ openAIApiKey: openAIKey });

  const questionTemplate = `I want you to convert the user question to a standalone question. If applicable use conversation history for extra bit of help. 
  question: {question}
  conversation history: {chatHistory}
  standalone question: `;

  const questionPrompt = PromptTemplate.fromTemplate(questionTemplate);

  const questionChain = questionPrompt
    .pipe(model)
    .pipe(new StringOutputParser());

  // below function formats the comparison vectors and places them into one big string. From there we can compare the vectorstore chunks to the standalonequestion vector.
  const formatDocuments = (documents) => {
    documents.map((doc) => doc.pageContent).join("\n");
  };
  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standaloneQuestion,
    retriever,
    formatDocuments,
  ]);

  const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question based on the context provided and the conversation history. Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the user to email abdullahelamin.dev@gmail.com for assistance. Don't try to make up an answer. Always speak as if you were chatting to a friend.
  context: {context}
  conversationHistory: {chatHistory}
  question: {question}
  answer: `;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser());

  const mainChain = RunnableSequence.from([
    {
      standaloneQuestion: questionChain,
      input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain, // Prev result is the previous output object. We then access the standalonequestion via dot notation in the retrieverChain
      chatHistory: ({ input }) => input.chatHistory,
      question: ({ input }) => input.question,
    },
    answerChain,
  ]);

  // handleSubmit is async because it needs to await the result of the mainChain.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedChatHistory = [...messageHistory, userInput];
    setMessageHistory(updatedChatHistory);
    setUserInput("");
    setLoading(true);
    try {
      const response = await mainChain.invoke({
        question: userInput,
        chatHistory: messageHistory,
      });
      setLoading(false);
      setMessageHistory([...updatedChatHistory, response]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main>
      <section className="chatContainer">
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
          {loading && <div>Loading...</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />
          <button onClick={handleSubmit}>Scan My Study Book</button>
        </form>
      </section>
    </main>
  );
}

export default App;
