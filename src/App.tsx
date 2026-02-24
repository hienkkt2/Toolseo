/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Settings, 
  Zap, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  Layout,
  ExternalLink,
  Eye,
  Code,
  Database,
  PenTool,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSEOArticle, generateKeywordCluster, SEOInput } from './services/geminiService';

type ToolMode = 'article' | 'cluster';

export default function App() {
  const [mode, setMode] = useState<ToolMode>('article');
  const [input, setInput] = useState<SEOInput>({
    keyBlog: '',
    keyPhu: '',
    sanPhamLienQuan: ''
  });
  const [keyChinh, setKeyChinh] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.keyBlog) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = await generateSEOArticle(input);
      if (content) {
        setResult(content);
      } else {
        setError('Không thể tạo nội dung. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi trong quá trình tạo bài viết.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCluster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyChinh) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const content = await generateKeywordCluster(keyChinh);
      if (content) {
        setResult(content);
      } else {
        setError('Không thể phân tích keyword. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Đã xảy ra lỗi trong quá trình phân tích.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Đình Hiển Marketing
                <span className="text-indigo-600 text-sm font-normal px-2 py-0.5 bg-indigo-50 rounded-full">Expert</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">SEO & Ecommerce Growth Solutions</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => { setMode('article'); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'article' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Viết bài SEO
            </button>
            <button
              onClick={() => { setMode('cluster'); setResult(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'cluster' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Database className="w-4 h-4" />
              Keyword Cluster
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.open('https://rankmath.com/', '_blank')}
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Rank Math
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" />
                {mode === 'article' ? 'Cấu hình bài viết' : 'Phân tích Keyword'}
              </h2>
            </div>
            
            {mode === 'article' ? (
              <form onSubmit={handleGenerateArticle} className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    KEY BLOG (Keyword chính)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Cách chọn máy lọc nước 2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    value={input.keyBlog}
                    onChange={(e) => setInput({ ...input, keyBlog: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-slate-400" />
                    KEY PHỤ (Semantic keywords)
                  </label>
                  <textarea
                    placeholder="Mỗi keyword một dòng..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                    value={input.keyPhu}
                    onChange={(e) => setInput({ ...input, keyPhu: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    SẢN PHẨM LIÊN QUAN
                  </label>
                  <input
                    type="text"
                    placeholder="Link hoặc tên sản phẩm..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    value={input.sanPhamLienQuan}
                    onChange={(e) => setInput({ ...input, sanPhamLienQuan: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !input.keyBlog}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang viết bài (1800+ từ)...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Bắt đầu viết bài chuẩn SEO
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleGenerateCluster} className="p-5 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    KEY CHÍNH (Sản phẩm/Dịch vụ)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Máy lọc nước ion kiềm"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    value={keyChinh}
                    onChange={(e) => setKeyChinh(e.target.value)}
                  />
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    Hệ thống sẽ tự động phân tích và xây dựng bộ Keyword Cluster gồm: 10-20 Key Phụ và 15-30 Topic Blog theo xu hướng SEO 2025.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !keyChinh}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang phân tích Cluster...
                    </>
                  ) : (
                    <>
                      <Database className="w-5 h-5" />
                      Xây dựng Keyword Cluster
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {mode === 'article' ? 'Tiêu chuẩn Rank Math 100' : 'Mục tiêu Cluster'}
            </h3>
            <ul className="space-y-2 text-xs text-indigo-800/80 font-medium">
              {mode === 'article' ? (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Độ dài 1800 - 2500 từ chuyên sâu
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    1 External Link (Dofollow, No Rel)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    3 Internal Links (Đầu, Giữa, Cuối bài)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Anchor đa dạng (Exact, Partial, Natural)
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Bao phủ Semantic Keyword toàn ngành
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Xây dựng Content Funnel (TOFU-MOFU-BOFU)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Phân loại Search Intent chi tiết
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    Tối ưu chuyển đổi & Traffic bền vững
                  </li>
                </>
              )}
            </ul>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="h-full min-h-[500px] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                {mode === 'article' ? <FileText className="w-12 h-12 text-slate-300" /> : <Database className="w-12 h-12 text-slate-300" />}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {mode === 'article' ? 'Sẵn sàng tạo nội dung' : 'Sẵn sàng phân tích Cluster'}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {mode === 'article' 
                  ? 'Nhập từ khóa chính và các thông tin liên quan để bắt đầu tạo bài viết chuẩn SEO 100 điểm Rank Math.'
                  : 'Nhập từ khóa chính để hệ thống xây dựng bộ Keyword Cluster hoàn chỉnh cho chiến dịch SEO của bạn.'}
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[500px] bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <Zap className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Đang xử lý dữ liệu...</h3>
              <p className="text-slate-500 max-w-md mx-auto animate-pulse">
                {mode === 'article' 
                  ? 'Quá trình viết bài 1800+ từ có thể mất 30-60 giây để đảm bảo chất lượng chuyên sâu.'
                  : 'Đang nghiên cứu thị trường và phân tích search intent cho bộ keyword cluster.'}
              </p>
              <div className="mt-8 w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: mode === 'article' ? 45 : 20, ease: "linear" }}
                  className="bg-indigo-600 h-full"
                />
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'preview' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Xem trước
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'code' 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Mã HTML
                  </button>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    copied 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Sao chép kết quả
                    </>
                  )}
                </button>
              </div>

              <div className="p-8 overflow-auto max-h-[800px]">
                {viewMode === 'preview' ? (
                  <div 
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: result }}
                  />
                ) : (
                  <pre className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                    {result}
                  </pre>
                )}
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <p className="text-slate-900 font-bold text-sm">
              Đình Hiển Marketing
            </p>
            <span className="text-slate-400 text-sm">|</span>
            <p className="text-slate-500 text-sm">
              SEO Strategy Expert
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">Hướng dẫn</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">Chính sách</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium">Hỗ trợ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
