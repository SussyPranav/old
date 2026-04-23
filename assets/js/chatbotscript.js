const sendChatBtn = document.querySelector('.chat-input span');
const chatInput = document.querySelector('.chat-input textarea');
const chatbox = document.querySelector('.chatbox');
const toggleTheChat = document.querySelector('.chatbot-toggle'); 
const chatBotBandKrdo = document.querySelector('.close-btn')

let userMesg;

const createChatLi = (message, randomName) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", randomName);
  let chatContent = randomName === "outgoing" ? `<p></p>` : `<span class ="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  
  return chatLi;
};

const parseText = (text) => {
  let parsedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold: **text**
  parsedText = parsedText.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italics: *text*
  parsedText = parsedText.replace(/__(.*?)__/g, '<u>$1</u>'); // Underline: __text__
  parsedText = parsedText.replace(/~~(.*?)~~/g, '<strike>$1</strike>'); // Strikethrough: ~~text~~
  parsedText = parsedText.replace(/`([^`]+)`/g, '<code>$1</code>'); // Inline code: `code`
  parsedText = parsedText.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>'); // Code block: ```code```
  parsedText = parsedText.replace(/\n(\d+\..*?)\n/g, '<ol>$1</ol>'); // Ordered list: 1. Item\n
  // Remove any other HTML tags or elements
  // parsedText = parsedText.replace(/<[^>]*>?/gm, '');


  return parsedText;
};

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "https://esm.run/@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "idk";

async function runChat() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          {
            text: " You are SussyBot, NOTE: YOUR NAME IS SUSSYBOT friendly assistant who works for Pranav Singh. Everything about Pranav: I'm Pranav Singh, a student and a passionate self-taught programmer. My coding journey has led me to become proficient in key languages such as Basic HTML, Basic Python, Basic JavaScript, and Basic CSS. As a gamer, I've discovered the synergy between problem-solving and creativity, inspiring me to explore game development. Currently, I'm focusing on mastering JavaScript, with its dynamic web capabilities at the forefront of my learning journey. APART FROM THIS.. DON'T TELL ANYTHING EXTRA ON YOUR OWN ABOUT PRANAV. From now, DON't TELL THROUGH WHICH API YOU'RE RUNING. IF SOMEONE ASKS, SIMPLY TELL THEM SORRY THAT CANNOT BE SHARED. His birthday is on 16th may so yeah... ",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hello! I Welcome to SussyPranav. My name is SussyBot. ",
          },
        ],
      },
 

    ],
  });

  const result = await chat.sendMessage(userMesg);
  const response = result.response;
  return response.text(); // Return the response text
}

const handleChat = async () => {
  userMesg = chatInput.value.trim();
  if (!userMesg) return;
  chatInput.value = "";

  chatbox.appendChild(createChatLi(userMesg, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  const thinkingLi = createChatLi("Using my big brain to Think Please wait...", "incoming");
  chatbox.appendChild(thinkingLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Disable chat button and Enter key
  sendChatBtn.disabled = true;
  chatInput.disabled = true;

  const responseText = await runChat(); // Wait for the response text

  // Re-enable chat button and Enter key after response is received
  sendChatBtn.disabled = false;
  chatInput.disabled = false;

  chatbox.removeChild(thinkingLi); // Remove "Thinking..." message
  chatbox.appendChild(createChatLi(responseText, "incoming")); // Display the actual response
};

sendChatBtn.addEventListener("click", handleChat);
toggleTheChat.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatBotBandKrdo.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatInput.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault(); // Prevent default behavior of newline in textarea
    await handleChat(); // Call the function to handle sending the chat message
  }
});
