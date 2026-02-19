// ===== Scroll Animation =====
const frameCount = 240;
const canvas = document.getElementById("scrollCanvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = index => 
  `frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

const images = [];
let img = new Image();

for (let i = 1; i <= frameCount; i++) {
  const image = new Image();
  image.src = currentFrame(i);
  images.push(image);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor((scrollTop / maxScroll) * frameCount)
  );

  img.src = images[frameIndex].src;
  render();
});

// ===== Gemini Chat Integration =====

const API_KEY = "YOUR_GEMINI_API_KEY"; // Replace with your key

const SYSTEM_PROMPT = `
You are a resume assistant.
STRICT RULES:
1. Answer ONLY using the content from Jazir Ahmed's resume.
2. Do NOT add extra information.
3. If the answer is not in the resume, reply:
   "This information is not available in the resume."
Resume Content:
- Name: Jazir Ahmed S
- ECE Student at Government College of Engineering, Tirunelveli
- CGPA: 7.6
- Skills: C, Python, Verilog, SystemVerilog, Arduino, ARM, etc.
- Project: Automatic Railway Gate Controller
`;

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;
  if (!message) return;

  appendMessage("You", message);
  input.value = "";

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT + "\nUser Question: " + message }] }
        ]
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error";

  appendMessage("Bot", reply);
}

function appendMessage(sender, text) {
  const chat = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

