# AI Prompts Used in Development

This document contains the actual prompts used during development of this project. The project started as a Cloudflare Workers AI template for weather information and was transformed into a Resume & Cover Letter Generator.

---

## Project Transformation

**Original Project:** Cloudflare Workers AI template for weather/agent functionality  
**New Project:** AI-powered Resume & Cover Letter Generator

---

## Development Prompts

### 1. Initial Cleanup and Feature Planning

**Context:** Starting with an existing Cloudflare Workers AI template that had weather/agent functionality and self edited to make it a resume enhancer

**Prompt:**

```
Go through the whole project and clean it. Remove unwanted code and comments and packages and clean the whole thing.

Then add feature like people can upload their current resume and also have option to just provide the job link instead of filling those boxes (both options will be there). Update the frontend and backend and ai according to this. Also provide an updated pdf resume, cover letter as output.
```

---

### 2. Resume Parsing Issue

**Context:** After implementing resume upload, the feature wasn't working

**Prompt:**

```
resume parsing is not working. Please check
```

---

### 3. PDF Parsing Error

**Context:** Getting DOMMatrix error when trying to parse PDFs on the server

**Prompt:**

```
Error: Failed to parse PDF: DOMMatrix is not defined. Please try uploading a TXT file or manually entering your information.

Do one thing, parse the pdf in frontend in the browser env. That will be easy I guess
```

---

### 4. Worker Script 404 Error

**Context:** PDF.js worker script failing to load from CDN

**Prompt:**

```
pdfjs-dist.js:14502 GET https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.296/pdf.worker.min.js?import net::ERR_ABORTED 404 (Not Found)
```

---

### 5. Continued Worker Issues

**Context:** Still getting 404 errors with the worker script

**Prompt:**

```
same pdfjs-dist.js:14502 GET https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.296/pdf.worker.min.js net::ERR_ABORTED 404 (Not Found)

Why do I need worker and stuffs for pdf parsing? If i parse it in the browser and send only the text to backend
```

---

### 6. Worker Source Not Specified

**Context:** Trying to disable worker but getting error that workerSrc is required

**Prompt:**

```
app.tsx:160 Error parsing resume: Error: No "GlobalWorkerOptions.workerSrc" specified.
```

---

### 7. Documentation Request

**Context:** Need to add proper documentation for submission

**Prompt:**

```
must include a README.md file with project documentation and clear running instructions to try out components (either locally or via deployed link). AI-assisted coding is encouraged, but you must include AI prompts used in PROMPTS.md

Do these for the project
```

---

### 8. Test Resume Documentation

**Context:** Added test resume file, need to document it

**Prompt:**

```
I have put a test resume file. Add in the readme that the test resume can be used or any other they want.
```
