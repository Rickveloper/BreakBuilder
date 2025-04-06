const transcript = document.getElementById("transcript");
let recognition;
let isRecording = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        transcript.value += event.results[i][0].transcript + " ";
      }
    }
  };

  document.getElementById("start").onclick = () => {
    if (!isRecording) {
      recognition.start();
      isRecording = true;
    }
  };

  document.getElementById("stop").onclick = () => {
    if (isRecording) {
      recognition.stop();
      isRecording = false;
    }
  };
} else {
  alert("Speech recognition not supported on this browser.");
}

document.getElementById("clear").onclick = () => {
  transcript.value = "";
};

document.getElementById("saveTxt").onclick = () => {
  const blob = new Blob([transcript.value], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "break.txt";
  link.click();
};

document.getElementById("saveMd").onclick = () => {
  const blob = new Blob([transcript.value], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "break.md";
  link.click();
};

// Image generation with DeepAI
document.getElementById("generateImage").addEventListener("click", async () => {
  const text = transcript.value.trim();
  const apiKey = ""; // <<< INSERT YOUR DEEPAI API KEY HERE

  if (!apiKey) {
    alert("Missing DeepAI API key. Edit script.js to add yours.");
    return;
  }

  if (!text) {
    alert("Enter or speak some text first.");
    return;
  }

  const res = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "api-key": apiKey
    },
    body: `text=${encodeURIComponent(text)}`
  });

  const data = await res.json();
  const imgDiv = document.getElementById("imageContainer");
  imgDiv.innerHTML = "";

  if (data.output_url) {
    const img = document.createElement("img");
    img.src = data.output_url;
    img.alt = "Generated Image";
    img.style.maxWidth = "100%";
    img.style.marginTop = "10px";
    img.style.borderRadius = "8px";
    imgDiv.appendChild(img);
  } else {
    imgDiv.textContent = "Failed to generate image.";
  }
});