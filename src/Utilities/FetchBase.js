import React, { useState } from "react";
import knowledgeBase from "../knowledgeBase.txt";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const useFetchBase = () => {
  const [baseData, setbaseData] = useState("");
  const [openAIKey, setopenAIKey] = useState("");
  const supabaseURL = "https://wpmjfndjjsvpqtwoeymu.supabase.co";
  const supabaseAPIKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWpmbmRqanN2cHF0d29leW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwNTgzNzYsImV4cCI6MjAyNTYzNDM3Nn0.s5w7weREkGnUFwZvUgMEDvXeeRmOO2a_IhQkTXssR2o";
  const openKey = import.meta.env.VITE_openAIApiKey;

  const fetchKnowledgeBase = async () => {
    try {
      const base = await fetch(knowledgeBase);
      const data = await base.text();
      setbaseData(data);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1700,
        chunkOverlap: 170,
      });

      setopenAIKey(openKey); // sets openapi key as state variable so that I can use it in app.jsx
      const output = await splitter.createDocuments([baseData]);

      const client = createClient(supabaseURL, supabaseAPIKey);

      await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({ openAIApiKey: openKey }),
        { client: client, tableName: "documents" }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return { fetchKnowledgeBase, baseData, openAIKey };
};

export default useFetchBase;
