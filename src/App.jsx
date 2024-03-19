import React, { useEffect, useState } from "react";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
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

function App() {
  const [count, setCount] = useState(0);
  const { fetchKnowledgeBase, baseData } = useFetchBase();

  useEffect(() => {
    fetchKnowledgeBase();
  }, [baseData]);

  return <></>;
}

export default App;
