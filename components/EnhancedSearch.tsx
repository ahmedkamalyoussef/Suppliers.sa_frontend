"use client";

import { useState } from "react";

interface EnhancedSearchProps {
  onSearch: (term: string) => void;
}

export default function EnhancedSearch({ onSearch }: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularSearches = [
    "Glass suppliers in Jeddah",
    "Construction materials Riyadh",
    "Electronics suppliers with delivery",
    "Medical equipment suppliers",
    "Automotive parts Dammam",
    "Food suppliers near me",
    "Industrial machinery",
    "Office furniture suppliers",
  ];

  const handleVoiceSearch = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Voice search is not supported in your browser");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "ar-SA,en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsVoiceSearch(true);

    recognition.onstart = () => {
      setIsVoiceSearch(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript);
      setIsVoiceSearch(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsVoiceSearch(false);
      alert("Voice search failed. Please try again.");
    };

    recognition.onend = () => {
      setIsVoiceSearch(false);
    };

    recognition.start();
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    if (value.length > 2) {
      const filteredSuggestions = popularSearches.filter((search) =>
        search.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (term: string = searchTerm) => {
    if (term.trim()) {
      onSearch(term.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
          <div className="pl-6">
            <i className="ri-search-line text-xl text-gray-400"></i>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(searchTerm.length > 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search suppliers, products, or services... (يمكنك البحث بالعربية أيضاً)"
            className="flex-1 px-4 py-4 text-lg bg-transparent focus:outline-none placeholder-gray-500"
          />

          {/* Voice Search Button */}
          <button
            onClick={handleVoiceSearch}
            disabled={isVoiceSearch}
            className={`p-3 mx-2 rounded-full transition-all ${
              isVoiceSearch
                ? "bg-red-100 text-red-600 animate-pulse"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Voice Search (Arabic & English)"
          >
            <i
              className={`ri-${
                isVoiceSearch ? "mic-fill" : "mic-line"
              } text-xl`}
            ></i>
          </button>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-4 rounded-r-2xl font-medium whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-search-line mr-2"></i>
            Search
          </button>
        </div>

        {/* Voice Search Indicator */}
        {isVoiceSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">
                Listening... Speak now in Arabic or English
              </span>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <p className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
                Suggestions:
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-yellow-50 rounded-lg transition-colors text-sm text-gray-700 cursor-pointer"
                >
                  <i className="ri-search-line text-gray-400 mr-2"></i>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Searches */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-gray-600 mr-2">Popular:</span>
        {popularSearches.slice(0, 6).map((search, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(search)}
            className="text-xs bg-gray-100 hover:bg-yellow-100 text-gray-700 px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            {search}
          </button>
        ))}
      </div>

      {/* Search Features */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <i className="ri-mic-line text-yellow-500"></i>
          <span>Voice Search (AR/EN)</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <i className="ri-translate-2 text-yellow-500"></i>
          <span>Bilingual Support</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <i className="ri-magic-line text-yellow-500"></i>
          <span>Smart Suggestions</span>
        </div>
      </div>
    </div>
  );
}
