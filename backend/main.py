from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from PIL import Image
import io

app = FastAPI(title="AgriSmart AI Backend")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_crop(
    image: UploadFile = File(...),
    crop_type: str = Form("Unknown"),
    location: str = Form("Lucknow, UP")
):
    try:
        # Read image
        image_bytes = await image.read()
        img = Image.open(io.BytesIO(image_bytes))
        
        # Simulate disease detection (Replace with real ML model later)
        disease = "Early Blight"
        confidence = 0.87

        # AI Advice using Groq (or you can use Gemini)
        advice = f"""
        Crop: {crop_type}
        Disease: {disease}
        
        Recommendations:
        1. Apply neem oil or Mancozeb spray.
        2. Remove affected leaves promptly.
        3. Improve air circulation around the plants.
        
        Fertilizer advice: Nitrogen 80 kg/acre, Phosphorus 40 kg/acre.
        """

        return {
            "status": "success",
            "disease": disease,
            "confidence": confidence,
            "advice": advice,
            "crop": crop_type,
            "location": location,
            "fertilizer": {
                "N": "80 kg/acre",
                "P": "40 kg/acre",
                "K": "40 kg/acre"
            }
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/voice-analyze")
async def voice_analyze(text: str = Form(...)):
    # Here you can process voice text
    return {
        "status": "success",
        "disease": "Leaf Blast",
        "advice": "Your crop appears to have Leaf Blast. Apply a suitable fungicide and monitor leaf condition closely."
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)