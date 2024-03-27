import React from "react";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

const useRetriever = () => {
  const supabaseURL = "https://wpmjfndjjsvpqtwoeymu.supabase.co";
  const supabaseAPIKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbWpmbmRqanN2cHF0d29leW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwNTgzNzYsImV4cCI6MjAyNTYzNDM3Nn0.s5w7weREkGnUFwZvUgMEDvXeeRmOO2a_IhQkTXssR2o";
  const openAIKey = "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";

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: openAIKey });

  const retrieverClient = createClient(supabaseURL, supabaseAPIKey);

  const vectorStore = new SupabaseVectorStore(
    embeddings,

    {
      client: retrieverClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const retriever = vectorStore.asRetriever();

  return retriever;
};

export default useRetriever;

// These will be custome Hooks that return the values
