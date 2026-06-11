const apiBaseUrl = 'http://127.0.0.1:8000';

function showTab(n) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const tabs = [ 'photo-tab', 'voice-tab' ];
  document.getElementById(tabs[n]).style.display = 'block';
  document.querySelectorAll('.tab-btn')[n].classList.add('active');
}

function showHome() {
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('home-screen').classList.remove('hidden');
  showTab(0);
}

function showResults(result) {
  document.getElementById('home-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('result-crop').textContent = result.crop || 'Crop';
  document.getElementById('result-disease').textContent = result.disease || 'Information unavailable';
  document.getElementById('result-confidence').textContent = result.confidence ? `${Math.round(result.confidence * 100)}%` : 'N/A';
  document.getElementById('result-advice').textContent = result.advice || 'No advice available.';
  document.getElementById('result-fertilizer').textContent = result.fertilizer ? `N: ${result.fertilizer.N}, P: ${result.fertilizer.P}, K: ${result.fertilizer.K}` : 'Not available';
  saveHistory(result);
  renderHistory();
}

function getHistory() {
  const history = localStorage.getItem('analysisHistory');
  return history ? JSON.parse(history) : [];
}

function saveHistory(result) {
  const history = getHistory();
  const item = {
    crop: result.crop || 'Unknown',
    disease: result.disease || 'Unknown',
    confidence: result.confidence ? `${Math.round(result.confidence * 100)}%` : 'N/A',
    date: new Date().toLocaleDateString('en-US'),
  };
  history.unshift(item);
  if (history.length > 5) history.pop();
  localStorage.setItem('analysisHistory', JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  const list = document.getElementById('history-list');
  if (!list) return;
  if (history.length === 0) {
    list.innerHTML = '<p class="hint-text">No previous analyses found.</p>';
    return;
  }
  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div>
        <strong>${item.crop}</strong> - ${item.disease}
      </div>
      <div>${item.confidence} · ${item.date}</div>
    </div>
  `).join('');
}

async function analyzeImage(file, crop, location) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('crop_type', crop);
  formData.append('location', location);

  const response = await fetch(`${apiBaseUrl}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }
  return response.json();
}

async function analyzeVoice(text, crop, location) {
  const payload = new URLSearchParams();
  payload.append('text', text);
  payload.append('crop_type', crop);
  payload.append('location', location);

  const response = await fetch(`${apiBaseUrl}/voice-analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }
  return response.json();
}

function enableControls() {
  const uploadInput = document.getElementById('image-upload');
  const photoCrop = document.getElementById('crop-select');
  const photoLocation = document.getElementById('location-input');
  const voiceBtn = document.getElementById('record-btn');
  const voiceText = document.getElementById('voice-text');
  const voiceCrop = document.getElementById('voice-crop-select');
  const voiceLocation = document.getElementById('voice-location-input');
  const voiceStatus = document.getElementById('voice-status');

  uploadInput.addEventListener('change', async function(e) {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const result = await analyzeImage(file, photoCrop.value, photoLocation.value);
      showResults({
        ...result,
        crop: photoCrop.value,
      });
    } catch (error) {
      alert('Something went wrong: ' + error.message);
    }
  });

  voiceBtn.addEventListener('click', async () => {
    const text = voiceText.value.trim();
    if (!text) {
      voiceStatus.textContent = 'Please describe the issue before submitting.';
      return;
    }
    voiceStatus.textContent = 'Analyzing...';

    try {
      const result = await analyzeVoice(text, voiceCrop.value, voiceLocation.value);
      showResults({
        ...result,
        crop: voiceCrop.value,
      });
      voiceText.value = '';
    } catch (error) {
      alert('Something went wrong: ' + error.message);
      voiceStatus.textContent = 'Analysis failed.';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  showHome();
  renderHistory();
  enableControls();
});