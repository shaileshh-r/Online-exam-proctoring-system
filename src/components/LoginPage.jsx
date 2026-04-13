import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Mail, GraduationCap, Briefcase, PlusCircle, X } from 'lucide-react';
import Aurora from './Aurora/Aurora';
import TextType from './TextType/TextType';

const LoginPage = ({ onLogin, onSignUp }) => {
    const [role, setRole] = useState('student');
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
    const [credentials, setCredentials] = useState({ id: '', password: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);
        setTimeout(() => {
            if (view === 'login') {
                const success = onLogin(credentials.id, credentials.password, role);
                if (!success) setError('Invalid credentials. Please try again.');
            } else if (view === 'signup') {
                const success = onSignUp(credentials.id, credentials.password, role);
                 if (!success) setError('User already exists.');
                 else {
                     setMessage('Account created! Please log in.');
                     setView('login');
                 }
            } else if (view === 'forgot') {
                setMessage('Password reset link sent to your email.');
                setTimeout(() => setView('login'), 2000);
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="relative min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
            <Aurora colorStops={['#3b82f6', '#8b5cf6', '#3b82f6']} amplitude={1.2} />

            <div className="relative z-10 w-full max-w-lg">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-6 animate-fade-in">
                        <ShieldCheck className="w-4 h-4" /> Secure Examination Portal
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">
                        <TextType
                            key={`${role}-${view}`}
                            text={view === 'signup' ? `New ${role === 'student' ? 'Student' : 'Teacher'}` : view === 'forgot' ? 'Reset Password' : `${role === 'student' ? 'Student' : 'Teacher'} Login`}
                            as="span"
                            loop={false}
                            typingSpeed={80}
                        />
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {view === 'signup' ? 'Create a new account to get started.' : view === 'forgot' ? 'Enter your email to reset your password.' : 'Enter your credentials to access the portal.'}
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />

                    {view === 'login' && (
                        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5 relative z-10">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <GraduationCap className="w-4 h-4" /> Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${role === 'teacher' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Briefcase className="w-4 h-4" /> Teacher
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold text-center">{error}</div>}
                        {message && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold text-center">{message}</div>}

                        {view === 'forgot' ? (
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-400 ml-1">Email Address</label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        placeholder="Enter your email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-400 ml-1">Username / ID</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            placeholder={`Enter ${role} ID`}
                                            value={credentials.id}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, id: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-400 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={credentials.password}
                                            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {view === 'login' && (
                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-offset-0 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                                </label>
                                <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }} className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">Forgot Password?</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn ${isLoading
                                ? 'bg-blue-600/50 cursor-wait'
                                : role === 'student' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-900/40 active:scale-[0.98]' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-900/40 active:scale-[0.98]'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-2 text-lg">
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    view === 'signup' ? <>Create Account <PlusCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" /></> :
                                    view === 'forgot' ? <>Send Reset Link <Mail className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></> :
                                    <>Sign In <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></>
                                )}
                            </span>
                        </button>
                        
                        {view !== 'login' && (
                            <button type="button" onClick={() => { setView('login'); setError(''); setMessage(''); }} className="w-full text-center text-sm font-bold text-gray-500 hover:text-white transition-colors pt-4 flex justify-center items-center gap-2">
                                <X className="w-4 h-4"/> Cancel
                            </button>
                        )}
                    </form>
                </div>

                {view === 'login' && (
                    <div className="mt-8 text-center text-gray-500 text-sm animate-fade-in flex flex-col gap-2">
                        <p>No account yet? <button onClick={() => { setView('signup'); setError(''); setMessage(''); }} className="text-blue-400 hover:underline font-bold bg-transparent border-none p-0 cursor-pointer">Sign up here</button></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
