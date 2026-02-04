// ?좏뵆由ъ??댁뀡 ?쒕뵫 ?섏씠吏?낅땲??

import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiRequestError } from '../src/api/client';
import { getStoredUser, login, logout, register } from '../src/services/auth';
import TurnstileWidget from '../src/components/TurnstileWidget';
import SuccessModal from '../src/components/common/SuccessModal';

type AuthMode = 'login' | 'register';

const Landing: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [duplicateEmailError, setDuplicateEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const navigate = useNavigate();
  const isAuthenticated = Boolean(currentUser);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; name?: string; }>({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (authMode !== 'register') {
      setTurnstileToken('');
    }
  }, [authMode]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    const emailPattern = /^\S+@\S+\.\S+$/;
    const isRegister = authMode === 'register';

    if (!trimmedEmail) {
      nextErrors.email = '?대찓?쇱쓣 ?낅젰??二쇱꽭??';
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = '?щ컮瑜??대찓???뺤떇???낅젰??二쇱꽭??';
    }

    if (!password) {
      nextErrors.password = '鍮꾨?踰덊샇瑜??낅젰??二쇱꽭??';
    } else if (password.length < 8) {
      nextErrors.password = '鍮꾨?踰덊샇??8???댁긽?댁뼱???⑸땲??';
    }

    if (isRegister) {
      if (!trimmedName) {
        nextErrors.name = '?대쫫???낅젰??二쇱꽭??';
      }

      if (!confirmPassword) {
        nextErrors.confirmPassword = '鍮꾨?踰덊샇 ?뺤씤???낅젰??二쇱꽭??';
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = '鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.';
      }
    }

    setErrors(nextErrors);
    setServerFieldErrors({});
    setAuthError(null);
    setDuplicateEmailError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (isRegister && !turnstileToken) {
      setAuthError('Turnstile ?몄쬆???꾨즺??二쇱꽭??');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isRegister) {
        await register({
          email: trimmedEmail,
          password,
          name: trimmedName,
          turnstileToken,
        });
        setShowAuth(false);
        setShowSignupSuccess(true);
      } else {
        await login({ email: trimmedEmail, password });
        setCurrentUser(getStoredUser());
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      const fieldErrors: Record<string, string> = {};
      const status =
        (error as { response?: { status?: number | string } })?.response?.status ??
        (error instanceof ApiRequestError ? error.apiError?.status : undefined);
      const statusCode =
        typeof status === 'string'
          ? Number(status)
          : status;

      console.log('status:', (error as { response?: { status?: number | string } })?.response?.status);
      console.log('axios data:', (error as { response?: { data?: unknown } })?.response?.data);
      console.log('message:', message);

      if (error instanceof ApiRequestError && error.apiError?.errors?.length) {
        error.apiError.errors.forEach((detail) => {
          if (detail.field && detail.message) {
            fieldErrors[detail.field] = detail.message;
          }
        });
        console.log('apiError:', error.apiError);
      }

      console.log('fieldErrors:', fieldErrors);

      if (isRegister && (statusCode === 400 || statusCode === 401 || statusCode === 409)) {
        setTurnstileToken('');
        setTurnstileResetKey((prev) => prev + 1);
        setErrors({});
        setServerFieldErrors({});
        setDuplicateEmailError(null);
      }

      if (isRegister && statusCode === 409) {
        const duplicateMessage =
          (error instanceof ApiRequestError && error.apiError?.message) ||
          message;
        setAuthError(null);
        setDuplicateEmailError(duplicateMessage ?? null);
        return;
      } else {
        if (Object.keys(fieldErrors).length > 0) {
          setServerFieldErrors(fieldErrors);
        }
        if (Object.keys(fieldErrors).length === 0) {
          setAuthError(isRegister ? '?뚯썝媛?낆뿉 ?ㅽ뙣?덉뒿?덈떎. ?ㅼ떆 ?쒕룄?댁＜?몄슂.' : '?대찓?쇱씠??鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
    setErrors({});
    setServerFieldErrors({});
    setAuthError(null);
    setDuplicateEmailError(null);
    setConfirmPassword('');
    setTurnstileToken('');
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
    if (token) {
      setAuthError(null);
    }
  }, []);

  const handleSignupSuccessConfirm = () => {
    setShowSignupSuccess(false);
    setAuthMode('login');
    setShowAuth(true);
    setErrors({});
    setServerFieldErrors({});
    setAuthError(null);
    setDuplicateEmailError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // ignore logout errors for now
    } finally {
      setCurrentUser(null);
      navigate('/');
    }
  };

  const handleSentinelClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    setAuthMode('login');
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-slate-500 selection:text-white relative">
      <SuccessModal
        open={showSignupSuccess}
        title="?뚯썝媛???대찓???몄쬆"
        message="?낅젰?섏떊 二쇱냼濡??대찓?쇱쓣 蹂대깉?듬땲?? ?뺤씤?섍퀬 ?몄쬆?댁＜?몄슂."
        confirmLabel="濡쒓렇???섎윭媛湲?
        onConfirm={handleSignupSuccessConfirm}
      />
      
      {/* Auth Portal Overlay */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl" 
            onClick={() => setShowAuth(false)}
          ></div>
          
          <div className="relative glass-panel w-full max-w-md rounded-[2.5rem] p-12 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setShowAuth(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="text-center mb-10">
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <i className="fas fa-eye text-xs text-white"></i>
              </div>
              <h2 className="text-3xl font-light serif mb-2">
                {authMode === 'login' ? '濡쒓렇?? : '?뚯썝媛??}
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">
                {authMode === 'login' ? '吏湲?諛붾줈 ?쒖옉?섏꽭?? : '吏湲?諛붾줈 李몄뿬?섏꽭??}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {authMode === 'register' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">?대쫫</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ID瑜??낅젰??二쇱꽭??
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-white/30 transition-all outline-none text-white placeholder-slate-700"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name}</p>
                  )}
                  {serverFieldErrors.name && (
                    <div className="mt-2 rounded-lg bg-red-500 text-black text-xs px-3 py-2">{serverFieldErrors.name}</div>
                  )}</div>
              )}
              
              <div className="space-y-2 relative">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">?대찓??/label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setDuplicateEmailError(null);
                    setServerFieldErrors((prev) => {
                      const { email, ...rest } = prev;
                      return rest;
                    });
                  }}
                  placeholder="?대찓?쇱쓣 ?낅젰??二쇱꽭??
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-white/30 transition-all outline-none text-white placeholder-slate-700"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={duplicateEmailError ? 'duplicate-email-tooltip' : undefined}
                />
                {duplicateEmailError && (
                  <p
                    id="duplicate-email-tooltip"
                    role="alert"
                    className="text-xs text-red-400"
                  >
                    {duplicateEmailError}
                  </p>
                )}
                {errors.email && (
                  <p className="text-xs text-red-400">{errors.email}</p>
                )}
                {serverFieldErrors.email && (
                  <div className="mt-2 rounded-lg bg-red-500 text-black text-xs px-3 py-2">{serverFieldErrors.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">鍮꾨?踰덊샇</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="?™™™™™™™™™™™?
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-white/30 transition-all outline-none text-white placeholder-slate-700"
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
                {serverFieldErrors.password && (
                  <div className="mt-2 rounded-lg bg-red-500 text-black text-xs px-3 py-2">{serverFieldErrors.password}</div>
                )}</div>

              {authMode === 'register' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold ml-1">鍮꾨?踰덊샇 ?뺤씤</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="?™™™™™™™™™™™?
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-white/30 transition-all outline-none text-white placeholder-slate-700"
                    aria-invalid={Boolean(errors.confirmPassword)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                  )}
                  {serverFieldErrors.confirmPassword && (
                    <div className="mt-2 rounded-lg bg-red-500 text-black text-xs px-3 py-2">{serverFieldErrors.confirmPassword}</div>
                  )}</div>
              )}

              {authMode === 'register' && (
                <TurnstileWidget
                  key={turnstileResetKey}
                  className="mt-2"
                  onVerify={(token) => {
                    setTurnstileToken(token);
                    if (token) {
                      setAuthError(null);
                    }
                  }}
                />
              )}

              {authError && (
                <p className="text-xs text-red-400">{authError}</p>
              )}

              <button 
                type="submit"
                className="w-full py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-xl mt-4 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting || (authMode === 'register' && !turnstileToken)}
              >
                {isSubmitting ? '泥섎━ 以?..' : authMode === 'login' ? '濡쒓렇?? : '媛??}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <button 
                onClick={toggleAuthMode}
                className="w-full py-4 border border-white/10 text-slate-300 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center space-x-2"
              >
                <i className={`fas ${authMode === 'login' ? 'fa-plus' : 'fa-lock'} text-[8px]`}></i>
                <span>{authMode === 'login' ? '??怨꾩젙 ?앹꽦' : '?≪꽭???ы꽭濡??뚯븘媛湲?}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/10' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-60 h-16">
              <img
                src="/img/logonobg.svg"
                alt="SENTINEL 濡쒓퀬"
                className="h-30 w-auto -translate-y-12"
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-10 text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400">
            <a href="#platform" className="hover:text-white transition-colors">?뚮옯??/a>
            <a href="#network" className="hover:text-white transition-colors">?ㅽ듃?뚰겕</a>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setShowAuth(true); }}
                className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-all"
              >
                기업 로그인
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-end items-center overflow-hidden pb-32">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full overflow-hidden">
            <video
              className="absolute top-0 left-0 w-full h-full object-cover scale-105"
              src="/img/owl.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505] pointer-events-none"></div>
        </div>
        
        <div className="relative z-10 fade-up flex flex-col items-center mb-12">
          <button 
            //濡쒓렇??湲곕뒫 ?ㅽ궢 onClick={() => { setAuthMode('login'); setShowAuth(true); }}
            onClick={handleSentinelClick}
            className="btn-primary group !bg-white/10 !text-white !backdrop-blur-xl border border-white/20 px-12 py-5 hover:!bg-white hover:!text-black transition-all shadow-2xl"
          >
            <span className="text-xs uppercase tracking-[0.2em] font-bold">S E N T I N E L</span>
            <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform ml-3"></i>
          </button>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-60">
           <span className="text-[9px] uppercase tracking-[0.5em] text-white">?먯깋</span>
           <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platform" className="py-32 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24 items-end">
          <div className="md:col-span-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-6 flex items-center">
              <span className="w-2 h-2 bg-slate-400 mr-2"></span> STRAGITY / INSIGHT
            </div>
            <h2 className="text-5xl md:text-6xl font-light leading-[1.1] text-white mb-0">
              ?꾨왂, 由ъ뒪?? AI瑜?<br/>
              ?듯빐 <br/>
              <span className="text-slate-500 italic">?쒕윭?대떎.</span>
            </h2>
          </div>
          <div className="md:col-span-6">
            <p className="text-lg text-slate-400 font-light leading-relaxed mb-8 ">
              ?섏쓽 李⑥씠媛 ?먭뺨吏??땲源?Human?<br />
              <br />
              SENTINEL? 湲곗뾽??蹂듭옟???묐젰 ?앺깭怨꾨? ?꾨왂?곸쑝濡??먯깋?섍퀬 ?쒖뼱?????덈룄濡?吏?먰빀?덈떎.
            </p>
            <button className="group flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-white">
              <span className="bg-white/10 p-4 rounded-full group-hover:bg-white group-hover:text-black transition-all">
                <i className="fas fa-arrow-right"></i>
              </span>
              <span>?뚮옯???뚯븘蹂닿린</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01.', title: '由ъ뒪??遺꾩꽍', desc: '遺꾩궛??吏?쒕? 寃고빀??湲곗뾽???좎옱???꾪뿕???뺣??섍쾶 ?앸퀎?⑸땲??', icon: 'fa-microscope' },
            { num: '02.', title: '?듯빀 ?몄궗?댄듃', desc: '蹂듭옟??湲곗뾽 ?뺣낫瑜?寃고빀?섏뿬 ?섏궗寃곗젙 ?쒓컙???⑥쑉?곸쑝濡?愿由ы빀?덈떎.', icon: 'fa-vial' },
            { num: '03.', title: '?먮쫫?덉륫 AI', desc: '怨쇨굅? ?꾩옱 ?곗씠?곕? 湲곕컲?쇰줈 ?ν썑 遺꾧린???먮쫫???좎젣?곸쑝濡??덉륫?⑸땲??', icon: 'fa-brain' },
          ].map((feat, i) => (
            <div key={i} className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group">
              <div className="mb-12 flex justify-between items-start">
                 <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-white/30 transition-all">
                   <i className={`fas ${feat.icon}`}></i>
                 </div>
                 <span className="text-[10px] text-slate-600 font-mono tracking-tighter">{feat.num}</span>
              </div>
              <h3 className="text-xl font-medium text-white mb-4 uppercase tracking-wider">{feat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-300 transition-colors">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Research/Company Section */}
      <section className="py-32 px-10 border-t border-white/5">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-slate-900">
               <img src="/img/team.jpg" alt="? ?ъ쭊" className="w-full h-full object-cover translate-y-5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 border-[20px] border-[#050505] pointer-events-none"></div>
            </div>
            <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-6 flex items-center">
                  <span className="w-2 h-2 bg-slate-400 mr-2"></span> Our Company
               </div>
               <h2 className="text-4xl md:text-5xl serif leading-tight mb-8">
                 ?곕━??<br/>
                 <span className="italic text-slate-400">?곗씠??/span>瑜??쎄퀬, <br/>
                 ?먮떒 媛?ν븳 ?몄궗?댄듃濡?<br/> ?쒓났?⑸땲??
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <p className="text-sm text-slate-500 leading-relaxed">?꾨Ц媛??吏곴????섏〈?섎뜕 ?먮떒???곗씠??湲곕컲 ?몄궗?댄듃濡??꾪솚??
議곗쭅????鍮좊Ⅴ怨??쇨????섏궗寃곗젙???대┫ ???덈룄濡??뺤뒿?덈떎.</p>
                  <p className="text-sm text-slate-500 leading-relaxed">?곕━??臾몄젣媛 諛쒖깮?????ㅻ챸?섎뒗 ?꾧뎄媛 ?꾨땲??
?꾪뿕???쒕윭?섍린 ?꾩뿉 ?좏샇瑜??ъ갑?섎뒗 ?쒖뒪?쒖쓣 吏?ν빀?덈떎.</p>
               </div>
               <button className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold text-white group">
                  <span className="bg-white text-black p-4 rounded-full group-hover:bg-slate-200 transition-all">
                    <i className="fas fa-plus"></i>
                  </span>
                  <span>沅곴툑?섏떗?덇퉴?</span>
               </button>
            </div>
         </div>
      </section>

      {/* Newsroom Section */}
      <section className="py-32 px-10 border-t border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-20">
               <h2 className="text-6xl serif font-light">?뚯떇??沅곴툑?섏떊媛??</h2>
               <button className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                 紐⑤뱺 ?댁뒪移대뱶 蹂닿린 <i className="fas fa-arrow-right ml-2"></i>
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="md:col-span-2 group cursor-pointer">
                  <div className="aspect-video bg-slate-900 overflow-hidden mb-8">
                    <video src="/img/robot.mp4" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                     />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest mb-4"><span>RECENT</span><span>2026??01??26??/span></div>
                  <h3 className="text-3xl serif mb-4 group-hover:text-slate-300 transition-colors">?곗씠??湲곕컲 ?듯빀 由ъ뒪???좏샇 ?ъ갑</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-xl">?щТ 吏?? ?꾧툑?먮쫫, ?몃? ?섍꼍 ?곗씠?곕? 寃고빀??湲곗뾽??援ъ“???꾪뿕 ?좏샇瑜?議곌린???앸퀎, <br/>?몄궗?댄듃瑜??쒓났?⑸땲??</p>
                  <span className="text-[10px] uppercase tracking-widest font-bold border-b border-white/20 pb-1 group-hover:border-white transition-all">湲곗궗 ?쎄린</span>
               </div>
               <div className="space-y-12">
                  {[
                    { date: '2025??12??18??, title: '?묒옄?꾩궛???덉륫?섎뒗 ?щТ ?⑦꽩 ?뺤옣' },
                    { date: '2025??12??2??, title: '?ш굔???꾨땶 ?쒓컙?쇰줈 由ъ뒪?ъ쓽 ?먮쫫??蹂대떎' },
                    { date: '2025??11??21??, title: 'AI 湲곕컲 湲곗뾽 由ъ뒪??遺꾩꽍, ?ㅻТ???곸슜?섎떎' }
                  ].map((item, i) => (
                    <div key={i} className="group cursor-pointer border-t border-white/10 pt-8">
                      <div className="flex justify-between text-[9px] text-slate-600 uppercase tracking-[0.2em] mb-3"><span>?뚯떇</span><span>{item.date}</span></div>
                      <h4 className="text-xl serif leading-snug group-hover:text-slate-300 transition-colors">{item.title}</h4>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fas fa-arrow-right text-xs"></i></div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA Area */}
      <section className="py-40 px-10 relative overflow-hidden flex flex-col items-center text-center">
         <div className="absolute inset-0 opacity-20 grayscale pointer-events-none">
            <img src="/img/robot.jpg" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl md:text-5xl serif leading-tight mb-12">?곕━??湲곗뾽 ?ㅽ듃?뚰겕??遺덊솗?ㅼ꽦??<br/>?곗씠???명뀛由ъ쟾?ㅻ줈 <br/>?좎젣?곸쑝濡??댁꽍?⑸땲??</h2>
            <button 
              onClick={() => { setAuthMode('register'); setShowAuth(true); }}
              className="inline-flex items-center space-x-4 group"
            >
               <span className="bg-white text-black w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fas fa-plus"></i></span>
               <span className="text-[13px] uppercase tracking-[0.3em] font-bold">CONTACT US</span>
            </button>
         </div>
      </section>

      {/* Big Branding Footer */}
      <footer className="pt-24 pb-12 px-10 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-[10px] uppercase tracking-widest text-slate-500">
             <div className="md:col-span-4"><p className="mb-4">짤 2026 SENTINEL. All rights reserved.</p></div>
             <div className="md:col-span-2 flex flex-col space-y-2">
                <span className="text-white font-bold mb-2">?섎윭蹂닿린</span>
                <a href="#" className="hover:text-white transition-colors">?뚮옯??/a>
                <a href="#" className="hover:text-white transition-colors">?뚯궗</a>
                <a href="#" className="hover:text-white transition-colors">?댁뒪猷?/a>
             </div>
             <div className="md:col-span-2 flex flex-col space-y-2">
                <span className="text-white font-bold mb-2">?곌껐</span>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">X</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

