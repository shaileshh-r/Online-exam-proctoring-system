import React, { useState, useEffect } from 'react';
import ExamDashboard from './components/ExamDashboard';
import SystemCheckLobby from './components/SystemCheckLobby';
import LoginPage from './components/LoginPage';
import ExamSelection from './components/ExamSelection';
import InstructionPage from './components/InstructionPage';
import TeacherDashboard from './components/TeacherDashboard';
import { EXAMS as initialExams } from './data/examData';

function App() {
  const [step, setStep] = useState('login'); // 'login', 'selection', 'instructions', 'lobby', 'exam', 'teacher-dashboard'
  
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('proctor_users');
    return saved ? JSON.parse(saved) : {
      'admin': { password: 'password', role: 'teacher' },
      'student1': { password: 'password', role: 'student' }
    };
  });
  
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('proctor_exams');
    return saved ? JSON.parse(saved) : initialExams;
  });
  
  const [selectedExam, setSelectedExam] = useState(null);
  
  const [submissions, setSubmissions] = useState(() => {
    const saved = localStorage.getItem('proctor_submissions');
    return saved ? JSON.parse(saved) : {}; 
  }); 

  // Sync to local storage
  useEffect(() => { localStorage.setItem('proctor_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('proctor_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('proctor_submissions', JSON.stringify(submissions)); }, [submissions]);

  useEffect(() => {
    const titleUser = userRole ? (userRole === 'teacher' ? 'Teacher' : 'Student') : '';
    document.title = titleUser ? `ProctorAI - ${titleUser} Portal` : 'ProctorAI - Login';
  }, [userRole]);

  const handleLogin = (id, password, role) => {
    const existingUser = users[id];
    if (existingUser && existingUser.password === password && existingUser.role === role) {
      setUser(id);
      setUserRole(role);
      setStep(role === 'teacher' ? 'teacher-dashboard' : 'selection');
      return true;
    }
    return false;
  };

  const handleSignUp = (id, password, role) => {
    if (users[id]) return false;
    setUsers(prev => ({
      ...prev,
      [id]: { password, role }
    }));
    return true;
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setStep('instructions');
  };

  const handleProceedToLobby = () => {
    setStep('lobby');
  };

  const handleStartExam = () => {
    setStep('exam');
  };

  const handleFinishExam = (results) => {
    if (results) {
      setSubmissions(prev => {
        const examSubmissions = prev[selectedExam.id] || {};
        return {
          ...prev,
          [selectedExam.id]: {
            ...examSubmissions,
            [user]: results 
          }
        };
      });
    }
    setStep('selection');
    setSelectedExam(null);
  };

  const handleUpdateSubmission = (examId, studentId, gradedSubmission) => {
     setSubmissions(prev => ({
         ...prev,
         [examId]: {
             ...prev[examId],
             [studentId]: gradedSubmission
         }
     }));
  };

  const handleCreateExam = (newExam) => {
    setExams(prev => [...prev, newExam]);
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole(null);
    setSelectedExam(null);
    setStep('login');
  };

  return (
    <>
      {step === 'login' && <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />}
      
      {step === 'teacher-dashboard' && (
        <TeacherDashboard 
          exams={exams}
          submissions={submissions}
          onCreateExam={handleCreateExam}
          onUpdateSubmission={handleUpdateSubmission}
          onLogout={handleLogout}
        />
      )}

      {step === 'selection' && (
        <ExamSelection
          exams={exams}
          submissions={submissions}
          onSelect={handleSelectExam}
          onLogout={handleLogout}
          onCreateExam={handleCreateExam}
          onViewResults={(exam) => {
            setSelectedExam(exam);
            setStep('exam');
          }}
          userId={user}
        />
      )}
      {step === 'instructions' && (
        <InstructionPage
          examData={selectedExam}
          onBack={() => setStep('selection')}
          onProceed={handleProceedToLobby}
        />
      )}
      {step === 'lobby' && <SystemCheckLobby onStartExam={handleStartExam} />}
      {step === 'exam' && (
        <ExamDashboard
          examData={selectedExam}
          isViewOnly={!!(submissions[selectedExam?.id] && submissions[selectedExam?.id][user])}
          previousSubmission={submissions[selectedExam?.id]?.[user]?.answers}
          gradedData={submissions[selectedExam?.id]?.[user]}
          onFinish={handleFinishExam}
          onBack={() => { setStep('selection'); setSelectedExam(null); }}
        />
      )}
    </>
  );
}

export default App;
