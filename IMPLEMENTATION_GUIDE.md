# Scrolla - Complete Implementation Guide
## Step-by-Step Code Files

This document contains all the code for frontend components and configurations.

---

## FRONTEND COMPONENTS

### 1. MoodSelector.jsx
**Location**: `client/src/components/MoodSelector.jsx`

```jsx
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
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
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
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
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
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
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
```

---

### 2. JourneyFeed.jsx
**Location**: `client/src/components/JourneyFeed.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from './PostCard';
import InteractionPrompt from './InteractionPrompt';

export default function JourneyFeed({ mood, purpose, timeConstraint }) {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInteraction, setShowInteraction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJourneyFeed();
  }, [mood, purpose, timeConstraint]);

  const fetchJourneyFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/feed`,
        {
          params: { mood, purpose, timeConstraint },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(response.data.posts);
      setJourney(response.data.journey);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching journey feed:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setShowInteraction(true);
    } else {
      // Journey complete
      navigate('/journey-complete', { state: { journey, postsViewed: currentIndex + 1 } });
    }
  };

  const handleInteractionComplete = () => {
    setShowInteraction(false);
    setCurrentIndex(currentIndex + 1);
  };

  const handleSkip = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/journey-complete', { state: { journey, postsViewed: currentIndex + 1 } });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No content available</h2>
        <p className="text-gray-600 mb-6">We couldn't find content matching your preferences right now.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
        >
          Start New Journey
        </button>
      </div>
    );
  }

  const currentPost = posts[currentIndex];
  const progress = ((currentIndex + 1) / posts.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Journey Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Your Journey</h2>
            <p className="text-sm text-gray-600">
              {mood && `Mood: ${mood}`} {purpose && `• Purpose: ${purpose}`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{currentIndex + 1}/{posts.length}</p>
            <p className="text-xs text-gray-600">{journey?.timeLimit} min</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Post */}
      {showInteraction ? (
        <InteractionPrompt
          post={currentPost}
          onComplete={handleInteractionComplete}
          onSkip={handleSkip}
        />
      ) : (
        <>
          <PostCard post={currentPost} inJourney={true} />

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 font-semibold"
            >
              {currentIndex === posts.length - 1 ? 'Complete Journey' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

### 3. InteractionPrompt.jsx
**Location**: `client/src/components/InteractionPrompt.jsx`

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const reflectionQuestions = [
  "What's one thing you learned from this?",
  "How does this make you feel?",
  "Will you apply this in your life?",
  "What's your main takeaway?",
];

const emotionOptions = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😮', label: 'Surprised', value: 'surprised' },
  { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '💪', label: 'Motivated', value: 'motivated' },
];

export default function InteractionPrompt({ post, onComplete, onSkip }) {
  const [response, setResponse] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [interactionType, setInteractionType] = useState('reflection');

  const randomQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/posts/${post._id}/interact`,
        {
          type: interactionType,
          response: interactionType === 'emotion' ? selectedEmotion : response,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onComplete();
    } catch (error) {
      console.error('Error saving interaction:', error);
      onComplete(); // Continue anyway
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Take a Moment to Reflect
      </h3>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInteractionType('reflection')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              interactionType === 'reflection'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reflection
          </button>
          <button
            onClick={() => setInteractionType('emotion')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              interactionType === 'emotion'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Emotion
          </button>
        </div>

        {interactionType === 'reflection' ? (
          <div>
            <p className="text-gray-700 mb-4 font-medium">{randomQuestion}</p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="4"
            />
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-4 font-medium">How did this post make you feel?</p>
            <div className="grid grid-cols-5 gap-3">
              {emotionOptions.map((emotion) => (
                <button
                  key={emotion.value}
                  onClick={() => setSelectedEmotion(emotion.value)}
                  className={`p-4 rounded-lg transition-all ${
                    selectedEmotion === emotion.value
                      ? 'bg-purple-100 ring-2 ring-purple-500 scale-110'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-3xl mb-1">{emotion.emoji}</div>
                  <div className="text-xs text-gray-600">{emotion.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          disabled={interactionType === 'reflection' ? !response.trim() : !selectedEmotion}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

---

Continue in next message due to length...
