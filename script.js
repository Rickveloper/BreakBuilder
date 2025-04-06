// script.js
let recognition;
let finalTranscript = '';
const output = document.getElementById('output');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    output.value = finalTranscript + interim;
  };

  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
  };
} else {
  alert('Speech recognition not supported on this browser.');
}

startBtn.onclick = () => {
  finalTranscript = '';
  output.value = '';
  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
};

stopBtn.onclick = () => {
  recognition.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
};
j
document.getElementById('clearBtn').onclick = () => {
  output.value = '';
};

document.getElementById('saveTxtBtn').onclick = () => {
  downloadFile(output.value, 'breakbuilder-transcript.txt');
};

document.getElementById('saveMdBtn').onclick = () => {
  const md = `# BreakBuilder Transcript\n\n${output.value}`;
  downloadFile(md, 'breakbuilder-transcript.md');
};

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}
document.getElementById("generateImage").addEventListener("click", async () => {
    const text = document.getElementById("transcript").value;
    const apiKey = ""; // <-- INSERT YOUR DEEPAI API KEY HERE

    if (!apiKey) {
        alert("Missing DeepAI API key. Edit script.js to add yours.");
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
    if (data.output_url) {
        document.getElementById("imageContainer").innerHTML = `<img src="${data.output_url}" alt="Generated Image" style="max-width:100%;margin-top:10px;border-radius:8px;" />`;
    } else {
        alert("Failed to generate image. Try again.");
    }
});
