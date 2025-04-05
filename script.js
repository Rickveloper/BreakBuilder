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

