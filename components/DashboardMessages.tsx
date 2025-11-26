"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";

type InboxMessage = {
  id: number;
  from: string;
  company: string;
  subject: string;
  message: string;
  time: string;
  unread: boolean;
  type: "inquiry" | "business" | "quote" | "notification";
  contact: string;
  phone: string | null;
};

type SentMessage = {
  id: number;
  to: string;
  company: string;
  subject: string;
  message: string;
  time: string;
  type: "response" | "update";
};
 
type AnyMessage = InboxMessage | SentMessage;

type MessageType = InboxMessage["type"] | SentMessage["type"];

type DashboardMessagesProps = {
  selectedMessageId?: number | null;
};

export default function DashboardMessages({
  selectedMessageId,
}: DashboardMessagesProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<AnyMessage | null>(
    null
  );
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const messages: { inbox: InboxMessage[]; sent: SentMessage[] } = {
    inbox: [
      {
        id: 1,
        from: "Sarah Johnson",
        company: "Tech Solutions Co.",
        subject: "Bulk order inquiry for LED TVs",
        message:
          "Hi, I am interested in placing a bulk order for LED TVs. We need approximately 50 units for our office setup. Could you please provide pricing and availability? We are looking for Samsung or LG models, 43-55 inch range.",
        time: "2 hours ago",
        unread: true,
        type: "inquiry",
        contact: "sarah.johnson@techsolutions.com",
        phone: "+966 50 987 6543",
      },
      {
        id: 2,
        from: "Review System",
        company: "Platform Notification",
        subject: "New Customer Review Received",
        message:
          "You have received a new 5-star review from a customer! The review has been approved by our admin team and is now live on your business profile. The customer praised your excellent service and fast delivery.",
        time: "4 hours ago",
        unread: true,
        type: "notification",
        contact: "noreply@platform.com",
        phone: null,
      },
      {
        id: 3,
        from: "Ahmed Al-Mansouri",
        company: "Emirates Mall",
        subject: "Partnership opportunity",
        message:
          "We are expanding our electronics section and would like to discuss a potential partnership. Are you interested in setting up a retail presence in our mall? Please let me know your thoughts.",
        time: "5 hours ago",
        unread: true,
        type: "business",
        contact: "ahmed.mansouri@emiratesmall.ae",
        phone: "+971 50 123 4567",
      },
      {
        id: 4,
        from: "Review System",
        company: "Platform Notification",
        subject: "Review Notification - 4 Star Review",
        message:
          'A customer has left a 4-star review for your business. They appreciated your quality products and service. The review mentions: "Good quality products and reasonable prices. Professional service throughout."',
        time: "1 day ago",
        unread: false,
        type: "notification",
        contact: "noreply@platform.com",
        phone: null,
      },
      {
        id: 5,
        from: "Michael Chen",
        company: "Digital Innovations",
        subject: "Request for quotation",
        message:
          "We need a quote for gaming computers and accessories. Our requirements include 20 high-end gaming PCs, mechanical keyboards, gaming mice, and monitors. Timeline is flexible.",
        time: "2 days ago",
        unread: false,
        type: "quote",
        contact: "michael.chen@digitalinnovations.com",
        phone: "+966 55 456 7890",
      },
      {
        id: 6,
        from: "Lisa Rodriguez",
        company: "StartUp Hub",
        subject: "Office equipment needs",
        message:
          "Our startup is setting up a new office and we need various electronic equipment. Looking for laptops, printers, networking equipment, and audio/video conferencing setup.",
        time: "3 days ago",
        unread: false,
        type: "inquiry",
        contact: "lisa.rodriguez@startuphub.com",
        phone: "+966 56 789 0123",
      },
    ],
    sent: [
      {
        id: 7,
        to: "David Park",
        company: "Innovation Labs",
        subject: "Re: Pricing inquiry for components",
        message:
          "Thank you for your inquiry. Please find attached our latest price list for electronic components. We offer bulk discounts for orders over $10,000. Let me know if you need any specific information.",
        time: "3 hours ago",
        type: "response",
      },
      {
        id: 8,
        to: "Maria Santos",
        company: "Retail Solutions",
        subject: "Product availability update",
        message:
          'The Samsung TV models you requested are now back in stock. We have 25 units of the 50" model and 15 units of the 55" model available. Please confirm your order by end of week.',
        time: "1 day ago",
        type: "update",
      },
    ],
  };

  useEffect(() => {
    if (selectedMessageId) {
      const inboxMsg = messages.inbox.find((m) => m.id === selectedMessageId);
      const sentMsg = messages.sent.find((m) => m.id === selectedMessageId);

      const message = (inboxMsg || sentMsg) as AnyMessage | undefined;
      if (message) {
        setSelectedMessage(message);
        if ("unread" in message && message.unread) {
          markAsRead(message.id);
        }
        if (sentMsg) {
          setActiveTab("sent");
        }
      }
    }
  }, [selectedMessageId]);

  const getMessageIcon = (type: MessageType): string => {
    switch (type) {
      case "inquiry":
        return "ri-question-line";
      case "business":
        return "ri-briefcase-line";
      case "quote":
        return "ri-file-text-line";
      case "response":
        return "ri-reply-line";
      case "update":
        return "ri-information-line";
      case "notification":
        return "ri-notification-line";
      default:
        return "ri-mail-line";
    }
  };

  const getMessageColor = (type: MessageType): string => {
    switch (type) {
      case "inquiry":
        return "bg-blue-100 text-blue-600";
      case "business":
        return "bg-green-100 text-green-600";
      case "quote":
        return "bg-yellow-100 text-yellow-600";
      case "response":
        return "bg-purple-100 text-purple-600";
      case "update":
        return "bg-orange-100 text-orange-600";
      case "notification":
        return "bg-pink-100 text-pink-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleReply = (messageId: number) => {
    if (replyText.trim()) {
      setReplyText("");
      setSelectedMessage(null);
    }
  };

  const markAsRead = (messageId: number) => {
    const message = messages.inbox.find((m) => m.id === messageId);
    if (message) {
      message.unread = false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("messagesPage.title")}
        </h2>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-yellow-400 text-white px-6 py-3 rounded-lg hover:bg-yellow-500 font-medium whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line mr-2"></i>
          {t("messagesPage.compose")}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Message Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-6">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "inbox"
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="ri-inbox-line mr-2"></i>
              {t("messagesPage.inbox")} (
              {messages.inbox.filter((m) => m.unread).length})
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                activeTab === "sent"
                  ? "border-yellow-400 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="ri-send-plane-line mr-2"></i>
              {t("messagesPage.sent")} ({messages.sent.length})
            </button>
          </nav>
        </div>

        {/* Messages List */}
        <div className="divide-y divide-gray-100">
          {messages[activeTab].map((message: any, index: number) => (
            <div
              key={message.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                message.unread ? "bg-blue-50" : ""
              }`}
              onClick={() => {
                setSelectedMessage(message);
                if (message.unread) markAsRead(message.id);
              }}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getMessageColor(
                    message.type
                  )}`}
                >
                  <i className={`${getMessageIcon(message.type)} text-sm`}></i>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3
                        className={`font-medium ${
                          message.unread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {activeTab === "inbox" ? message.from : message.to}
                      </h3>
                      {message.company && (
                        <span className="text-sm text-gray-500">
                          • {message.company}
                        </span>
                      )}
                      {message.unread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {message.time}
                    </span>
                  </div>

                  <h4
                    className={`text-sm mb-2 ${
                      message.unread
                        ? "font-medium text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {message.subject}
                  </h4>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.message}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <i className="ri-star-line"></i>
                  </button>
                  <button className="text-gray-400 hover:text-gray-6 cursor-pointer">
                    <i className="ri-more-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${getMessageColor(
                      selectedMessage.type
                    )}`}
                  >
                    <i
                      className={`${getMessageIcon(
                        selectedMessage.type
                      )} text-sm`}
                    ></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {"from" in selectedMessage
                        ? selectedMessage.from
                        : selectedMessage.to}
                    </h3>
                    {"company" in selectedMessage &&
                      selectedMessage.company && (
                        <p className="text-sm text-gray-600">
                          {selectedMessage.company}
                        </p>
                      )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>{selectedMessage.time}</span>
                  {"contact" in selectedMessage && selectedMessage.contact && (
                    <span className="flex items-center">
                      <i className="ri-mail-line mr-1"></i>
                      {selectedMessage.contact}
                    </span>
                  )}
                  {"phone" in selectedMessage && selectedMessage.phone && (
                    <span className="flex items-center">
                      <i className="ri-phone-line mr-1"></i>
                      {selectedMessage.phone}
                    </span>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {activeTab === "inbox" && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-3">
                    {t("messagesPage.reply")}
                  </h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                    placeholder={t("messagesPage.typeReplyPlaceholder")}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {t("messagesPage.charactersCounter").replace(
                        "{{count}}",
                        String(replyText.length)
                      )}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
                      >
                        {t("messagesPage.cancel")}
                      </button>
                      <button
                        onClick={() => handleReply(selectedMessage.id)}
                        disabled={!replyText.trim()}
                        className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                          replyText.trim()
                            ? "bg-yellow-400 text-white hover:bg-yellow-500"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <i className="ri-send-plane-line mr-2"></i>
                        {t("messagesPage.sendReply")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                {t("messagesPage.newMessage")}
              </h3>
              <button
                onClick={() => setShowCompose(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("messagesPage.to")}
                </label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder={t("messagesPage.recipientPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("messagesPage.subject")}
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder={t("messagesPage.subjectPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  {t("messagesPage.message")}
                </label>
                <textarea
                  rows={6}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder={t("messagesPage.messagePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                {t("messagesPage.cancel")}
              </button>
              <button
                onClick={() => {
                  if (
                    !composeTo.trim() ||
                    !composeSubject.trim() ||
                    !composeBody.trim()
                  )
                    return;
                  // In a real app, send the message to backend here
                  setShowCompose(false);
                  setComposeTo("");
                  setComposeSubject("");
                  setComposeBody("");
                }}
                disabled={
                  !composeTo.trim() ||
                  !composeSubject.trim() ||
                  !composeBody.trim()
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                  composeTo.trim() &&
                  composeSubject.trim() &&
                  composeBody.trim()
                    ? "bg-yellow-400 text-white hover:bg-yellow-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <i className="ri-send-plane-line mr-2"></i>
                {t("messagesPage.send")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-mail-unread-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {messages.inbox.filter((m) => m.unread).length}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("messagesPage.unreadMessages")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">2.4h</h3>
              <p className="text-gray-600 text-sm">
                {t("messagesPage.avgResponseTime")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-percent-line text-yellow-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">94%</h3>
              <p className="text-gray-600 text-sm">
                {t("messagesPage.responseRate")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
