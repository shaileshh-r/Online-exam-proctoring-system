import React, { useState } from 'react';
import ExamDashboard from './components/ExamDashboard';
import SystemCheckLobby from './components/SystemCheckLobby';
import LoginPage from './components/LoginPage';
import ExamSelection from './components/ExamSelection';
import InstructionPage from './components/InstructionPage';
import { EXAMS } from './data/examData';

function App() {
  const [step, setStep] = useState('login'); // 'login', 'selection', 'instructions', 'lobby', 'exam'
  const [user, setUser] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submissions, setSubmissions] = useState({}); // { examId: answerData }

  const handleLogin = (userId) => {
    setUser(userId);
    setStep('selection');
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
      setSubmissions(prev => ({
        ...prev,
        [selectedExam.id]: results
      }));
    }
    setStep('selection');
    setSelectedExam(null);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedExam(null);
    setStep('login');
  };

  return (
    <>
      {step === 'login' && <LoginPage onLogin={handleLogin} />}
      {step === 'selection' && (
        <ExamSelection
          exams={EXAMS}
          submissions={submissions}
          onSelect={handleSelectExam}
          onLogout={handleLogout}
          onViewResults={(exam) => {
            setSelectedExam(exam);
            setStep('exam');
          }}
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
          isViewOnly={!!submissions[selectedExam?.id]}
          previousSubmission={submissions[selectedExam?.id]}
          onFinish={handleFinishExam}
        />
      )}
    </>
  );
}

export default App;
