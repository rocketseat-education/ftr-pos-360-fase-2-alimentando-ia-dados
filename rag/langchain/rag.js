import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { pull } from "langchain/hub";
import { StateGraph, Annotation } from "@langchain/langgraph";

import dotenv from 'dotenv';
dotenv.config();

const url = "https://eloquentjavascript.net/1st_edition/print.html";
const cheerioLoader = new CheerioWebBaseLoader(
    url, { selector: ".block" }
);

const docs = await cheerioLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 300
});

const allSplits = await splitter.splitDocuments(docs);

console.log(allSplits);

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    model: "text-embedding-004",
    taskType: "RETRIEVAL_DOCUMENT"
});

const vectorStore = new Chroma(embeddings, {
    collectionName: "javascript-book-gemini-embeddings"
});

// vectorStore.addDocuments(allSplits);

const promptTemplate = await pull("rlm/rag-prompt");

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

async function retrieve(state) {
    const retrievedDocs = await vectorStore.similaritySearch(state.question);
    return { docs: retrievedDocs }
}

async function generate(state) {
    const docs = state.docs.map(doc => doc.pageContent).join("\n");
    const prompt = await promptTemplate.invoke({
        question: state.question,
        context: docs
    });
    const response = await llm.invoke(prompt);

    return { answer: response };
}

const StateAnnotation = Annotation.Root({
    question: Annotation,
    docs: Annotation,
    answer: Annotation
});

const graph = new StateGraph(StateAnnotation)
    .addNode("retrieve", retrieve)
    .addConditionalEdges("generate", generate)
    .addEdge("__start__", "retrieve")
    .addEdge("retrieve", "generate")
    .addEdge("generate", "__end__")
    .compile();