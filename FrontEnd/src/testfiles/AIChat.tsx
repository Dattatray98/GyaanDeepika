import { useState } from "react";

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  const askAI = async () => {
    const response = await fetch("http://localhost:5000/api/ai/generate-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setReply(data.reply);
  };

  return (
    <div>
      <input 
        type="text" 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
      />
      <button onClick={askAI}>Ask AI</button>
      <p>{reply}</p>
    </div>
  );
}