import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const moods = [
  { name: 'calm', emoji: '😌', color: 'bg-blue-100 hover:bg-blue-200', description: 'Need peace and tranquility' },
  { name: 'focused', emoji: '🎯', color: 'bg-purple-100 hover:bg-purple-200', description: 'Ready to learn and concentrate' },
  { name: 'motivated', emoji: '💪', color: 'bg-orange-100 hover:bg-orange-200', description: 'Feeling energized and driven' },
  { name: 'low', emoji: '😔', color: 'bg-gray-100 hover:bg-gray-200', description: 'Need something uplifting' },
  { name: 'happy', emoji: '😄', color: 'bg-yellow-100 hover:bg-yellow-200', description: 'Want to have fun' },
  { name: 'stressed', emoji: '😰', color: 'bg-red-100 hover:bg-red-200', description: 'Need to relax and unwind' },
];

const purposes = [
  { name: 'learn', icon: '📚', description: 'Gain new knowledge' },
  { name: 'relax', icon: '🛋️', description: 'Chill and unwind' },
  { name: 'inspire', icon: '✨', description: 'Get motivated' },
  { name: 'discuss', icon: '💬', description: 'Engage in conversations' },
  { name: 'entertain', icon: '🎭', description: 'Have fun and laugh' },
];

const timeOptions = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
];

export default function MoodSelector({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedTime, setSelectedTime] = useState(10);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setStep(2);
  };

  const handlePurposeSelect = (purpose) => {
    setSelectedPurpose(purpose);
    setStep(3);
  };

  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/mood-intent`,
        {
          mood: selectedMood,
          purpose: selectedPurpose,
          timeConstraint: time,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onComplete) {
        onComplete({ mood: selectedMood, purpose: selectedPurpose, time });
      }
    } catch (error) {
      console.error('Error saving mood and intent:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 3</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Mood Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">How are you feeling?</h2>
            <p className="text-gray-600 mb-8 text-center">Select your current mood</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => handleMoodSelect(mood.name)}
                  className={`${mood.color} rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="text-5xl mb-2">{mood.emoji}</div>
                  <div className="font-semibold text-gray-800 capitalize">{mood.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{mood.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Purpose Selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">What's your purpose?</h2>
            <p className="text-gray-600 mb-8 text-center">What do you want to do?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purposes.map((purpose) => (
                <button
                  key={purpose.name}
                  onClick={() => handlePurposeSelect(purpose.name)}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center"
                >
                  <div className="text-4xl mr-4">{purpose.icon}</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 capitalize">{purpose.name}</div>
                    <div className="text-sm text-gray-600">{purpose.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-6 text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to mood selection
            </button>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">How much time do you have?</h2>
            <p className="text-gray-600 mb-8 text-center">We'll curate your journey accordingly</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeSelect(option.value)}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl p-8 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="text-4xl font-bold text-purple-600 mb-2">{option.value}</div>
                  <div className="text-sm text-gray-600">{option.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to purpose selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
