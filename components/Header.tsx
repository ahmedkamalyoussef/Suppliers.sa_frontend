"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../lib/api";
import LanguageSwitcher from "./LanguageSwitcher";
import ContactModal from "./ContactModal";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [inboxData, setInboxData] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  const unreadCount = inboxData ? inboxData.unread_count : 0;

  // Get user data from auth context
  const userName = user?.name || "";
  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SU";

  // Track auth state changes and fetch inbox data
  useEffect(() => {
    if (isAuthenticated) {
      const fetchInbox = async () => {
        try {
          const response = await apiService.getInbox();
          console.log('Header - Inbox API Response:', response);
          setInboxData(response);
          
          // Map only received messages for recent messages display
          const mappedMessages = response.inbox.slice(0, 3).map((item: any) => ({
            id: item.id,
            from: item.sender.name,
            company: item.sender.name,
            subject: item.subject,
            preview: item.message.length > 60 ? item.message.substring(0, 60) + '...' : item.message,
            time: item.time_ago,
            unread: !item.is_read,
            avatar: item.sender.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
          }));
          
          setRecentMessages(mappedMessages);
        } catch (error) {
          console.error('Header - Failed to fetch inbox:', error);
        }
      };

      fetchInbox();
    }
  }, [isAuthenticated]);

  // Listen for message marked as read events
  useEffect(() => {
    const handleMessageMarkedAsRead = (event: CustomEvent) => {
      const { messageId, unreadCount } = event.detail;
      console.log('Header - Received messageMarkedAsRead event:', { messageId, unreadCount });
      
      // Update unread count
      if (inboxData) {
        setInboxData((prev: any) => ({
          ...prev,
          unread_count: unreadCount
        }));
      }
      
      // Update recent messages to remove unread status
      setRecentMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, unread: false } : msg
        )
      );
    };

    // Add event listener
    window.addEventListener('messageMarkedAsRead', handleMessageMarkedAsRead as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('messageMarkedAsRead', handleMessageMarkedAsRead as EventListener);
    };
  }, [inboxData]);

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await logout();
    router.push("/");
  };

  const handleMessageClick = async (messageId: number) => {
    setIsMessagesOpen(false);
    
    // Mark message as read if it's unread
    if (inboxData) {
      const message = inboxData.inbox.find((m: any) => m.id === messageId);
      if (message && !message.is_read) {
        try {
          await apiService.markAsRead({
            type: message.type,
            id: messageId
          });
          
          console.log('Header - Message marked as read:', messageId);
          
          // Update local state
          setInboxData((prev: any) => ({
            ...prev,
            inbox: prev.inbox.map((m: any) => 
              m.id === messageId ? { ...m, is_read: true } : m
            ),
            unread_count: Math.max(0, prev.unread_count - 1)
          }));
          
          // Update recent messages as well
          setRecentMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, unread: false } : msg
            )
          );
        } catch (error) {
          console.error('Header - Failed to mark message as read:', error);
        }
      }
    }
    
    router.push(`/dashboard?tab=messages&messageId=${messageId}`);
  };

  const handleViewAllMessages = () => {
    setIsMessagesOpen(false);
    router.push("/dashboard?tab=messages");
  };

  const bannerContent = (
    <div className="inline-flex items-center gap-8 text-xs md:text-sm font-medium px-8">
      <span className="flex items-center">
        <i className="ri-trophy-fill mr-2"></i>
        <span className="hidden sm:inline">{t("banner.slogan1Long")}</span>
        <span className="sm:hidden">{t("banner.slogan1Short")}</span>
      </span>

      <span className="text-yellow-100">•</span>

      <span className="flex items-center">
        <i className="ri-global-line mr-2"></i>
        <span className="hidden sm:inline">{t("banner.slogan2Long")}</span>
        <span className="sm:hidden">{t("banner.slogan2Short")}</span>
      </span>

      <span className="text-yellow-100">•</span>

      <span className="flex items-center">
        <i className="ri-truck-line mr-2"></i>
        <span className="hidden sm:inline">{t("banner.slogan3Long")}</span>
        <span className="sm:hidden">{t("banner.slogan3Short")}</span>
      </span>

      <span className="text-yellow-100">•</span>

      <span className="flex items-center">
        <i className="ri-handshake-line mr-2"></i>
        <span className="hidden sm:inline">{t("banner.slogan4Long")}</span>
        <span className="sm:hidden">{t("banner.slogan4Short")}</span>
      </span>
    </div>
  );

  return (
    <>
      {/* 🟡 Advertising Banner مع Framer Motion */}
      <div className="relative bg-gradient-to-r from-yellow-400 to-green-400 text-white py-2 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-yellow-400 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-green-400 to-transparent z-10" />

        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: isRTL ? ["100%", "-100%"] : ["-100%", "100%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-shrink-0">
              {bannerContent}
            </div>
          ))}
        </motion.div>
      </div>

      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Section - Fixed direction regardless of language */}
            <div
              className={`flex items-center space-x-2 sm:space-x-3 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400"
                  fill="currentColor"
                >
                  <circle cx="7" cy="7" r="3" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="17" cy="7" r="3" />
                  <path
                    d="M10 7h4M10 10l7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                <span className="text-gray-800">Supplier</span>
                <span className="text-green-400">.sa</span>
              </div>
            </div>

            {/* Navigation - Desktop Only */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8 gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors text-sm xl:text-base"
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/businesses"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors text-sm xl:text-base"
              >
                {t("nav.allSuppliers")}
              </Link>
              <Link
                href="/subscription"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors text-sm xl:text-base"
              >
                {t("nav.subscription")}
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors text-sm xl:text-base"
              >
                {t("nav.aboutUs")}
              </Link>
              <button
                onClick={() => setShowContactModal(true)}
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors cursor-pointer text-sm xl:text-base"
              >
                {t("nav.contact")}
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Language Switcher - Always Visible */}
              <div className="flex-shrink-0 ml-4">
                <LanguageSwitcher />
              </div>

              {/* Logged In User Menu */}
              {!loading && isAuthenticated ? (
                <>
                  {/* Messages */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                      className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors cursor-pointer"
                    >
                      <i className="ri-message-2-line text-xl md:text-2xl"></i>
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-medium">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Messages Dropdown */}
                    {isMessagesOpen && (
                      <>
                        {/* Backdrop for mobile */}
                        <div
                          className="fixed inset-0 bg-black bg-opacity-25 lg:hidden z-40"
                          onClick={() => setIsMessagesOpen(false)}
                        ></div>

                        <div
                          className={`fixed lg:absolute ${
                            isRTL
                              ? "lg:left-0 lg:right-auto"
                              : "lg:right-0 lg:left-auto"
                          } left-0 right-0 top-16 lg:top-auto lg:mt-2 mx-4 lg:mx-0 w-auto lg:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50 max-h-[80vh] lg:max-h-96 overflow-hidden`}
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-800 text-base">
                                {t("messages.recent")}
                              </h3>
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                                {unreadCount} {t("messages.newCountSuffix")}
                              </span>
                            </div>
                          </div>

                          <div className="max-h-[60vh] lg:max-h-80 overflow-y-auto">
                            {recentMessages.map((message) => (
                              <div
                                key={message.id}
                                onClick={() => handleMessageClick(message.id)}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                              >
                                <div
                                  className={`flex items-start ${
                                    isRTL
                                      ? "space-x-reverse space-x-3"
                                      : "space-x-3"
                                  }`}
                                >
                                  <div className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                                    {message.avatar}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`flex items-center justify-between mb-1 ${
                                        isRTL ? "flex-row-reverse" : ""
                                      }`}
                                    >
                                      <h4 className="font-medium text-gray-800 text-sm truncate">
                                        {message.from}
                                      </h4>
                                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                        {message.time}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">
                                      {message.company}
                                    </p>
                                    <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                                      {message.subject}
                                    </p>
                                    <p className="text-xs text-gray-500 line-clamp-2">
                                      {message.preview}
                                    </p>
                                  </div>
                                  {message.unread && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="px-4 py-3 border-t border-gray-100">
                            <button
                              onClick={handleViewAllMessages}
                              className="w-full bg-yellow-400 text-white py-2 px-4 rounded-lg hover:bg-yellow-500 font-medium text-sm whitespace-nowrap cursor-pointer transition-colors"
                            >
                              {t("messages.viewAll")}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 md:space-x-3 text-gray-700 hover:text-yellow-600 transition-colors cursor-pointer p-1"
                    >
                      <div className="w-8 h-8 md:w-9 md:h-9 bg-yellow-400 text-white rounded-full flex items-center justify-center font-medium text-sm ml-4">
                        {userInitials}
                      </div>
                      <span className="hidden lg:block font-medium text-sm ml-1 ">
                        {userName || "User"}
                      </span>
                      <i className="ri-arrow-down-s-line hidden lg:block text-lg"></i>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop for mobile */}
                        <div
                          className="fixed inset-0 bg-black bg-opacity-25 lg:hidden z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        ></div>

                        <div className="fixed lg:absolute right-4 lg:right-0 top-16 lg:top-auto lg:mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-yellow-400 text-white rounded-full flex items-center justify-center font-medium">
                                {userInitials}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {userName || "User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {t("userMenu.viewProfile")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/profile/${user?.id || 'me'}`}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="ri-user-line text-lg"></i>
                            <span className="text-sm font-medium">
                              {t("userMenu.viewProfile")}
                            </span>
                          </Link>

                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <i className="ri-dashboard-line text-lg"></i>
                            <span className="text-sm font-medium">
                              {t("userMenu.dashboard")}
                            </span>
                          </Link>
                          

                          <div className="border-t border-gray-100 my-2"></div>

                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <i className="ri-logout-box-r-line text-lg"></i>
                            <span className="text-sm font-medium">
                              {t("userMenu.signOut")}
                            </span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-700 hover:text-yellow-600 transition-colors cursor-pointer"
                  >
                    <i
                      className={`${
                        mobileMenuOpen ? "ri-close-line" : "ri-menu-line"
                      } text-2xl`}
                    ></i>
                  </button>
                </>
              ) : (
                <>
                  {/* If not logged in, show auth links */}
                  <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
                    <Link
                      href="/register"
                      className="text-gray-700 hover:text-yellow-600 font-medium transition-colors text-sm"
                    >
                      {t("nav.register")}
                    </Link>
                    <Link
                      href="/login"
                      className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium"
                    >
                      {t("nav.login")}
                    </Link>
                  </div>

                  {/* Mobile Menu Button for Guest */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden lg:hidden p-2 text-gray-700 hover:text-yellow-600 transition-colors cursor-pointer"
                  >
                    <i
                      className={`${
                        mobileMenuOpen ? "ri-close-line" : "ri-menu-line"
                      } text-2xl`}
                    ></i>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <Link
                href="/"
                className="block text-gray-700 hover:text-yellow-600 hover:bg-gray-50 font-medium transition-colors py-2 px-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/businesses"
                className="block text-gray-700 hover:text-yellow-600 hover:bg-gray-50 font-medium transition-colors py-2 px-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.allSuppliers")}
              </Link>
              <Link
                href="/subscription"
                className="block text-gray-700 hover:text-yellow-600 hover:bg-gray-50 font-medium transition-colors py-2 px-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.subscription")}
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-yellow-600 hover:bg-gray-50 font-medium transition-colors py-2 px-3 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.aboutUs")}
              </Link>
              <button
                onClick={() => {
                  setShowContactModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:text-yellow-600 hover:bg-gray-50 font-medium transition-colors py-2 px-3 rounded-lg cursor-pointer"
              >
                {t("nav.contact")}
              </button>

              {/* Show Auth Links for Guest on Mobile */}
              {!loading && !isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <Link
                    href="/register"
                    className="block w-full text-center text-gray-700 hover:text-yellow-600 border border-gray-300 font-medium transition-colors py-2 px-3 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.register")}
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full text-center bg-yellow-400 text-white font-medium transition-colors py-2 px-3 rounded-lg hover:bg-yellow-500"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("nav.login")}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </>
  );
}
