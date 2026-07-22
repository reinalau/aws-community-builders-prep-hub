import { useState, useEffect, useRef } from "react";
import {
  Cloud,
  Globe,
  Gift,
  Lightbulb,
  ClipboardCheck,
  Sparkles,
  Briefcase,
  Flame,
  HeartHandshake,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  PenTool,
  Check,
  Copy,
  Plus,
  Trash2,
  HelpCircle,
  Send,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Coins,
  Link,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DEFAULT_SLIDES, TRACK_OPTIONS, FAQS, STEP_BY_STEP_GUIDE, USEFUL_LINKS } from "./data";
import { Slide, ContributionLink, ApplicationDraft, AIReviewResult, TrackInfo, UsefulLink } from "./types";

export default function App() {
  // Tabs: presentation, draft-builder, resources, useful-links
  const [activeTab, setActiveTab] = useState<"presentation" | "draft-builder" | "resources" | "useful-links">("presentation");

  // Slide Presenter States
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Application Draft Worksheet States
  const [draft, setDraft] = useState<ApplicationDraft>({
    track: "serverless",
    contributions: "",
    motivation: "",
    links: [
      { id: "1", url: "", type: "blog" }
    ]
  });

  // AI review process states
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<AIReviewResult | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedLinkCategory, setSelectedLinkCategory] = useState<string>("all");

  // Loading animation state messages
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Analizando la alineación con tu Track técnico...",
    "Validando la calidad e impacto de tus enlaces...",
    "Reestructurando tu redacción para que suene proactiva...",
    "Redactando propuestas de mejora personalizadas...",
    "Generando un mensaje de aliento con todo el poder femenino..."
  ];

  // Auto-play slideshow logic
  useEffect(() => {
    if (isPlaying) {
      slideshowTimerRef.current = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => {
          if (prevIndex === slides.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 5000);
    } else {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    }

    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    };
  }, [isPlaying, slides.length]);

  // Loading process simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReviewing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isReviewing]);


  // Handle Fullscreen of slide container
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Draft link helpers
  const handleAddLink = () => {
    const newLink: ContributionLink = {
      id: Date.now().toString(),
      url: "",
      type: "blog"
    };
    setDraft({
      ...draft,
      links: [...draft.links, newLink]
    });
  };

  const handleRemoveLink = (id: string) => {
    if (draft.links.length === 1) return; // Keep at least one
    setDraft({
      ...draft,
      links: draft.links.filter((link) => link.id !== id)
    });
  };

  const handleUpdateLink = (id: string, field: "url" | "type", value: string) => {
    setDraft({
      ...draft,
      links: draft.links.map((link) => {
        if (link.id === id) {
          return { ...link, [field]: value };
        }
        return link;
      })
    });
  };


  // Call the server Gemini API endpoint
  const handleReviewDraft = async () => {
    setIsReviewing(true);
    setReviewResult(null);
    setReviewError(null);
    try {
      const LAMBDA_REVIEW_URL = import.meta.env.VITE_LAMBDA_REVIEW_URL;
      const response = await fetch(LAMBDA_REVIEW_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track: draft.track,
          contributionsDescription: draft.contributions,
          motivationDescription: draft.motivation,
          links: draft.links
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal al contactar la IA de mentoría.");
      }

      setReviewResult(data);
    } catch (err: any) {
      setReviewError(err.message || "No se pudo conectar con el servidor para revisar el borrador.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCopyToClipboard = (text: string, sectionInResult: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionInResult);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Get current slide details
  const activeSlide = slides[currentSlideIndex];

  // Helper mapping string icon name to Lucide elements
  const renderSlideIcon = (iconName: string) => {
    switch (iconName) {
      case "Cloud":
        return <Cloud className="w-12 h-12 text-orange-500 animate-pulse" />;
      case "Globe":
        return <Globe className="w-12 h-12 text-blue-400" />;
      case "Gift":
        return <Gift className="w-12 h-12 text-yellow-500" />;
      case "Lightbulb":
        return <Lightbulb className="w-12 h-12 text-amber-400" />;
      case "ClipboardCheck":
        return <ClipboardCheck className="w-12 h-12 text-emerald-400" />;
      case "Sparkles":
        return <Sparkles className="w-12 h-12 text-pink-400" />;
      case "Briefcase":
        return <Briefcase className="w-12 h-12 text-indigo-400" />;
      case "Flame":
        return <Flame className="w-12 h-12 text-red-500" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-12 h-12 text-rose-500" />;
      case "Heart":
      case "GreenHeart":
        return <Heart className="w-12 h-12 text-emerald-500 fill-emerald-500/15" />;
      case "Coins":
        return <Coins className="w-12 h-12 text-amber-500 fill-amber-500/15" />;
      case "CommunityBuildersBadge":
        return <img src="/Community Builders badge 800px.png" alt="AWS Community Builders" className="w-16 h-16 object-contain mx-auto select-none" />;
      default:
        return <Cloud className="w-12 h-12 text-orange-500" />;
    }
  };

  const selectedTrackInfo = TRACK_OPTIONS.find(t => t.key === draft.track);

  return (
    <div className="min-h-screen bg-editorial-bg text-[#1A1A1A] flex flex-col font-sans relative overflow-x-hidden selection:bg-aws-orange selection:text-white pb-6">
      {/* Top fine accent line */}
      <div className="h-1 bg-aws-orange w-full"></div>

      {/* Main Header */}
      <header className="border-b border-black/10 bg-white/95 backdrop-blur sticky top-0 z-40 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3.5 select-none">
            <img src="/Community Builders badge 800px.png" alt="AWS Community Builders Logo" className="h-10 sm:h-12 w-auto object-contain flex-shrink-0" />
            <div>
              <h1 className="font-serif italic font-bold text-xl leading-tight tracking-tight text-[#1A1A1A] flex items-center gap-2">
                AWS Community Builders Hub
              </h1>
              <p className="text-[11px] text-slate-500 font-sans">Guía interactiva, resolución de dudas y taller de postulaciones con mentoría de IA</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="w-full sm:w-auto flex items-center gap-1 bg-white p-1 rounded-lg border border-black/10 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveTab("presentation")}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === "presentation"
                ? "bg-aws-navy text-white shadow-sm"
                : "text-slate-600 hover:text-black hover:bg-[#E4B8FD]"
                }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Diapositivas</span>
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === "resources"
                ? "bg-aws-navy text-white shadow-sm"
                : "text-slate-600 hover:text-black hover:bg-[#E4B8FD]"
                }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>FAQs y Consejos de Oro</span>
            </button>
            <button
              onClick={() => setActiveTab("draft-builder")}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === "draft-builder"
                ? "bg-aws-navy text-white shadow-sm"
                : "text-slate-600 hover:text-black hover:bg-[#E4B8FD]"
                }`}
            >
              <PenTool className="w-3.5 h-3.5 shrink-0" />
              <span>Taller de Borrador (IA)</span>
            </button>
            <button
              onClick={() => setActiveTab("useful-links")}
              className={`px-3.5 sm:px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${activeTab === "useful-links"
                ? "bg-aws-navy text-white shadow-sm"
                : "text-slate-600 hover:text-black hover:bg-[#E4B8FD]"
                }`}
            >
              <Link className="w-3.5 h-3.5 shrink-0" />
              <span>Links Útiles</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {/* TAB 1: PRESENTATION PLAYER WITH CUSTOMIZATION SIDEBAR */}
        {activeTab === "presentation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Slide Viewer (Left/Center 8 cols) */}
            <div className={`flex flex-col gap-4 lg:col-span-8 ${isFullscreen ? "fixed inset-0 z-50 bg-[#E4B8FD] p-6 flex flex-col justify-between" : ""}`}>

              {/* Actual Interactive Slide Frame */}
              <div
                id="slide-player"
                className={`w-full min-h-[360px] sm:min-h-0 sm:aspect-[16/10] bg-[#F9F7F2] text-[#1A1A1A] rounded-xl border border-black/15 shadow-md relative overflow-hidden flex flex-row p-0 ${isFullscreen ? "h-full rounded-none" : ""}`}
              >
                {/* LEFT RAIL: Navigation & Identity (Visual Theme Anchor) */}
                <div className="w-8 sm:w-16 border-r border-black/10 flex flex-col justify-between py-4 sm:py-6 items-center bg-white flex-shrink-0 select-none">
                  <div className="label-sans vertical-text text-[8px] sm:text-[9px] text-[#1a1a1a]/45 tracking-wider select-none">AWS COMMUNITY BUILDERS</div>

                  <div className="label-sans vertical-text text-[8px] sm:text-[9px] text-[#1a1a1a]/45 tracking-wider select-none">EDITION 2026</div>
                </div>

                {/* MAIN CONTENT AREA OF SLIDE */}
                <div className="flex-grow flex flex-col justify-between p-4 sm:p-8 lg:p-10 relative bg-[#F9F7F2] overflow-y-auto">
                  {/* Decorative faint background vertical grid column */}
                  <div className="absolute top-0 right-1/4 h-full w-[1px] bg-black/5 pointer-events-none"></div>

                  {/* Top Slide indicator row */}
                  <div className="flex justify-between items-center z-10 pb-3 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF9900]"></div>
                      <span className="label-sans text-[9px] text-[#1A1A1A]/60">
                        {activeSlide.category}
                      </span>
                    </div>

                  </div>

                  {/* Animated Slide Content container */}
                  <div className="my-auto z-10 flex flex-col justify-center py-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-4"
                      >
                        {/* LAYOUT: TITLE */}
                        {activeSlide.layout === "title" && (
                          <div className="text-center flex flex-col items-center gap-3">
                            {activeSlide.id === 1 ? (
                              <div className="w-full max-w-[480px] rounded-xl overflow-hidden border border-black/10 shadow-xs mb-1 select-none">
                                <img
                                  src="/Community Builders social 1024px ALT.png"
                                  alt="AWS Community Builders Banner"
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="p-3 bg-white rounded-full border border-black/10 mb-1 shadow-sm">
                                  {renderSlideIcon(activeSlide.iconName || "Cloud")}
                                </div>
                                <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-tight max-w-2xl">
                                  {activeSlide.title}
                                </h2>
                                {activeSlide.subtitle && (
                                  <p className="text-xs text-[#FF9900] font-sans font-semibold uppercase tracking-wider">
                                    {activeSlide.subtitle}
                                  </p>
                                )}
                              </>
                            )}
                            <div className="w-20 h-[1px] bg-black/15 my-1"></div>
                            <div className="mt-2 flex flex-col gap-1">
                              {activeSlide.content.map((p, idx) => {
                                const isLink = p.trim().startsWith("builder.aws.com") || p.trim().startsWith("http://") || p.trim().startsWith("https://");
                                const url = p.trim().startsWith("builder.aws.com") ? `https://${p.trim()}` : p.trim();
                                return (
                                  <p key={idx} className={`text-xs sm:text-sm ${idx === activeSlide.content.length - 1 ? 'text-[#FF9900] font-mono font-bold tracking-wider text-[11px]' : 'text-slate-700 font-light'}`}>
                                    {isLink ? (
                                      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#FF9900] cursor-pointer">
                                        {p.trim()}
                                      </a>
                                    ) : (
                                      p
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* LAYOUT: STANDARD CONTENT */}
                        {activeSlide.layout === "content" && (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-10">
                              <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight leading-tight mb-2">
                                {activeSlide.title}
                              </h2>
                              {activeSlide.subtitle && (
                                <p className="text-[10px] text-slate-500 mb-4 font-mono font-bold uppercase tracking-wider">
                                  {activeSlide.subtitle}
                                </p>
                              )}
                              <ul className="space-y-3">
                                {activeSlide.content.map((point, idx) => (
                                  <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="flex items-start gap-3"
                                  >
                                    <span className="w-3.5 h-[1.5px] bg-[#FF9900] mt-2 flex-shrink-0"></span>
                                    <span className="text-slate-800 text-xs sm:text-sm leading-relaxed font-light">
                                      {point}
                                    </span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                            <div className="hidden md:flex md:col-span-2 justify-center">
                              <div className="p-4 bg-white rounded-xl border border-black/10 shadow-sm">
                                {renderSlideIcon(activeSlide.iconName || "Cloud")}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* LAYOUT: BENTO BENEFIT GRID */}
                        {activeSlide.layout === "bento" && (
                          <div className="flex flex-col gap-3">
                            <div>
                              <h2 className="editorial-title text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
                                {activeSlide.title}
                              </h2>
                              {activeSlide.subtitle && (
                                <p className="text-[12px] text-[#FF9900] font-mono font-bold uppercase tracking-wider mb-2">
                                  {activeSlide.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {activeSlide.content.map((item, idx) => {
                                const [title, details] = item.includes(":") ? item.split(":") : [item, ""];
                                return (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-white border border-black/10 hover:border-[#FF9900]/40 transition-all duration-300 flex flex-col gap-1 shadow-sm"
                                  >
                                    <h3 className="font-sans font-bold text-xs text-[#FF9900] flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900]"></span>
                                      {title}
                                    </h3>
                                    {details && (
                                      <p className="text-[14px] text-slate-700 leading-normal pl-3 font-light">
                                        {details.trim()}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* LAYOUT: QUOTE SLIDE */}
                        {activeSlide.layout === "quote" && (
                          <div className="flex flex-col items-center justify-center text-center py-2 w-full">
                            {activeSlide.content.length > 1 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-2 sm:px-4">
                                {activeSlide.content.map((quote, idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col items-center justify-between p-5 bg-white/50 backdrop-blur-xs rounded-xl border border-black/5 hover:border-[#FF9900]/30 hover:shadow-xs transition-all duration-300 relative shadow-xs"
                                  >
                                    <div className="text-3xl text-[#FF9900]/20 font-serif leading-none h-3 self-start pl-1">“</div>
                                    <blockquote className="body-serif italic text-xs sm:text-sm text-slate-800 leading-relaxed my-2 px-2 flex-grow flex items-center justify-center font-light">
                                      {quote.replace(/^"|"$/g, '')}
                                    </blockquote>
                                    <div className="text-3xl text-[#FF9900]/20 font-serif leading-none h-3 self-end pr-1 mt-1">”</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <>
                                <div className="text-4xl text-[#FF9900]/20 font-serif leading-none h-4">“</div>
                                <blockquote className="body-serif italic text-base sm:text-lg md:text-xl text-slate-800 max-w-2xl leading-relaxed">
                                  {activeSlide.content[0]}
                                </blockquote>
                                <div className="text-4xl text-[#FF9900]/20 font-serif leading-none h-4 mt-2">”</div>

                                {activeSlide.content[1] && (
                                  <p className="mt-4 text-[9px] text-[#FF9900] font-mono uppercase tracking-widest bg-white px-3 py-1 rounded border border-black/10 shadow-sm font-semibold">
                                    {activeSlide.content[1]}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>


                </div>
              </div>

              {/* Slider Controls Bar */}
              <div className="bg-white border border-black/10 rounded-xl p-3 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-2 bg-white border border-black/10 text-slate-600 hover:text-black hover:border-black/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer hover:bg-[#E4B8FD]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs text-slate-600 font-sans tracking-wide px-2 select-none">
                    Página {currentSlideIndex + 1} de {slides.length}
                  </span>

                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-2 bg-white border border-black/10 text-slate-600 hover:text-black hover:border-black/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer hover:bg-[#E4B8FD]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      setCurrentSlideIndex(0);
                      setIsPlaying(false);
                    }}
                    className="py-1.5 px-3 text-xs font-semibold rounded-lg border bg-white border-black/10 text-slate-700 hover:border-black/30 transition-all cursor-pointer hover:bg-[#E4B8FD]"
                    title="Reiniciar"
                  >
                    Reset
                  </button>

                  {/* Play Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${isPlaying
                      ? "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/30 shadow-sm"
                      : "bg-white border-black/10 text-slate-700 hover:border-black/30 hover:bg-[#E4B8FD]"
                      }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? "Pausar Autoplay" : "Auto-Presentar"}
                  </button>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="py-1.5 px-3 text-xs font-semibold rounded-lg border bg-white border-black/10 text-slate-600 hover:border-black/30 flex items-center gap-1.5 transition-all cursor-pointer hover:bg-[#E4B8FD]"
                    title="Pantalla Completa"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isFullscreen ? "Salir" : "Presentar"}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Interaction Sidebar (Right 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Mini Slide Deck Navigation List */}
              <div className="p-6 bg-white border border-black/10 rounded-2xl flex flex-col gap-4 shadow-sm">
                <h3 className="font-serif italic font-bold text-sm text-[#1A1A1A]">Navegación de Diapositivas</h3>
                <div className="flex flex-col gap-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {slides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => {
                        setCurrentSlideIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${currentSlideIndex === idx
                        ? "bg-amber-500/10 border-[#FF9900] text-[#FF9900] shadow-sm font-bold"
                        : "bg-white border-black/10 text-slate-600 hover:border-black/30 hover:text-[#1A1A1A] hover:bg-[#E4B8FD]"
                        }`}
                    >
                      <span className="truncate max-w-[80%] font-light">
                        {slide.id}. {slide.title}
                      </span>
                      <span className="label-sans text-[8px] text-slate-400">
                        {slide.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE DRAFT BUILDER WORKSPACE (AI ASSISTED) */}
        {activeTab === "draft-builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Input Worksheet form (6 columns) */}
            <div className="lg:col-span-6 flex flex-col gap-6">

              <div className="p-6 sm:p-8 bg-white border border-black/10 rounded-2xl flex flex-col gap-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF9900]/5 rounded-full blur-3xl"></div>

                <div className="flex justify-between items-start border-b border-black/10 pb-4">
                  <div>
                    <h2 className="font-serif italic font-bold text-lg text-[#1A1A1A] flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-[#FF9900]" />
                      Taller de Borrador AWS Community Builder
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Estructurá tus aportes y validá tus ensayos para el formulario oficial.</p>
                  </div>
                </div>

                {/* Track Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 label-sans">1. Track de Interés Técnico:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TRACK_OPTIONS.map((track) => (
                      <button
                        key={track.key}
                        onClick={() => setDraft({ ...draft, track: track.key })}
                        className={`p-2.5 rounded-lg border text-xs text-left transition-all ${draft.track === track.key
                          ? "bg-amber-500/10 border-[#FF9900] text-[#FF9900] font-bold shadow-sm"
                          : "bg-white border-black/10 text-slate-500 hover:border-aws-navy/30 hover:text-aws-navy hover:bg-[#E4B8FD]"
                          }`}
                      >
                        {track.name}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Track info display */}
                  {selectedTrackInfo && (
                    <motion.div
                      key={draft.track}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-[#F9F7F2] rounded-lg border border-black/10 mt-1 shadow-sm"
                    >
                      <p className="text-xs text-slate-800 font-sans leading-relaxed">
                        <span className="font-bold text-[#FF9900]">¿Qué es?: </span>
                        {selectedTrackInfo.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-slate-500 font-mono font-bold">Servicios clave: </span>
                        {selectedTrackInfo.examples.map((ex, i) => (
                          <span key={i} className="text-[10px] bg-white border border-black/10 text-slate-700 px-2 py-0.5 rounded shadow-sm">
                            {ex}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Content Links Builder */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 label-sans">2. Enlaces de tus Aportes en el último año:</label>
                    <button
                      onClick={handleAddLink}
                      disabled={draft.links.length >= 4}
                      className="text-xs bg-[#FF9900]/10 text-[#FF9900] hover:bg-[#FF9900]/20 border border-[#FF9900]/30 px-2.5 py-1 rounded flex items-center gap-1 font-semibold disabled:opacity-40 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-2 h-2" />
                      Agregar
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Ingresá links reales de artículos que hayas creado, videos, repositorios de GitHub explicados o participaciones.
                  </p>

                  <div className="flex flex-col gap-3">
                    {draft.links.map((link, idx) => (
                      <div key={link.id} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-[#F9F7F2]/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-none border-black/10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 rounded bg-white sm:bg-[#F9F7F2] border border-black/10 text-xs font-mono font-bold text-[#1A1A1A]/70 flex items-center justify-center">
                            {idx + 1}
                          </div>

                          <select
                            value={link.type}
                            onChange={(e) => handleUpdateLink(link.id, "type", e.target.value)}
                            className="bg-white text-xs p-2 rounded-lg border border-black/15 text-[#1A1A1A] focus:outline-none focus:border-[#FF9900] cursor-pointer flex-grow sm:flex-grow-0"
                          >
                            <option value="blog">Blog (Medium, Dev.to)</option>
                            <option value="video">Video (YouTube)</option>
                            <option value="talk">Charla / Ponencia</option>
                            <option value="open-source">Open Source / GitHub</option>
                            <option value="community">Liderazgo Comunidad</option>
                            <option value="podcast">Podcast / Entrevista</option>
                            <option value="other">Otro aporte</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 flex-grow min-w-0">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                            placeholder="https://dev.to/mi-usuario/tutorial-aws"
                            className="flex-grow bg-white text-xs px-3 py-2 rounded-lg border border-black/15 text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#FF9900] transition-colors min-w-0"
                          />

                          {draft.links.length > 1 && (
                            <button
                              onClick={() => handleRemoveLink(link.id)}
                              className="p-2 bg-white hover:bg-rose-50 hover:text-rose-600 border border-black/10 rounded-lg text-slate-500 transition-colors cursor-pointer shadow-xs flex-shrink-0"
                              title="Eliminar enlace"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Essay Question 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 label-sans">
                      3. Describí tus contribuciones comunitarias de AWS:
                    </label>
                    <span className={`text-[10px] font-mono font-semibold ${draft.contributions.length > 200 ? 'text-[#FF9900]' : 'text-slate-500'}`}>
                      {draft.contributions.length} caract.
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Consejo oficial: Detallá lo que escribiste o hablaste, indicando el número estimado de personas alcanzadas.
                  </p>
                  <textarea
                    rows={4}
                    value={draft.contributions}
                    onChange={(e) => setDraft({ ...draft, contributions: e.target.value })}
                    placeholder="Ejemplo: He escrito 3 tutoriales paso a paso en mi blog de Medium explicando de manera amigable cómo usar AWS Lambda y DynamoDB con Node.js. Mis artículos han alcanzado un total acumulado de más de 300 visualizaciones..."
                    className="w-full bg-white text-xs p-3 rounded-lg border border-black/15 text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20 transition-colors leading-relaxed resize-none font-light"
                  />
                </div>

                {/* Essay Question 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 label-sans">
                      4. ¿Por qué querés unirte al programa AWS Community Builders?
                    </label>
                    <span className={`text-[10px] font-mono font-semibold ${draft.motivation.length > 200 ? 'text-[#FF9900]' : 'text-slate-500'}`}>
                      {draft.motivation.length} caract.
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    Consejo oficial: Explicá qué esperás aprender, cómo planeás colaborar de forma recíproca y ayudar a otras chicas.
                  </p>
                  <textarea
                    rows={4}
                    value={draft.motivation}
                    onChange={(e) => setDraft({ ...draft, motivation: e.target.value })}
                    placeholder="Ejemplo: Mi principal motivación es conectar de manera colaborativa con más mujeres en la nube AWS y expandir mis conocimientos técnicos. Deseo usar los créditos y vouchers de AWS para crear guías en español que muestren que Cloud no es inaccesible..."
                    className="w-full bg-white text-xs p-3 rounded-lg border border-black/15 text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]/20 transition-colors leading-relaxed resize-none font-light"
                  />
                </div>

                {/* Execute Feedback Button */}
                <button
                  onClick={handleReviewDraft}
                  disabled={isReviewing || (!draft.contributions.trim() && !draft.motivation.trim())}
                  className="w-full mt-2 py-3 bg-aws-navy hover:bg-[#FF9900] disabled:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#F9F7F2] text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isReviewing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Procesando tus borradores...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Revisar Borrador con Mentoría de IA (Gemini)
                    </>
                  )}
                </button>

                <p className="text-[9px] text-slate-500 text-center uppercase tracking-wider font-mono">
                  Soportado por Amazon Nova o Gemini API
                </p>
              </div>

            </div>

            {/* AI Review Output (Right 6 columns) */}
            <div className="lg:col-span-6 flex flex-col gap-6">

              {/* If loading */}
              {isReviewing && (
                <div className="p-8 bg-white border border-black/10 rounded-2xl flex flex-col items-center justify-center gap-6 min-h-[450px] shadow-sm text-center">
                  <div className="relative w-16 h-16">
                    {/* Ring animations */}
                    <div className="absolute inset-0 rounded-full border-2 border-black/10"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#FF9900] border-r-[#FF9900]/40 animate-spin"></div>
                    <div className="absolute inset-2 bg-[#F9F7F2] rounded-full flex items-center justify-center border border-black/5">
                      <Cloud className="w-6 h-6 text-[#FF9900]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif italic font-bold text-base text-[#1A1A1A]">Evaluando tu Perfil de Builder...</h3>
                    <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed h-10 transition-all duration-300 italic">
                      {loadingSteps[loadingStep]}
                    </p>
                  </div>
                  <div className="w-40 bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#FF9900] h-full w-[65%] animate-[pulse_1.5s_infinite]"></div>
                  </div>
                </div>
              )}

              {/* If error */}
              {reviewError && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center gap-4 text-center shadow-xs">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                  <div>
                    <h3 className="font-serif font-bold text-[#1A1A1A] text-sm">Error de conexión con la IA</h3>
                    <p className="text-xs text-rose-700 mt-1 max-w-md italic">{reviewError}</p>
                  </div>
                  <button
                    onClick={handleReviewDraft}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Reintentar Revisión
                  </button>
                </div>
              )}
              {!isReviewing && !reviewResult && !reviewError && (
                <div className="p-8 bg-white border border-black/10 border-dashed rounded-2xl flex flex-col items-center justify-center text-center py-10 gap-5 text-[#1A1A1A] shadow-xs">
                  <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-lg overflow-hidden border border-black/5 shadow-sm select-none">
                    <img src="/Community Builders social 1200px.png" alt="AWS Community Builders Banner" className="w-full h-auto object-cover" />
                  </div>
                  <div className="p-3.5 bg-[#F9F7F2] rounded-full border border-black/15 shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#FF9900]" />
                  </div>
                  <div>
                    <h3 className="font-serif italic font-bold text-sm text-[#1A1A1A]">Tu Mentoría de IA te Espera</h3>
                    <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed font-light">
                      Completá tus borradores de preguntas al lado izquierdo y presioná el botón para recibir un análisis detallado, puntaje y redacción perfeccionada.
                    </p>
                  </div>
                  <div className="flex gap-2 text-[10px] bg-[#F9F7F2] p-3 rounded-lg border border-black/10 mt-2 max-w-sm text-left leading-normal">
                    <span className="text-[#FF9900]">⭐</span>
                    <p className="text-slate-600 font-light pr-1">La IA analizará cómo destacar tu impacto personal y te sugerirá terminología oficial que busca AWS.</p>
                  </div>
                </div>
              )}

              {/* Success Result Showcase */}
              {reviewResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-6"
                >
                  {/* Score & General readiness */}
                  <div className="p-6 bg-white border border-black/10 rounded-2xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center">

                    {/* Visual radial progress meter */}
                    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={reviewResult.score >= 8 ? "#E4B8FD" : reviewResult.score >= 5 ? "#ff9900" : "#f43f5e"}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * (reviewResult.score * 10)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute text-center flex flex-col">
                        <span className="font-serif font-bold text-2xl text-[#1A1A1A]">{reviewResult.score}</span>
                        <span className="text-[8px] text-slate-500 font-mono tracking-wider">SOBRE 10</span>
                      </div>
                    </div>

                    <div className="flex-grow text-center sm:text-left">
                      <span className="text-[9px] font-mono font-bold text-[#FF9900] uppercase tracking-widest">
                        Nivel de Preparación Estimado
                      </span>
                      <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] mt-0.5">
                        {reviewResult.score >= 8
                          ? "¡Excelente postulación, estás lista!"
                          : reviewResult.score >= 5
                            ? "Muy buen borrador, pule detalles para brillar"
                            : "Comenzá a estructurar tus aportes e impacto"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-normal font-light">
                        Nuestra mentora IA ha evaluado la coherencia técnica de tus respuestas y la solidez de tu aporte para la comunidad.
                      </p>
                    </div>
                  </div>

                  {/* Encouragement warmth card */}
                  <div className="p-5 bg-[#F9F7F2] border border-[#FF9900]/20 rounded-2xl flex gap-3.5 items-start shadow-xs">
                    <Sparkles className="w-5 h-5 text-[#FF9900] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[10px] font-bold text-[#FF9900] uppercase tracking-widest font-mono">Mensaje de tu mentora IA:</h4>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed italic pr-2 font-serif">
                        "{reviewResult.encouragement}"
                      </p>
                    </div>
                  </div>

                  {/* Nailed & Improvements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Nailed */}
                    <div className="p-5 bg-white border border-black/10 rounded-2xl flex flex-col gap-3 shadow-sm">
                      <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 border-b border-black/10 pb-2 label-sans">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ¡Puntos Fuertes Fuertes!
                      </h4>
                      <ul className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {reviewResult.nailed.map((point, i) => (
                          <li key={i} className="text-[11px] text-slate-700 leading-normal flex items-start gap-2 font-light">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-5 bg-white border border-black/10 rounded-2xl flex flex-col gap-3 shadow-sm">
                      <h4 className="text-xs font-bold text-[#FF9900]/80 flex items-center gap-1.5 border-b border-black/10 pb-2 label-sans">
                        <AlertTriangle className="w-4 h-4 text-[#FF9900]" />
                        Recomendaciones Clave
                      </h4>
                      <ul className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {reviewResult.improvements.map((point, i) => (
                          <li key={i} className="text-[11px] text-slate-700 leading-normal flex items-start gap-2 font-light">
                            <span className="text-[#FF9900] font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Polished Draft proposals */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-serif italic font-bold text-sm text-[#1A1A1A]">Sugerencia de Redacción Perfeccionada (Copia y pega)</h3>

                    {/* Polished contributions */}
                    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                      <div className="bg-[#F9F7F2] px-4 py-3 border-b border-black/10 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1.5 font-serif">
                          <Check className="w-3.5 h-3.5 text-[#FF9900]" />
                          Tu ensayo de Contribuciones perfeccionado:
                        </span>
                        <button
                          onClick={() => handleCopyToClipboard(reviewResult.polishedContributions, "contributions")}
                          className="text-[10px] bg-white hover:bg-[#F9F7F2] text-slate-700 hover:text-black border border-black/10 px-2.5 py-1 rounded flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          {copiedSection === "contributions" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-white text-xs text-slate-800 leading-relaxed font-sans max-h-[150px] overflow-y-auto whitespace-pre-wrap font-light">
                        {reviewResult.polishedContributions}
                      </div>
                    </div>

                    {/* Polished motivation */}
                    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                      <div className="bg-[#F9F7F2] px-4 py-3 border-b border-black/10 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1.5 font-serif">
                          <Check className="w-3.5 h-3.5 text-[#FF9900]" />
                          Tu ensayo de Motivación perfeccionado:
                        </span>
                        <button
                          onClick={() => handleCopyToClipboard(reviewResult.polishedMotivation, "motivation")}
                          className="text-[10px] bg-white hover:bg-[#F9F7F2] text-slate-700 hover:text-black border border-black/10 px-2.5 py-1 rounded flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          {copiedSection === "motivation" ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-4 bg-white text-xs text-slate-800 leading-relaxed font-sans max-h-[150px] overflow-y-auto whitespace-pre-wrap font-light">
                        {reviewResult.polishedMotivation}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/10 rounded-xl border border-[#FF9900]/20 flex gap-2 text-[10px] text-slate-700 leading-normal">
                      <span>💡</span>
                      <p>Podés editar cualquier cosa del lado izquierdo y presionar de nuevo para pulir otras versiones conforme vayas agregando más enlaces de contenido técnico.</p>
                    </div>

                  </div>

                </motion.div>
              )}

            </div>

          </div>
        )}

        {/* TAB 3: FAQS, RESOURCES & STEP-BY-STEP CHECKLIST */}
        {activeTab === "resources" && (
          <div className="flex flex-col gap-10">


            {/* Step-by-Step roadmap path */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-serif italic font-bold text-xl text-[#1A1A1A]">Cronograma y Ruta de Preparación Clave</h2>
                <p className="text-xs text-slate-500 mt-1 font-light">Seguí esta ruta ordenada para construir un perfil de AWS Builder sumamente fuerte en los próximos meses.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {STEP_BY_STEP_GUIDE.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white border border-black/10 rounded-2xl hover:border-[#FF9900]/30 transition-all duration-300 flex flex-col gap-3 relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-3 bg-[#F9F7F2] text-[#FF9900] font-mono text-xl font-bold pr-4 rounded-bl-2xl border-l border-b border-black/10">
                      0{idx + 1}
                    </div>
                    <h3 className="font-serif italic font-bold text-sm text-[#1A1A1A] pr-10">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs grid matching website questions */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-serif italic font-bold text-xl text-[#1A1A1A]">Preguntas Frecuentes del Programa (FAQ)</h2>
                <p className="text-xs text-slate-500 mt-1 font-light">Respuestas concretas para despejar todas tus dudas antes de apretar el botón de enviar en la web oficial.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-black/10 rounded-2xl flex flex-col gap-3 shadow-xs"
                  >
                    <h3 className="font-serif italic font-bold text-sm text-[#FF9900] flex gap-2 items-start">
                      <HelpCircle className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed pl-6 font-light">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Content Starters for Girls code snippet helper */}
            <div className="p-6 sm:p-8 bg-white border border-black/10 rounded-2xl relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF9900]/5 rounded-full blur-3xl"></div>
              <h2 className="font-serif italic font-bold text-base text-[#1A1A1A] mb-2">¡Comenzá Hoy Mismo! Ideas Rápidas y Guía de Formatos</h2>
              <p className="text-xs text-slate-500 mb-6 max-w-3xl leading-relaxed font-light">
                Te propongo tres formatos rápidos que podés crear de manera muy simple esta semana para utilizarlos en tu postulación oficial:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#F9F7F2] rounded-xl border border-black/10 flex flex-col gap-3">
                  <div className="p-2 bg-[#FF9900]/10 text-[#FF9900] rounded-lg w-max border border-[#FF9900]/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">Idea 1: Tu Primer Tutorial de Blog</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Escribí un post titulado: <span className="text-[#1A1A1A] font-semibold">"Cómo perdí datos en S3 y cómo evitarlo" — cubrís versionado, MFA Delete y políticas. O bien: "3 configuraciones de S3 que parecen seguras pero no lo son"</span>. Agregale capturas de la consola oficial y explicalo con palabras llanas. El error que cometiste antes de encontrar la solución
                    y Costo estimado del servicio (aunque sea $0.01). Publicalo en Dev.to o Medium.
                  </p>
                </div>

                <div className="p-4 bg-[#F9F7F2] rounded-xl border border-black/10 flex flex-col gap-3">
                  <div className="p-2 bg-[#FF9900]/10 text-[#FF9900] rounded-lg w-max border border-[#FF9900]/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">Idea 2: Repositorios en GitHub</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Crea repositorios públicos con proyectos aws sencillos pero detallados.
                    <br />
                    - Pensá en la Arquitectura, documentá tus decisiones, usá IAC y compartí lo que hiciste.
                    <br />
                    - Redactá un Readme legible que contenga la suficiente información para que un tercero entienda tu repo.
                    <span className="block mt-2 text-[#1A1A1A] font-semibold">
                      Algunas ideas de proyectos:
                      <span className="block pl-1.5 mt-0.5 font-normal text-slate-600">1. Convertir texto a audio con Lambda asincrónico</span>
                      <span className="block pl-1.5 font-normal text-slate-600">2. Web App moderna con backend serverless</span>
                      <span className="block pl-1.5 font-normal text-slate-600">3. Automatización con Step Functions e IA</span>
                      <span className="block pl-1.5 font-normal text-slate-600">4. Pipeline de analítica de eventos</span>
                      <span className="block pl-1.5 font-normal text-slate-600">5. Arquitectura orientada a eventos (EDA) para un e-commerce (EventBridge)</span>
                      <span className="block pl-1.5 font-normal text-slate-600">6. Agente de IA con Bedrock</span>
                    </span>
                    <span className="block mt-1 text-slate-400 italic text-xs">
                      (fuente Marcia Villalba from Desplegando.cloud)
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-[#F9F7F2] rounded-xl border border-black/10 flex flex-col gap-3">
                  <div className="p-2 bg-[#FF9900]/10 text-[#FF9900] rounded-lg w-max border border-[#FF9900]/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">Idea 3: Tu primera Charla Relámpago</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Organizá un webinar corto por Zoom o Google Meet de 30 minutos para tus compañeras sobre <span className="text-[#1A1A1A] font-semibold">"Migré mi proyecto personal a AWS y esto fue lo que aprendí" o "Las 3 cosas que nadie te dice antes de empezar con AWS"</span>. Grabá la sesión y subila a Youtube, junto con url publica de tus slides.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: USEFUL LINKS */}
        {activeTab === "useful-links" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-serif italic font-bold text-2xl text-[#1A1A1A]">Recursos Recomendados y Links Útiles</h2>
                <p className="text-xs text-slate-500 mt-1 font-light">
                  Algunos links para inspirarte y preparar tu postulación.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {["all", "Comunidades", "Creadores", "Cursos y Aprendizaje", "Ideas y Contenido"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedLinkCategory(category)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${selectedLinkCategory === category
                      ? "bg-aws-navy border-aws-navy text-white shadow-xs"
                      : "bg-white border-black/10 text-slate-600 hover:border-black/30 hover:bg-[#E4B8FD]"
                      }`}
                  >
                    {category === "all" ? "Todos" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {USEFUL_LINKS.filter(
                (item) => selectedLinkCategory === "all" || item.category === selectedLinkCategory
              ).map((link) => {
                // Category badge colors
                let badgeStyle = "bg-[#FF9900]/10 text-[#FF9900] border-[#FF9900]/25";
                if (link.category === "Creadores") {
                  badgeStyle = "bg-[#E4B8FD]/20 text-purple-700 border-[#E4B8FD]/45";
                } else if (link.category === "Cursos y Aprendizaje") {
                  badgeStyle = "bg-blue-50 text-blue-700 border-blue-100";
                } else if (link.category === "Comunidades") {
                  badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                }

                return (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-black/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#FF9900]/40 hover:shadow-md transition-all duration-300 shadow-sm"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                          {link.category}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif italic font-bold text-base text-[#1A1A1A] tracking-tight hover:text-[#FF9900] transition-colors">
                          {link.title}
                        </h3>
                        {link.author && (
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                            Creado por: <span className="font-medium text-slate-600">{link.author}</span>
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        {link.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-black/5 flex justify-end">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 bg-[#F9F7F2] hover:bg-[#FF9900]/10 hover:text-[#FF9900] border border-black/10 hover:border-[#FF9900]/30 rounded-lg text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Visitar sitio</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Persistent helper footer */}
      <footer className="border-t border-black/10 bg-white px-6 py-5 text-center mt-auto text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="flex items-center gap-1.5 justify-center font-light">
          Hecho por LauB 💚
          <a
            href="https://github.com/reinalau/aws-community-builders-prep-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors duration-200 ml-1"
            title="Ver en GitHub"
          >
            <svg height="14" width="14" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27
                .68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
                .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48
                0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </p>
        <p className="font-mono text-[9px] text-slate-400">
          AWS Community Builders is an official Amazon Web Services program.
        </p>
      </footer>
    </div>
  );
}
