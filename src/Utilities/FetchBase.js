import React from "react";
import knowledgeBase from "../knowledgeBase.txt";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

const FetchBase = () => {
  const supabaseURL = process.env.sbUrl;
  const supbabaseAPI = process.env.sbApiKey;
  const openAIKey = process.env.openAIApiKey;

  const fetchKnowledgeBase = async () => {
    try {
      const base = await fetch(knowledgeBase);
      const baseData = await base.text();

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
      });
      const output = await splitter.createDocuments([baseData]);

      const client = createClient(supabaseURL, supbabaseAPI);

      await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({ openAIApiKey: openAIKey }),
        { client: client, tableName: "documents" }
      );
    } catch (error) {
      console.error(error);
    }
  };

  fetchKnowledgeBase(); // This calls the fetch -  i NEED A WAY TO ONLY CALL THIS FUNCTION ONCE IN THE APPLICATION

  // Don't forget to have a return statement so that you can invoke it.
};

export default FetchBase;

// These will be custome Hooks that return the values
