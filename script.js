const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

const WORKER_URL = "https://first-worker.dennisw2026.workers.dev/";

const conversation = [
  {
    role: "system",
    content: `You are L’Oréal’s Smart Routine & Product Advisor. 
Only answer questions about L’Oréal products, routines, and beauty topics. 
Politely refuse any off‑topic queries. 
Use an upbeat, friendly tone with occasional emojis.`,
  },
];

function renderMessage(role, text) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("bubble", role);

  if (role === "ai") {
    const lastUser = [...conversation].reverse().find((m) => m.role === "user");
    if (lastUser) {
      const q = document.createElement("div");
      q.classList.add("user-question");
      q.textContent = `${lastUser.content}`;
      wrapper.appendChild(q);
    }
  }

  const msg = document.createElement("div");
  msg.classList.add("msg-text");
  msg.textContent = text;
  wrapper.appendChild(msg);

  chatWindow.appendChild(wrapper);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  conversation.push({ role: "user", content: userText });
  renderMessage("user", userText);
  userInput.value = "";

  renderMessage("ai", "⏳ Thinking...");

  try {
    const resp = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversation }),
    });
    const { choices } = await resp.json();
    const aiReply = choices[0].message.content.trim();

    chatWindow.lastChild.remove();

    conversation.push({ role: "assistant", content: aiReply });
    renderMessage("ai", aiReply);
  } catch (err) {
    console.error(err);
    chatWindow.lastChild.remove();
    renderMessage("ai", "⚠️ Oops—something went wrong. Please try again.");
  }
});
