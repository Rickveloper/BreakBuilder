const transcript = document.getElementById("transcript");
let recognition;
let isRecording = false;

// Check if speech recognition is supported
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (window.SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let result = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      result += event.results[i][0].transcript;
    }
    transcript.value += result + " ";
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
  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = true;
  alert("Speech recognition is not supported in this browser.");
}

// Save buttons
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

// Image generation
document.getElementById("generateImage").addEventListener("click", async () => {
  const text = transcript.value.trim();
  const apiKey = ""; // <--- Insert your DeepAI API key here

  if (!apiKey) {
    alert("Missing DeepAI API key. Edit script.js to add yours.");
    return;
  }

  if (!text) {
    alert("Say or type something first!");
    return;
  }

  try {
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
      imgDiv.textContent = "Image generation failed. Try again later.";
    }
  } catch (err) {
    console.error(err);
    alert("Error generating image. Check console.");
  }
});