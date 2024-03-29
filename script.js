window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const output = document.getElementById('output-box');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');
let silenceTimer; // Timer for tracking silence

recognition.interimResults = true;

recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join('');

    output.textContent = transcript;

    // Reset the silence timer when there's audio input
    clearTimeout(silenceTimer);
    silenceTimer = setTimeout(() => {
        recognition.stop();
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block';
        downloadBtn.style.display = 'inline-block';
    }, 10000); // Stop recording after 10 seconds of silence
});

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    stopBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    downloadBtn.style.display = 'inline-block';
});

resetBtn.addEventListener('click', () => {
    output.textContent = '';
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
});

downloadBtn.addEventListener('click', () => {
    const blob = new Blob([output.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
});