# 📝 AI Resume & Cover Letter Generator

An intelligent resume and cover letter generator powered by Cloudflare Workers AI that creates **ATS-optimized, job-tailored documents** in seconds.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)

## Link

https://resume-generator.anasfarazi0151.workers.dev/

## 🌟 Features

### Core Functionality

- 🤖 **AI-Powered Generation** - Uses Cloudflare Workers AI (Llama 3.1 8B)
- 📄 **Resume Generation** - Professional, ATS-optimized bullet points with action verbs
- 💌 **Cover Letter Writing** - Compelling, personalized cover letters
- 📤 **Resume Upload** - Upload existing resume (PDF/TXT) to auto-fill fields
- 🔗 **Job Link Parsing** - Paste job posting URL to extract description automatically
- 📥 **PDF Export** - Download resume and cover letter as professional PDFs
- 🔑 **Keyword Extraction** - Identifies important ATS keywords from job description
- 💡 **Smart Suggestions** - Get actionable tips to improve your application

### User Experience

- ⚡ **Lightning Fast** - Generate documents in 5-10 seconds
- 🎯 **Job-Tailored** - Matches your experience to specific job requirements
- 📋 **Copy to Clipboard** - Easy copying for online applications
- 🌓 **Dark/Light Mode** - Comfortable viewing in any environment
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/TasnimAnas/cf_ai_resume_ehancer_cloudflare_test.git
cd cf_ai_resume_ehancer_cloudflare_test

# Install main app dependencies
npm install
```

### Running Locally

**Terminal: Main Application (Port 5173)**

```bash
npm start
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

### Test Resume

A sample resume file (`test_resume.pdf`) is included in the project root for testing purposes. You can use this file to test the resume upload feature, or upload your own resume in PDF or TXT format.

## 📖 How to Use

### Option 1: Quick Start with Resume Upload

1. **Upload Your Resume**
   - Click "Upload Your Resume"
   - Select PDF or TXT file
   - System automatically extracts your information
   - Review and edit auto-filled fields

2. **Add Job Details**
   - Choose "Job Link" mode
   - Paste the job posting URL
   - Click "Parse" to extract description
   - OR manually paste job description

3. **Generate Documents**
   - Select what you need (Resume, Cover Letter, or Both)
   - Click "Generate"
   - Wait 5-10 seconds

4. **Download & Use**
   - Review generated documents
   - Click "PDF" to download
   - Copy text for online applications

### Option 2: Manual Entry

1. **Choose Document Type**
   - Resume Only
   - Cover Letter Only
   - Both (Recommended)

2. **Enter Job Information**
   - Paste full job description
   - Include requirements and responsibilities

3. **Enter Your Information**
   - Work experience (Required)
   - Skills (Optional)
   - Education (Optional)
   - Name (Optional - for cover letter)

4. **Generate & Download**
   - Click "Generate"
   - Review results
   - Download as PDF or copy text

## 🎯 What You Get

### Professional Resume

- **Professional Summary** - 2-3 sentences highlighting relevant experience
- **Key Skills** - Matched to job requirements
- **Work Experience** - Powerful bullet points with action verbs and metrics
- **Education** - Professionally formatted
- **ATS-Optimized** - Passes applicant tracking systems

### Compelling Cover Letter

- **Engaging Opening** - Shows enthusiasm for the role
- **Key Achievements** - 2-3 relevant accomplishments
- **Company Understanding** - Demonstrates research
- **Strong Closing** - Clear call to action
- **Professional Tone** - Personable yet formal

### Additional Features

- **Top 15 ATS Keywords** - From job description
- **3-5 Improvement Suggestions** - Actionable tips
- **Copy to Clipboard** - One-click copying
- **PDF Export** - Professional formatting

## 💡 Tips for Best Results

### Resume Upload

✅ Use TXT format for best compatibility  
✅ PDF works if text-based (not scanned)  
✅ Ensure text is selectable in PDF  
❌ Scanned/image PDFs won't work  
💡 If PDF fails, save as TXT and try again

### Job Link

✅ Use direct job posting URLs  
✅ Works with LinkedIn, Indeed, company sites  
✅ Ensure page is publicly accessible  
❌ Login-required pages won't work

### Manual Entry

✅ Include full job description  
✅ Keep company name and role title  
✅ Include all requirements  
✅ Be specific about achievements  
✅ Include numbers and metrics

## 🏗️ Architecture

### Tech Stack

**Frontend**

- React 19 + TypeScript
- Tailwind CSS for styling
- Vite for building
- pdfjs-dist for PDF parsing
- pdf-lib for PDF generation

**Backend**

- Cloudflare Workers (serverless)
- Cloudflare Workers AI (Llama 3.1 8B)
- TypeScript

**Development**

- Vitest for testing
- Biome for linting
- Prettier for formatting

### Project Structure

```
agents-starter/
├── src/
│   ├── app.tsx              # Main React application
│   ├── client.tsx           # React DOM entry point
│   ├── server.ts            # Cloudflare Worker backend
│   ├── components/          # UI components
│   │   ├── button/
│   │   ├── card/
│   │   ├── textarea/
│   │   └── ...
│   └── styles.css           # Global styles
├── tests/
│   └── index.test.ts        # Backend tests
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── wrangler.jsonc           # Cloudflare config
└── README.md                # This file
```

## 🧪 Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## 🚀 Deployment

Note the deployed URL (e.g., `https://resume-ai-worker.your-subdomain.workers.dev`)

### Update Main App Configuration

Edit `src/server.ts` and update the AI Worker URL:

```typescript
// Change all instances of:
const response = await fetch("http://localhost:8787", {
  // to:
const response = await fetch("https://resume-ai-worker.your-subdomain.workers.dev", {
```

### Deploy Main App

```bash
npm run deploy
```

Your app will be live at: `https://resume-generator.your-subdomain.workers.dev`

## 📊 API Endpoints

### POST /generate

Generate resume and/or cover letter.

**Request:**

```json
{
  "jobDescription": "string (required)",
  "userExperience": "string (required)",
  "userName": "string (optional)",
  "skills": "string (optional)",
  "education": "string (optional)",
  "type": "resume | cover-letter | both"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "resume": "string",
    "coverLetter": "string",
    "keywords": ["string"],
    "suggestions": ["string"]
  }
}
```

### POST /parse-resume

Parse resume text and extract information.

**Request:**

```json
{
  "text": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "string",
    "experience": "string",
    "skills": "string",
    "education": "string"
  }
}
```

### POST /parse-job-link

Parse job posting URL and extract description.

**Request:**

```json
{
  "url": "string (required)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "description": "string",
    "title": "string",
    "company": "string"
  }
}
```

### POST /generate-pdf

Generate PDF from markdown content.

**Request:**

```json
{
  "content": "string (required)",
  "type": "resume | cover-letter"
}
```

**Response:** PDF file download

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "message": "Resume Generator Service is running",
  "features": ["array of features"]
}
```

## 🔧 Configuration

### Customize AI Model

Edit `/src/server.ts`:

```javascript
const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
  prompt: data.prompt,
  max_tokens: 2048 // Adjust for longer/shorter responses
});
```

Available models:

- `@cf/meta/llama-3.1-8b-instruct` (default, fast)
- `@cf/meta/llama-3.1-70b-instruct` (more powerful, slower)

### Customize Prompts

Edit `src/server.ts` to modify generation prompts for resumes and cover letters.

## 🐛 Troubleshooting

### AI Worker Not Running

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 8787
lsof -ti:8787 | xargs kill -9
```

### Resume Upload Not Working

- Ensure file is PDF or TXT
- PDF must be text-based (not scanned)
- Try saving as TXT if PDF fails
- Check browser console for errors

### Job Link Parsing Fails

- Ensure URL is publicly accessible
- Try copying description manually
- Some sites block automated access

### PDF Generation Fails

- Check that content is valid markdown
- Ensure pdf-lib is installed
- Check browser console for errors

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Run tests (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow existing code style
- Add comments for complex logic
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) for AI inference
- [pdfjs-dist](https://github.com/mozilla/pdf.js) for PDF parsing
- [pdf-lib](https://github.com/Hopding/pdf-lib) for PDF generation
- [React](https://react.dev/) for the UI framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## 📞 Support

For issues, questions, or suggestions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](../../issues)
3. Create a new issue with detailed information

## 🗺️ Roadmap

- [ ] Multiple resume templates
- [ ] DOCX file support
- [ ] Save/load drafts
- [ ] Resume scoring
- [ ] Interview prep questions
- [ ] LinkedIn profile optimization
- [ ] Email follow-up templates
- [ ] Browser extension
- [ ] OCR for scanned PDFs

## 📈 Performance

- Initial load: ~500ms
- Resume generation: 5-10 seconds
- PDF generation: 1-2 seconds
- Resume parsing: 2-5 seconds

## 🔒 Privacy & Security

- No data stored permanently
- All processing happens in real-time
- Files parsed in browser (never uploaded until processed)
- No third-party tracking
- No user data logged

---

**Built with ❤️ to help job seekers land their dream jobs faster!**

**Star ⭐ this repo if you find it helpful!**
