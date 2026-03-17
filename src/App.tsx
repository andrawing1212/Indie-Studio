import { useState } from 'react';
import { Copy, Music, Sparkles, Loader2, Moon, Coffee, Heart, Wind, Map, Car, Sun, CloudRain, Shuffle } from 'lucide-react';
import { generateSongLyrics, GeneratedSong } from './services/geminiService';
import { MUSIC_PROMPTS, THEMES } from './constants';

function App() {
  const [theme, setTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<(GeneratedSong & { prompt: string }) | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const selectedTheme = theme.trim() || THEMES[Math.floor(Math.random() * THEMES.length)];
      const randomPrompt = MUSIC_PROMPTS[Math.floor(Math.random() * MUSIC_PROMPTS.length)];
      
      // Determine genre based on prompt to pass to AI
      const lowerPrompt = randomPrompt.toLowerCase();
      let genre = 'Indie';
      if (lowerPrompt.includes('r&b')) {
        genre = 'Indie R&B';
      } else if (lowerPrompt.includes('folk')) {
        genre = 'Indie Folk';
      }
      
      const generatedSong = await generateSongLyrics(selectedTheme, genre, randomPrompt);
      
      setResult({
        ...generatedSong,
        prompt: randomPrompt
      });
    } catch (error: any) {
      console.error("Error generating song:", error);
      alert(error.message || "곡 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getThemeIcon = (t: string) => {
    switch (t) {
      case '사랑': return <Heart className="w-4 h-4" />;
      case '이별': return <CloudRain className="w-4 h-4" />;
      case '드라이브': return <Car className="w-4 h-4" />;
      case '희망': return <Sun className="w-4 h-4" />;
      case '여유': return <Coffee className="w-4 h-4" />;
      case '산책': return <Wind className="w-4 h-4" />;
      case '여행': return <Map className="w-4 h-4" />;
      case '밤': return <Moon className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e0e0e0] font-sans selection:bg-[#ff4e00]/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff4e00]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#3a1510]/40 blur-[150px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 flex flex-col gap-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
            <Music className="w-8 h-8 text-[#ff4e00]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white">
            Indie R&B, Folk Studio
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            72~82 BPM의 저녁 감성적인 인디 음악 작곡 스튜디오. <br className="hidden md:block" />
            주제를 입력하면 그에 맞는 곡의 제목, 가사, 프롬프트를 생성해 드립니다.
          </p>
        </header>

        {/* Input Section */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label htmlFor="theme-input" className="text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">
                주제 입력 (Theme)
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative flex items-center">
                  <input
                    id="theme-input"
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="원하는 주제를 입력하거나 아래에서 선택하세요 (미입력시 랜덤)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#ff4e00]/50 transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                  />
                  <button
                    onClick={() => setTheme(THEMES[Math.floor(Math.random() * THEMES.length)])}
                    className="absolute right-2 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="랜덤 주제 선택 (Shuffle Theme)"
                  >
                    <Shuffle className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-[#ff4e00] hover:bg-[#ff6a2b] text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#ff4e00]/20"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      작곡하기
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    theme === t 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : 'bg-white/5 text-[#a0a0a0] border border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {getThemeIcon(t)}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Result Section */}
        {result && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Title */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative group">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(result.title, 'title')}
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  {copiedSection === 'title' ? '복사됨!' : '제목 복사'}
                </button>
              </div>
              <h2 className="text-sm font-medium text-[#ff4e00] uppercase tracking-wider mb-2">Title</h2>
              <p className="text-2xl md:text-3xl font-serif text-white pr-24">{result.title}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* English Lyrics */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative group flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-medium text-[#ff4e00] uppercase tracking-wider">English Lyrics</h2>
                  <button
                    onClick={() => handleCopy(result.englishLyrics, 'english')}
                    className="p-2 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedSection === 'english' ? '복사됨!' : '복사'}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <pre className="font-sans whitespace-pre-wrap text-[#d0d0d0] leading-relaxed">
                    {result.englishLyrics}
                  </pre>
                </div>
              </div>

              {/* Korean Lyrics */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative group flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-medium text-[#ff4e00] uppercase tracking-wider">Korean Lyrics</h2>
                  <button
                    onClick={() => handleCopy(result.koreanLyrics, 'korean')}
                    className="p-2 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="w-4 h-4" />
                    {copiedSection === 'korean' ? '복사됨!' : '복사'}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <pre className="font-sans whitespace-pre-wrap text-[#d0d0d0] leading-relaxed">
                    {result.koreanLyrics}
                  </pre>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative group">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-medium text-[#ff4e00] uppercase tracking-wider">Music Prompt</h2>
                <button
                  onClick={() => handleCopy(result.prompt, 'prompt')}
                  className="p-2 bg-black/40 hover:bg-black/60 rounded-lg border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100"
                >
                  <Copy className="w-4 h-4" />
                  {copiedSection === 'prompt' ? '복사됨!' : '프롬프트 복사'}
                </button>
              </div>
              <p className="font-mono text-sm text-[#a0a0a0] leading-relaxed">
                {result.prompt}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
