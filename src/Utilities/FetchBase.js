import React, { useState } from "react";
import knowledgeBase from "../knowledgeBase.txt";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const useFetchBase = () => {
  const [baseData, setbaseData] = useState("");
  const supabaseURL = "https://wpmjfndjjsvpqtwoeymu.supabase.co";
  const supabaseAPIKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWpmbmRqanN2cHF0d29leW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwNTgzNzYsImV4cCI6MjAyNTYzNDM3Nn0.s5w7weREkGnUFwZvUgMEDvXeeRmOO2a_IhQkTXssR2o";
  const openAIKey = "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";

  const fetchKnowledgeBase = async () => {
    try {
      const base = await fetch(knowledgeBase);
      const data = await base.text();
      setbaseData(data);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
      });
      const output = await splitter.createDocuments([baseData]);

      const client = createClient(supabaseURL, supabaseAPIKey);

      await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({ openAIApiKey: openAIKey }),
        { client: client, tableName: "documents" }
      );
    } catch (error) {
      console.error(error);
    }
  };

  //   fetchKnowledgeBase(); // This calls the fetch -  i NEED A WAY TO ONLY CALL THIS FUNCTION ONCE IN THE APPLICATION

  // Don't forget to have a return statement so that you can invoke it.

  return { fetchKnowledgeBase, baseData };
};

export default useFetchBase;

// These will be custome Hooks that return the values
