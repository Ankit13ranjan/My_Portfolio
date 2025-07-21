// import express from "express";
// import fs from "fs";
// import axios from "axios";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { Prompt } from "./model/prompt.model.js";
// import { errorHandler } from "./middlewares/error.middlewares.js";
// import categoryRouter from "./routes/category.routes.js";
// import updateRouter from "./routes/update.routes.js";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: "*" }));

// const PORT = process.env.PORT || 8080;
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const MONGODB_URI = process.env.MONGODB_URI;

// const GEMINI_API_URL =
//   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// // Connect to MongoDB
// mongoose
//   .connect(MONGODB_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });

// const keywordLinks = {
//   portfolio: "https://iamadityaranjan.com",
//   github: "https://github.com/aditya74841",
//   auditproject: "https://audit-demo.netlify.app",
//   leetcode: "https://leetcode.com/aditya7884/",
// };

// // IP helper
// const getClientIp = (req) => {
//   const forwarded = req.headers["x-forwarded-for"];
//   return forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
// };

// app.use("/api/v1/category", categoryRouter);
// app.use("/api/v1/update", updateRouter);

// // POST /ask
// app.post("/ask", async (req, res) => {
//   const question = req.body.question;
//   const ip = getClientIp(req);
//   const shouldSave = req.query.save !== "false"; // default: true

//   if (!question) {
//     return res.status(400).json({ error: "Question is required" });
//   }

//   const context = fs.readFileSync("about_me.txt", "utf-8");

//   const findLink = (question) => {
//     const lower = question.toLowerCase();
//     for (const keyword in keywordLinks) {
//       if (lower.includes(keyword)) {
//         return `\nYou can explore it here: ${keywordLinks[keyword]}`;
//       }
//     }
//     return "";
//   };

//   const extraLink = findLink(question);

//   const prompt = `
// Below is some context about me:
// ${context}

// Please answer the following question in first person. If relevant, include any important links directly (like portfolio, GitHub, or project demos). Keep it concise and human-like.

// Question: ${question}${extraLink}
// `;

//   try {
//     const geminiRes = await axios.post(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//       }
//     );

//     const answer =
//       geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No answer found.";

//     // ✅ Only save if shouldSave is true
//     if (shouldSave) {
//       const newPrompt = new Prompt({
//         title: question,
//         response: answer,
//         ipAddress: ip,
//       });
//       await newPrompt.save();
//     }

//     res.status(200).json({ answer, saved: shouldSave });
//   } catch (error) {
//     console.error("❌ Error in /ask:", error.message);
//     res.status(500).json({ error: "Failed to get answer from Gemini." });
//   }
// });

// // Health check
// app.get("/health-check", (req, res) => {
//   res.status(200).json({ message: "Server is healthy" });
// });

// app.get("/", (req, res) => {
//   res.send("<h1>Server is Running Perfectly</h1>");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

// app.use(errorHandler);


import express from "express";
import fs from "fs";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Prompt } from "./model/prompt.model.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import categoryRouter from "./routes/category.routes.js";
import updateRouter from "./routes/update.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Enhanced keyword-link mapping with better context detection
const keywordLinks = {
  portfolio: "https://ankitranjan.in",
  github: "https://github.com/Ankit13ranjan",
  leetcode: "https://leetcode.com/u/Ankit_1331/",
  onlinecv: "https://ankitranjan.in/cv",
  linkedin: "https://www.linkedin.com/in/ankit1313/",
  email: "mailto:ranjanankit1313@gmail.com",
  contact: "https://ankitranjan.in/#contact",
  projects: "https://ankitranjan.in/#projects",
  resume: "https://ankitranjan.in/cv"
};

// IP helper
const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
};

app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/update", updateRouter);

// Enhanced link detection function
const enhanceResponseWithLinks = (answer, question) => {
  const lower = question.toLowerCase();
  let enhancedAnswer = answer;
  
  // Contact-related enhancements
  if (lower.includes('contact') || lower.includes('reach') || lower.includes('connect')) {
    if (!enhancedAnswer.includes('iamadityaranjan.com')) {
      enhancedAnswer += `\n\nYou can connect with me through:\n- [Portfolio Website](https://ankitranjan.in)\n- [LinkedIn](https://www.linkedin.com/in/ankit1313)\n- [GitHub](https://github.com/Ankit13ranjan)`;
    }
  }
  
  // Project-related enhancements
  if (lower.includes('project') && !enhancedAnswer.includes('github.com')) {
    enhancedAnswer += `\n\nCheck out my projects on [GitHub](https://github.com/Ankit13ranjan) or visit my [Portfolio](https://ankitranjan.in/projects) for detailed case studies.`;
  }
  
  // Skills-related enhancements
  if (lower.includes('skill') || lower.includes('technology') || lower.includes('stack')) {
    if (!enhancedAnswer.includes('leetcode.com')) {
      enhancedAnswer += `\n\nYou can see my problem-solving skills on [LeetCode](https://leetcode.com/Ankit_1331/) and explore my technical projects on [GitHub](https://github.com/Ankit13ranjan).`;
    }
  }
  
  // Resume/CV related
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('experience')) {
    if (!enhancedAnswer.includes('/cv')) {
      enhancedAnswer += `\n\nYou can view my detailed resume at [Online CV](https://ankitranjan.in/cv).`;
    }
  }
  
  return enhancedAnswer;
};

// POST /ask
app.post("/ask", async (req, res) => {
  const question = req.body.question;
  const ip = getClientIp(req);
  const shouldSave = req.query.save !== "false";

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const context = fs.readFileSync("about_me.txt", "utf-8");

  const prompt = `
You are Ankit Ranjan's AI assistant. Based on the context below, answer questions about Ankit in first person as if you are him.

Context about Ankit:
${context}

Important Guidelines:
1. Always respond in first person ("I am", "My experience", etc.)
2. Be conversational and professional
3. For contact information, provide actual links using markdown format: [Link Text](URL)
4. When mentioning projects or skills, include relevant links when appropriate
5. Keep responses concise but informative
6. If asked about contact details, always provide the portfolio website link

Available Links (use when relevant):
* Portfolio: https://ankitranjan.in
* GitHub: https://github.com/Ankit13ranjan
* LinkedIn: https://www.linkedin.com/in/ankit1313
* LeetCode: https://leetcode.com/Ankit_1313/
* Online CV: https://ankitranjan.in/cv
Question: ${question}
`;

  try {
    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    let answer =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I apologize, but I couldn't generate a response at the moment. Please try asking again.";

    // Enhance the response with relevant links
    answer = enhanceResponseWithLinks(answer, question);

    // Save if required
    if (shouldSave) {
      const newPrompt = new Prompt({
        title: question,
        response: answer,
        ipAddress: ip,
      });
      await newPrompt.save();
    }

    res.status(200).json({ answer, saved: shouldSave });
  } catch (error) {
    console.error("❌ Error in /ask:", error.message);
    res.status(500).json({ 
      error: "I'm having trouble processing your request right now. Please try again in a moment." 
    });
  }
});

// Health check
app.get("/health-check", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.get("/", (req, res) => {
  res.send("<h1>Aditya's AI Assistant Server</h1><p>Server is running perfectly</p>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.use(errorHandler);