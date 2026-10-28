const express = require("express");
const Groq = require("groq-sdk");
const cors = require("cors");

require("dotenv").config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// post route to handle incroming chat message
app.post("/ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [

        {
            role:"system",
            content:` 
            You are an ai model created by me if someone ask u who made u you are to say my name as is stated below Awele
            Hi I am Awele, I created you and your name is Awele Ai 
            Your work is to help as an ai assistance.
            Help in educatinal purposes,finance and other related things that people can ask off and provides information to the users`
        },
        {

          role: "user",
          content: message,
        },
      ],
    });

    const aiReply = chatCompletion.choices?.[0]?.message?.content || "No response generated";

    return res.status(200).json({ message: aiReply });
  } catch (error) {
    console.error("AI request failed:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
