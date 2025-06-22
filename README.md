# Custom API Rate Limiter

This project demonstrates four custom-built rate limiter strategies — Sliding Window, Token Bucket, Fixed Window, and Leaky Bucket— implemented in Node.js. It’s designed to help understand core concepts behind rate-limiting algorithms without relying on external libraries like express-rate-limit or Redis.

## 📁 Project Structure

```bash
├── src/
│   ├── strategies/
│   │   ├── abstract.js
│   │   ├── fixedWindow.js
│   │   ├── leakyBucket.js
│   │   ├── slidingWindow.js
│   │   └── tokenBucket.js
│   └── middlewares/
│       └── rateLimiter.js
│   └── index.js         # Exports all strategies and the middleware
├── example/
│   └── app.js           # Entry Express server to test the limiters
```

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/priyanshubisht10/rate-limiter.git

# Move into the project directory
cd rate-limiter

# Install dependencies
npm install

# Start the server
npm start 
```
Server would be live at: `http://localhost:3000`

## 📦 How to Use and Test

You can use Postman, Thunder Client, or even using PowerShell and `curl` with the following command:

```powershell
for ($i = 1; $i -le 10; $i++) {
    curl http://localhost:3000/sliding
    Start-Sleep -Milliseconds 500
}
```
Example Successful Response:
```
StatusCode        : 200
StatusDescription : OK
Content           : {"message":"Allowed req from sliding window limiter"}
```
After 5 allowed requests (based on the strategy), you'll get:
```bash
curl : {"message":"Too many requests"}
```

⚠️ Note: If curl doesn't work on your system, you can test the limiter by spamming requests manually using Postman on:
```
GET http://localhost:3000/sliding
```

## 🧪 Sliding Window Rate Limiter: Usage in Code

Below is how you use the `SlidingWindowLimiter` in your Express app.

### ✅ Step-by-step Implementation

```js
import {
  createRateLimiter,
  SlidingWindowLimiter
} from '../src/index.js';

// 1. Create an instance of the limiter
const slidingLimiter = new SlidingWindowLimiter({
  maxReq: 5,                  // Max 5 requests
  windowSizeInSeconds: 10     // In a 10-second sliding window
});

// 2. Apply rate limiter middleware to a specific route
app.use('/sliding', createRateLimiter(slidingLimiter));

// 3. Add the actual route logic
app.get('/sliding', (req, res) => {
  res.json({ message: 'Allowed req from sliding window limiter' });
});
```
### 🙏 Thank You!

Thank you for taking the time to explore this project.
