import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

# Configure
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

# Test configuration
print("🔧 Testing Cloudinary Configuration...")
print(f"Cloud Name: {os.getenv('CLOUDINARY_CLOUD_NAME')}")
print(f"API Key: {os.getenv('CLOUDINARY_API_KEY')[:10]}...")  # Show only first 10 chars

try:
    # Test API connection
    result = cloudinary.api.ping()
    print("✅ Cloudinary connection successful!")
    print(f"Status: {result.get('status')}")
except Exception as e:
    print(f"❌ Cloudinary connection failed: {e}")