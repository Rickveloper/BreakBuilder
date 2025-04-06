// Speech Recognition
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const transcript = document.getElementById("transcript");

let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    transcript.value += result + " ";
  };

  startBtn.onclick = () => recognition.start();
  stopBtn.onclick = () => recognition.stop();
} else {
  transcript.value = "Speech Recognition not supported.";
}

// Clear
document.getElementById("clear").onclick = () => {
  transcript.value = "";
};

// Save .txt
document.getElementById("saveTxt").onclick = () => {
  const blob = new Blob([transcript.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transcript.txt";
  link.click();
};

// Save .md
document.getElementById("saveMd").onclick = () => {
  const blob = new Blob([transcript.value], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transcript.md";
  link.click();
};

// Generate Image
document.getElementById("generateImage").onclick = async () => {
  const prompt = transcript.value.trim();
  if (!prompt) return alert("Enter or say something first.");

  const response = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      "Api-Key": "YOUR_DEEPAI_API_KEY"
    },
    body: new URLSearchParams({ text: prompt })
  });

  const data = await response.json();
  const img = document.createElement("img");
  img.src = data.output_url;
  img.alt = "Generated";
  img.style.maxWidth = "100%";
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("imageContainer").appendChild(img);
};