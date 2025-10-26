import { useState } from "react";
import { Button } from "@/components/button/Button";
import { Card } from "@/components/card/Card";
import { Textarea } from "@/components/textarea/Textarea";
import { MemoizedMarkdown } from "@/components/memoized-markdown";
import {
  Moon,
  Sun,
  FileText,
  Sparkle,
  Copy,
  Check,
  Upload,
  Link as LinkIcon,
  Download
} from "@phosphor-icons/react";

export default function ResumeGenerator() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme as "dark" | "light") || "dark";
  });

  const [inputMode, setInputMode] = useState<"manual" | "link">("manual");
  const [jobLink, setJobLink] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [userExperience, setUserExperience] = useState("");
  const [userName, setUserName] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [generationType, setGenerationType] = useState<
    "resume" | "cover-letter" | "both"
  >("both");

  const [isLoading, setIsLoading] = useState(false);
  const [isParsingLink, setIsParsingLink] = useState(false);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCover, setCopiedCover] = useState(false);

  useState(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  });

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".txt")
    ) {
      alert("Please upload a PDF or TXT file. DOCX support coming soon!");
      return;
    }

    setResumeFile(file);
    setIsLoading(true);

    try {
      let extractedText = '';

      if (fileName.endsWith('.txt')) {
        // Simple text file - just read it
        extractedText = await file.text();
      } else if (fileName.endsWith('.pdf')) {
        // Parse PDF in browser using pdfjs-dist
        const pdfjsLib = await import('pdfjs-dist');
        
        // Use bundled worker from node_modules
        const workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const textParts: string[] = [];

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
          if (pageText.trim()) {
            textParts.push(pageText);
          }
        }

        extractedText = textParts.join('\n').trim();

        if (!extractedText || extractedText.length < 50) {
          alert("Could not extract text from PDF. The PDF might be scanned or image-based. Please try uploading a TXT file.");
          setResumeFile(null);
          setIsLoading(false);
          return;
        }
      }

      console.log(`Extracted ${extractedText.length} characters from file`);

      // Send extracted text to backend for AI parsing
      const response = await fetch("/parse-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: extractedText })
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          name?: string;
          experience?: string;
          skills?: string;
          education?: string;
        };
        error?: string;
      };

      if (result.success && result.data) {
        if (result.data.name) setUserName(result.data.name);
        if (result.data.experience) setUserExperience(result.data.experience);
        if (result.data.skills) setSkills(result.data.skills);
        if (result.data.education) setEducation(result.data.education);
        alert("Resume parsed successfully! Please review and edit the auto-filled information.");
      } else {
        alert(`Error: ${result.error || "Failed to parse resume"}`);
        setResumeFile(null);
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      alert("Failed to parse resume. Please try again or enter information manually.");
      setResumeFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseJobLink = async () => {
    if (!jobLink.trim()) {
      alert("Please enter a job link");
      return;
    }

    setIsParsingLink(true);
    try {
      const response = await fetch("/parse-job-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: jobLink })
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          description?: string;
        };
        error?: string;
      };

      if (result.success && result.data) {
        setJobDescription(result.data.description || "");
      } else {
        alert(`Error: ${result.error || "Could not parse job link"}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsParsingLink(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !userExperience.trim()) {
      alert("Please fill in both Job Description and Your Experience");
      return;
    }

    setIsLoading(true);
    setResume("");
    setCoverLetter("");
    setKeywords([]);
    setSuggestions([]);

    try {
      const response = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jobDescription,
          userExperience,
          userName: userName || undefined,
          skills: skills || undefined,
          education: education || undefined,
          type: generationType
        })
      });

      const result = (await response.json()) as {
        success: boolean;
        data?: {
          resume?: string;
          coverLetter?: string;
          keywords?: string[];
          suggestions?: string[];
        };
        error?: string;
      };

      if (result.success && result.data) {
        if (result.data.resume) setResume(result.data.resume);
        if (result.data.coverLetter) setCoverLetter(result.data.coverLetter);
        if (result.data.keywords) setKeywords(result.data.keywords);
        if (result.data.suggestions) setSuggestions(result.data.suggestions);
      } else {
        alert(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "resume" | "cover") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "resume") {
        setCopiedResume(true);
        setTimeout(() => setCopiedResume(false), 2000);
      } else {
        setCopiedCover(true);
        setTimeout(() => setCopiedCover(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const downloadPDF = async (type: "resume" | "cover-letter") => {
    try {
      const content = type === "resume" ? resume : coverLetter;
      const response = await fetch("/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content, type })
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Failed to download PDF");
    }
  };

  return (
    <div className="min-h-screen w-full p-4 bg-fixed">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#F48120]/10 text-[#F48120] rounded-full p-3">
              <FileText size={32} weight="duotone" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Resume & Cover Letter Generator
              </h1>
              <p className="text-muted-foreground">
                AI-powered, ATS-optimized, tailored to your dream job
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="md"
            shape="square"
            className="rounded-full h-10 w-10"
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkle size={20} className="text-[#F48120]" />
                Job & Experience Details
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  What do you need?
                </label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={generationType === "resume" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setGenerationType("resume")}
                  >
                    Resume Only
                  </Button>
                  <Button
                    variant={
                      generationType === "cover-letter" ? "primary" : "ghost"
                    }
                    size="sm"
                    onClick={() => setGenerationType("cover-letter")}
                  >
                    Cover Letter Only
                  </Button>
                  <Button
                    variant={generationType === "both" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setGenerationType("both")}
                  >
                    Both
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Upload Your Resume (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-md p-4 text-center hover:border-[#F48120] transition-colors">
                      <Upload
                        size={24}
                        className="mx-auto mb-2 text-muted-foreground"
                      />
                        <p className="text-sm text-muted-foreground">
                          {resumeFile
                            ? resumeFile.name
                            : "Click to upload PDF or TXT"}
                        </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
                {resumeFile && (
                  <p className="text-xs text-[#F48120] mt-2">
                    ✓ Resume uploaded - fields auto-filled below
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Input Method
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={inputMode === "manual" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setInputMode("manual")}
                  >
                    Manual Entry
                  </Button>
                  <Button
                    variant={inputMode === "link" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setInputMode("link")}
                  >
                    Job Link
                  </Button>
                </div>
              </div>

              {inputMode === "link" ? (
                <div className="mb-4">
                  <label
                    htmlFor="job-link"
                    className="block text-sm font-medium mb-2"
                  >
                    Job Posting URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="job-link"
                      type="url"
                      placeholder="https://example.com/job-posting"
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
                      value={jobLink}
                      onChange={(e) => setJobLink(e.target.value)}
                    />
                    <Button
                      onClick={handleParseJobLink}
                      disabled={isParsingLink || !jobLink.trim()}
                      size="sm"
                    >
                      {isParsingLink ? (
                        <>
                          <Sparkle className="animate-spin mr-2" size={16} />
                          Parsing...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2" size={16} />
                          Parse
                        </>
                      )}
                    </Button>
                  </div>
                  {jobDescription && (
                    <p className="text-xs text-[#F48120] mt-2">
                      ✓ Job description parsed successfully
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <label
                    htmlFor="job-description"
                    className="block text-sm font-medium mb-2"
                  >
                    Job Description *
                  </label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the full job description here..."
                    className="mt-2 min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="user-experience"
                  className="block text-sm font-medium mb-2"
                >
                  Your Experience *
                </label>
                <Textarea
                  id="user-experience"
                  placeholder="Describe your relevant work experience, projects, and achievements..."
                  className="mt-2 min-h-[150px]"
                  value={userExperience}
                  onChange={(e) => setUserExperience(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name (optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium mb-2"
                  >
                    Skills (optional)
                  </label>
                  <input
                    id="skills"
                    type="text"
                    placeholder="JavaScript, React, Node.js, etc."
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium mb-2"
                  >
                    Education (optional)
                  </label>
                  <input
                    id="education"
                    type="text"
                    placeholder="BS in Computer Science, MIT"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleGenerate}
                disabled={
                  isLoading || !jobDescription.trim() || !userExperience.trim()
                }
              >
                {isLoading ? (
                  <>
                    <Sparkle className="animate-spin mr-2" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkle className="mr-2" size={16} />
                    Generate{" "}
                    {generationType === "both"
                      ? "Resume & Cover Letter"
                      : generationType === "resume"
                        ? "Resume"
                        : "Cover Letter"}
                  </>
                )}
              </Button>
            </Card>
          </div>

          <div className="space-y-4">
            {resume && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Resume</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(resume, "resume")}
                    >
                      {copiedResume ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <Copy size={16} className="mr-2" />
                      )}
                      {copiedResume ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadPDF("resume")}
                    >
                      <Download size={16} className="mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <MemoizedMarkdown id="resume" content={resume} />
                </div>
              </Card>
            )}

            {coverLetter && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Your Cover Letter</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(coverLetter, "cover")}
                    >
                      {copiedCover ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <Copy size={16} className="mr-2" />
                      )}
                      {copiedCover ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadPDF("cover-letter")}
                    >
                      <Download size={16} className="mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <MemoizedMarkdown id="cover-letter" content={coverLetter} />
                </div>
              </Card>
            )}

            {keywords.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">🔑 ATS Keywords</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Make sure these keywords appear in your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#F48120]/10 text-[#F48120] rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {suggestions.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-3">💡 Suggestions</h3>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-[#F48120] mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {!resume && !coverLetter && !isLoading && (
              <Card className="p-12 text-center">
                <FileText
                  size={64}
                  className="mx-auto mb-4 text-muted-foreground"
                  weight="duotone"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Ready to Create Your Resume?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Upload your resume or paste job details, then click Generate!
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>✨ AI-powered content generation</p>
                  <p>📊 ATS-optimized formatting</p>
                  <p>🎯 Tailored to job requirements</p>
                  <p>⚡ Generated in seconds</p>
                  <p>📄 Download as PDF</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
