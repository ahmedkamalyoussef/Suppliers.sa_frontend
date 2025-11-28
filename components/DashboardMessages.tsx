"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";

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
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [inboxData, setInboxData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInbox = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getInbox();
        console.log('Inbox API Response:', response);
        setInboxData(response);
      } catch (error) {
        console.error('Failed to fetch inbox:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInbox();
  }, []);

  const messages: { inbox: InboxMessage[]; sent: SentMessage[] } = inboxData ? {
    inbox: inboxData.inbox.map((item: any) => ({
      id: item.id,
      from: item.sender.name,
      company: item.sender.name,
      subject: item.subject,
      message: item.message,
      time: item.time_ago,
      unread: !item.is_read,
      type: item.type === 'supplier_rating' ? 'notification' : 
            item.type === 'supplier_to_supplier_inquiry' ? 'inquiry' : 'notification',
      contact: item.sender_email || '',
      phone: null,
    })),
    sent: inboxData.sent.map((item: any) => ({
      id: item.id,
      to: item.receiver.name,
      company: item.receiver.name,
      subject: item.subject,
      message: item.message,
      time: item.time_ago,
      type: 'response',
    }))
  } : { inbox: [], sent: [] };

  useEffect(() => {
    if (selectedMessageId && inboxData) {
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
  }, [selectedMessageId, inboxData]);

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

  const handleReply = async (messageId: number) => {
    if (!replyText.trim() || !inboxData) return;
    
    const message = inboxData.inbox.find((m: any) => m.id === messageId);
    if (!message) return;
    
    try {
      await apiService.replyToInboxItem({
        type: message.type,
        id: messageId,
        reply: replyText
      });
      
      // Clear reply text and close modal
      setReplyText("");
      setSelectedMessage(null);
      
      console.log('Reply sent successfully');
      
      // Refresh inbox data to show changes
      const fetchInbox = async () => {
        try {
          const response = await apiService.getInbox();
          console.log('Inbox API Response after reply:', response);
          setInboxData(response);
        } catch (error) {
          console.error('Failed to refresh inbox:', error);
        }
      };
      
      fetchInbox();
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const markAsRead = async (messageId: number) => {
    if (!inboxData) return;
    
    const message = inboxData.inbox.find((m: any) => m.id === messageId);
    if (message && !message.is_read) {
      try {
        await apiService.markAsRead({
          type: message.type,
          id: messageId
        });
        
        // Update local state
        setInboxData((prev: any) => ({
          ...prev,
          inbox: prev.inbox.map((m: any) => 
            m.id === messageId ? { ...m, is_read: true } : m
          ),
          unread_count: Math.max(0, prev.unread_count - 1)
        }));
        
        // Emit custom event to notify header component
        window.dispatchEvent(new CustomEvent('messageMarkedAsRead', {
          detail: { messageId, unreadCount: Math.max(0, inboxData.unread_count - 1) }
        }));
        
        console.log('DashboardMessages - Message marked as read and event emitted:', messageId);
        
        // Update messages object as well
        const messageInMessages = messages.inbox.find((m) => m.id === messageId);
        if (messageInMessages) {
          messageInMessages.unread = false;
        }
      } catch (error) {
        console.error('DashboardMessages - Failed to mark message as read:', error);
      }
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
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {messages[activeTab].map((message: any, index: number) => (
            <div
              key={`${activeTab}-${message.id}-${index}`}
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
                onClick={async () => {
                  if (
                    !composeTo.trim() ||
                    !composeSubject.trim() ||
                    !composeBody.trim()
                  )
                    return;
                  
                  setIsSending(true);
                  setSendError("");
                  
                  try {
                    await apiService.sendMessage({
                      receiver_email: composeTo,
                      subject: composeSubject,
                      message: composeBody,
                    });
                    
                    // Success - close modal and reset form
                    setShowCompose(false);
                    setComposeTo("");
                    setComposeSubject("");
                    setComposeBody("");
                    setSendError("");
                  } catch (error) {
                    console.error("Failed to send message:", error);
                    setSendError(error instanceof Error ? error.message : "Failed to send message");
                  } finally {
                    setIsSending(false);
                  }
                }}
                disabled={
                  isSending ||
                  !composeTo.trim() ||
                  !composeSubject.trim() ||
                  !composeBody.trim()
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                  composeTo.trim() &&
                  composeSubject.trim() &&
                  composeBody.trim() &&
                  !isSending
                    ? "bg-yellow-400 text-white hover:bg-yellow-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSending ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    {t("messagesPage.sending")}
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-line mr-2"></i>
                    {t("messagesPage.send")}
                  </>
                )}
              </button>
            </div>
            
            {/* Error Message */}
            {sendError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-600"></i>
                  <span className="text-red-700 text-sm">{sendError}</span>
                </div>
              </div>
            )}
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
                {inboxData ? inboxData.unread_count : 0}
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
              <h3 className="text-2xl font-bold text-gray-800">
                {inboxData ? inboxData.avg_response_time : '0h'}
              </h3>
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
              <h3 className="text-2xl font-bold text-gray-800">
                {inboxData ? inboxData.response_rate : '0%'}
              </h3>
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
