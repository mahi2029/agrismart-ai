// Tab Switching
function showTab(n) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  if (n === 0) {
    document.getElementById('photo-tab').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else {
    document.getElementById('voice-tab').style.display = 'block';
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
}

// Image Upload Handler
const apiBaseUrl = 'http://127.0.0.1:8000';

document.getElementById('image-upload').addEventListener('change', async function(e) {
  if (e.target.files.length === 0) {
    return;
  }

  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('image', file);
  formData.append('crop_type', 'Tomato');
  formData.append('location', 'Lucknow, UP');

  alert('✅ फोटो अपलोड हो गई! विश्लेषण हो रहा है...');

  try {
    const response = await fetch(`${apiBaseUrl}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const result = await response.json();
    localStorage.setItem('analysisResult', JSON.stringify(result));
    window.location.href = 'results.html';
  } catch (error) {
    alert('कुछ गलत हुआ: ' + error.message);
  }
});

// Voice Recording Simulation
let isRecording = false;
const recordBtn = document.getElementById('record-btn');
const voiceStatus = document.getElementById('voice-status');

recordBtn.addEventListener('click', async () => {
  isRecording = !isRecording;
  
  if (isRecording) {
    recordBtn.style.background = '#ef4444';
    recordBtn.innerHTML = '<i class="fas fa-stop"></i>';
    voiceStatus.textContent = 'बोल रहे हैं... 🎙️';
  } else {
    recordBtn.style.background = '#166534';
    recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceStatus.textContent = 'आपकी आवाज का विश्लेषण हो रहा है...';

    const voiceText = prompt('कृपया अपनी समस्या हिंदी में लिखें:', 'पत्तियां पीली हो रही हैं और दाने सूख रहे हैं');
    if (!voiceText) {
      voiceStatus.textContent = 'कोई आवाज़ टेक्स्ट नहीं मिला।';
      return;
    }

    try {
      const payload = new URLSearchParams();
      payload.append('text', voiceText);

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

      const result = await response.json();
      localStorage.setItem('analysisResult', JSON.stringify({
        crop: 'Unknown',
        disease: result.disease,
        advice: result.advice,
      }));
      window.location.href = 'results.html';
    } catch (error) {
      alert('कुछ गलत हुआ: ' + error.message);
      voiceStatus.textContent = 'विश्लेषण विफल रहा।';
    }
  }
});