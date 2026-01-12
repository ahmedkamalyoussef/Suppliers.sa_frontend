"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { useAISearch } from "../contexts/AISearchContext";

// Helper hook to safely use AISearch context
function useAISearchSafe() {
  try {
    return useAISearch();
  } catch (error) {
    // Return a no-op fallback when context is not available
    return {
      aiSearchQuery: null,
      setAISearchQuery: () => {},
    };
  }
}

type ChatSender = "ai" | "user";
type ChatMessage = {
  id: number;
  text: string;
  sender: ChatSender;
  timestamp: Date;
};

type AISuggestions = {
  categories: string[];
  locations: string[];
  rating: number | null;
  features: string[];
  businessTypes: string[];
  products: string[];
};

export default function AIChatWidget() {
  const { t } = useLanguage();
  const { setAISearchQuery } = useAISearchSafe();
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: t("aiChat.initialMessage"),
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAISuggestions = (query: string): AISuggestions => {
    const lowerQuery = query.toLowerCase();

    const suggestions: AISuggestions = {
      categories: [],
      locations: [],
      rating: null,
      features: [],
      businessTypes: [],
      products: [],
    };

    // Enhanced product/service recognition and category mapping
    const categoryMappings: Record<string, string> = {
      "glass|window|door|construction|building|cement|concrete|marble|tile|paint|steel|metal|iron":
        "construction-real-estate",
      "electronic|computer|tech|software|hardware|smartphone|laptop|tablet":
        "consumer-electronics",
      "food|restaurant|catering|grocery|beverage|drink|cafe|kitchen":
        "food-beverage",
      "medical|healthcare|hospital|pharmaceutical|medicine|clinic|equipment":
        "hospital-medical",
      "auto|car|vehicle|automotive|spare parts|garage|tire|engine":
        "automobile",
      "textile|fabric|clothing|apparel|fashion|garment|cotton|silk":
        "textiles-fabrics",
      "chemical|industrial|manufacturing|factory|machinery|equipment":
        "industrial-supplies",
      "furniture|office|home|decoration|interior|chair|table|sofa": "furniture",
      "oil|gas|petroleum|energy|fuel|power|electricity": "oil-gas",
      "agriculture|farming|crop|livestock|fertilizer|seed|plant": "agriculture",
      "jewelry|gold|silver|diamond|accessories|watch|ring": "jewelry-gemstones",
      "leather|bag|shoe|belt|wallet|handbag": "leather-products",
      "plastic|polymer|packaging|container|bottle": "plastics-products",
      "paper|printing|publishing|stationery|book|magazine":
        "printing-publishing",
      "security|protection|safety|surveillance|camera|alarm":
        "security-protection",
      "sport|entertainment|game|toy|recreation|fitness": "sports-entertainment",
      "telecommunication|phone|internet|network|mobile|wifi":
        "telecommunications",
      "hotel|hospitality|restaurant|catering|tourism": "hotel-supplies",
      "office|school|education|stationery|supplies|pen|notebook":
        "office-school",
    };

    // Product-specific detection
    const productMappings: Record<string, string> = {
      "glass|window|mirror": "Glass & Windows",
      "door|gate|entrance": "Doors & Gates",
      "cement|concrete|building material": "Construction Materials",
      "marble|tile|flooring": "Marble & Tiles",
      "paint|coating|color": "Paints & Coatings",
      "steel|metal|iron": "Steel & Metals",
      "computer|laptop|desktop": "Computers & Laptops",
      "phone|mobile|smartphone": "Mobile Phones",
      "food|restaurant|grocery": "Food Products",
      "medical|medicine|health": "Medical Supplies",
      "car|vehicle|automotive": "Automotive Parts",
      "clothing|fabric|textile": "Clothing & Textiles",
      "furniture|chair|table": "Furniture",
      "electronic|device|gadget": "Electronics",
    };

    // Detect categories
    Object.entries(categoryMappings).forEach(([keywords, category]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.categories.includes(category)) {
          suggestions.categories.push(category);
        }
      }
    });

    // Detect specific products
    Object.entries(productMappings).forEach(([keywords, product]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.products.includes(product)) {
          suggestions.products.push(product);
        }
      }
    });

    // Enhanced location detection
    const locationMappings: Record<string, string> = {
      "riyadh|riyad|الرياض": "Riyadh",
      "jeddah|jidda|jedda|جدة": "Jeddah",
      "makkah|mecca|maka|مكة": "Makkah",
      "medina|madinah|المدينة": "Madinah",
      "dammam|الدمام": "Dammam",
      "khobar|خبر": "Khobar",
      "taif|الطائف": "Taif",
      "abha|أبها": "Abha",
      "tabuk|تبوك": "Tabuk",
      "buraidah|بريدة": "Buraidah",
      "saudi|ksa|المملكة|السعودية": "Saudi Arabia",
    };

    Object.entries(locationMappings).forEach(([keywords, location]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.locations.includes(location)) {
          suggestions.locations.push(location);
        }
      }
    });

    // Business type detection
    const businessTypeMappings: Record<string, string> = {
      "supplier|supply|supplying|distribute|distributor|manufacturer|factory":
        "Supplier",
      "store|shop|retail|market|outlet|showroom": "Store",
      "office|company|corporate|business|provider": "Office",
      "individual|freelance|personal|private": "Individual",
    };

    Object.entries(businessTypeMappings).forEach(([keywords, type]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.businessTypes.includes(type)) {
          suggestions.businessTypes.push(type);
        }
      }
    });

    // Quality indicators
    const qualityIndicators: Record<string, number> = {
      "best|top|excellent|premium|high quality|superior|quality|جودة|أفضل": 4,
      "good|reliable|trusted|trustworthy|موثوق|جيد": 3,
      "average|decent|okay|متوسط": 2,
    };

    Object.entries(qualityIndicators).forEach(([keywords, rating]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        suggestions.rating = Math.max(suggestions.rating || 0, rating);
      }
    });

    // Feature detection
    const featureMappings = {
      "delivery|shipping|transport|توصيل|شحن": "delivery",
      "24/7|24 hours|always open|طوال اليوم": "24_7",
      "warranty|guarantee|ضمان|كفالة": "warranty",
      "installation|setup|fitting|تركيب": "installation",
      "wholesale|بالجملة|جمله": "wholesale",
      "retail|مفرق|مفرد": "retail",
    };

    Object.entries(featureMappings).forEach(([keywords, feature]) => {
      const keywordList = keywords.split("|");
      if (keywordList.some((keyword) => lowerQuery.includes(keyword))) {
        if (!suggestions.features.includes(feature)) {
          suggestions.features.push(feature);
        }
      }
    });

    return suggestions;
  };

  const navigateAndFilter = (suggestions: AISuggestions, query: string) => {
    // Set the AI search query in context to be used by AIFilterBar
    setAISearchQuery(query);

    // Optionally navigate to businesses page if not already there
    if (window.location.pathname !== "/businesses") {
      router.push("/businesses");
    }
  };

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Always generate suggestions for any user query
    const suggestions = generateAISuggestions(userMessage);

    // Check if we have enough information to perform a search
    const hasEnoughInfo =
      suggestions.categories.length > 0 ||
      suggestions.products.length > 0 ||
      suggestions.locations.length > 0;

    if (hasEnoughInfo) {
      // Set AI search query and navigate after a short delay
      setTimeout(() => {
        navigateAndFilter(suggestions, userMessage);
      }, 2000);

      let response = `🔍 **${t("aiChat.searching")}**\n\n`;

      if (suggestions.products.length > 0) {
        response += `📦 **${t(
          "aiChat.products"
        )}:** ${suggestions.products.join(", ")}\n`;
      }

      if (suggestions.categories.length > 0) {
        response += `🏷️ **${t(
          "aiChat.category"
        )}:** ${suggestions.categories.join(", ")}\n`;
      }

      if (suggestions.locations.length > 0) {
        response += `📍 **${t(
          "aiChat.location"
        )}:** ${suggestions.locations.join(", ")}\n`;
      }

      if (suggestions.businessTypes.length > 0) {
        response += `🏢 **${t(
          "aiChat.businessType"
        )}:** ${suggestions.businessTypes.join(", ")}\n`;
      }

      if (suggestions.rating) {
        response += `⭐ **${t("aiChat.minRating")}:** ${
          suggestions.rating
        }+ ${t("aiChat.stars")}\n`;
      }

      if (suggestions.features.length > 0) {
        response += `✨ **${t("aiChat.features")}:** ${suggestions.features
          .map((f) => f.replace("_", " "))
          .join(", ")}\n`;
      }

      response += `\n${t("aiChat.redirecting")}`;

      return response;
    }

    // If not enough information, ask for more details
    let followUpQuestion = `${t("aiChat.needMoreInfo")}\n\n`;

    const missingInfo = [];
    if (suggestions.categories.length === 0) {
      missingInfo.push(t("aiChat.missingProduct"));
    }
    if (suggestions.locations.length === 0) {
      missingInfo.push(t("aiChat.missingLocation"));
    }
    if (suggestions.businessTypes.length === 0) {
      missingInfo.push(t("aiChat.missingBusinessType"));
    }

    if (missingInfo.length > 0) {
      followUpQuestion += missingInfo.join("\n");
    } else {
      followUpQuestion = t("aiChat.enoughInfo");
    }

    return followUpQuestion;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        text: simulateAIResponse(currentMessage),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick suggestions for common searches
  const quickSuggestions: string[] = [
    t("aiChat.quickSuggestions.glass"),
    t("aiChat.quickSuggestions.electronics"),
    t("aiChat.quickSuggestions.construction"),
    t("aiChat.quickSuggestions.food"),
    t("aiChat.quickSuggestions.medical"),
  ];

  return (
    <>
      {/* Chat Widget - Always visible */}
      <div className="fixed bottom-6 right-6 z-200">
        {/* Minimized State */}
        {isMinimized && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center group"
            >
              <i className="ri-robot-line text-xl group-hover:animate-pulse"></i>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
            <p className="text-xs font-medium text-gray-700 text-center whitespace-nowrap">
              {t("aiChat.letAIHelp") || "Let AI Help"}
            </p>
          </div>
        )}

        {/* Full Chat Widget */}
        {!isMinimized && (
          <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <i className="ri-robot-line text-yellow-500"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    {t("aiChat.title")}
                  </h3>
                  <p className="text-yellow-100 text-xs">
                    {t("aiChat.subtitle")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-yellow-100 cursor-pointer p-1 rounded"
                  title={t("aiChat.minimize")}
                >
                  <i className="ri-subtract-line text-lg"></i>
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:text-yellow-100 cursor-pointer p-1 rounded"
                  title={t("aiChat.close")}
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.sender === "user"
                        ? "bg-yellow-500 text-white rounded-2xl rounded-br-sm"
                        : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100"
                    } px-4 py-2 whitespace-pre-line`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-yellow-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Suggestions */}
              {messages.length <= 2 && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs text-gray-500 text-center">
                    {t("aiChat.tryAsking")}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("aiChat.placeholder")}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-10 h-10 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <i className="ri-send-plane-line"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
