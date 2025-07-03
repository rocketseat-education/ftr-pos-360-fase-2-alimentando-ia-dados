import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
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
    collectionName:"javascript-book-gemini-embeddings"
});

// vectorStore.addDocuments(allSplits);