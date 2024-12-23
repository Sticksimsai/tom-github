const express = require('express');
const Twitter = require('twitter-v2');
const canvas = require('canvas'); // For dynamic meme generation
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Twitter API client setup
const twitterClient = new Twitter({
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

// Middleware to parse JSON
app.use(express.json());

// Function to generate a meme image dynamically
async function createMeme(ticker, character) {
  const { createCanvas, loadImage } = canvas;
  const canvasWidth = 800;
  const canvasHeight = 400;
  const memeCanvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = memeCanvas.getContext('2d');

  // Load a background image
  const background = await loadImage('./templates/meme_background.jpg');
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

  // Add text (ticker and character-related message)
  ctx.fillStyle = 'white';
  ctx.font = 'bold 40px Arial';
  ctx.fillText(`${ticker} to the moon?`, 50, 100);

  ctx.font = 'italic 30px Arial';
  ctx.fillText(`${character} says: "+1000x guaranteed!"`, 50, 200);

  // Save the meme as a buffer
  return memeCanvas.toBuffer('image/png');
}

// Endpoint to reply to tweets with a meme
app.post('/webhook/twitter', async (req, res) => {
  try {
    const { tweet_id, user, text } = req.body;

    // Extract ticker and character
    const ticker = text.match(/\\$[A-Z]+/g)?.[0] || "$STICK";
    const character = "Tom";

    // Generate meme
    const memeBuffer = await createMeme(ticker, character);

    // Upload media to Twitter
    const media = await twitterClient.post('media/upload', {
      media: memeBuffer,
    });

    // Post a reply
    const status = await twitterClient.post('statuses/update', {
      status: `@${user} Here's your meme! ${character} rules the Stickverse.`,
      in_reply_to_status_id: tweet_id,
      media_ids: media.media_id_string,
    });

    res.status(200).json({ success: true, tweet: status });
  } catch (error) {
    console.error('Error handling Twitter webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
