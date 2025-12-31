# Gemini API Setup & Troubleshooting

## Current Configuration

The app uses **Gemini Pro** model via the v1 API endpoint:
```
https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent
```

## If You Get "Model Not Found" Error

### Option 1: Check API Key Permissions
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Check that your API key has access to Gemini Pro
3. Some API keys may only have access to specific models

### Option 2: Try Different Model Names

If `gemini-pro` doesn't work, you can try these alternatives by editing `src/lib/actions/ai.ts`:

**For v1 API:**
- `gemini-pro` (current)
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`

**For v1beta API:**
- `gemini-1.5-pro`
- `gemini-1.5-flash`

### Option 3: Check Available Models

You can list available models by calling:
```
GET https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY
```

Or use the Google AI Studio to see which models you have access to.

## Common Issues

### "404 Model Not Found"
- **Cause**: API key doesn't have access to that model, or model name is incorrect
- **Solution**: 
  1. Verify API key in Google AI Studio
  2. Try `gemini-pro` (most widely available)
  3. Check API key permissions in Google Cloud Console

### "API Key Not Configured"
- **Cause**: Missing `GEMINI_API_KEY` in `.env.local`
- **Solution**: Add `GEMINI_API_KEY=your_key_here` to `.env.local`

### "Quota Exceeded"
- **Cause**: API usage limit reached
- **Solution**: Check your quota in Google Cloud Console

## Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key or use existing one
4. Copy the key to your `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Testing the API

You can test if your API key works by running:
```bash
curl "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }]
  }'
```

If this works, the API key is valid and the model is accessible.

