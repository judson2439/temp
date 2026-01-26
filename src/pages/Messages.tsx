import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Search, 
  ArrowLeft,
  User,
  MapPin,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Star,
  Archive,
  Trash2,
  Filter,
  ChevronDown,
  Home,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: 'buyer' | 'seller';
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  propertyPrice?: number;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

export default function Messages() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('current-user');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred'>('all');
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user info from session
    const session = localStorage.getItem('session');
    const role = localStorage.getItem('userRole');
    
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession?.user?.email) {
          setUserName(parsedSession.user.email.split('@')[0]);
          setUserRole(parsedSession.user.role || role || 'buyer');
        }
      } catch (e) {
        console.error('Error parsing session:', e);
      }
    }

    // Initialize demo conversations based on user role
    initializeDemoConversations(role || 'buyer');
  }, []);

  const initializeDemoConversations = (role: string) => {
    const now = new Date();
    
    if (role === 'seller') {
      // Seller sees messages from potential buyers
      setConversations([
        {
          id: '1',
          participantId: 'buyer-1',
          participantName: 'John Smith',
          participantRole: 'buyer',
          propertyId: 'prop-1',
          propertyTitle: 'Beautiful 10-Acre Ranch',
          propertyImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&h=100&fit=crop',
          propertyPrice: 75000,
          messages: [
            { id: 'm1', senderId: 'buyer-1', text: 'Hi! I\'m interested in your 10-acre ranch property. Is it still available?', timestamp: new Date(now.getTime() - 3600000 * 24), read: true },
            { id: 'm2', senderId: 'current-user', text: 'Yes, it\'s still available! Would you like to schedule a viewing?', timestamp: new Date(now.getTime() - 3600000 * 23), read: true },
            { id: 'm3', senderId: 'buyer-1', text: 'That would be great! I\'m available this weekend. Does Saturday work for you?', timestamp: new Date(now.getTime() - 3600000 * 5), read: true },
            { id: 'm4', senderId: 'current-user', text: 'Saturday works perfectly. How about 10 AM?', timestamp: new Date(now.getTime() - 3600000 * 4), read: true },
            { id: 'm5', senderId: 'buyer-1', text: 'Perfect! I\'ll be there. Can you send me the exact location?', timestamp: new Date(now.getTime() - 3600000 * 2), read: false },
          ],
          lastMessage: 'Perfect! I\'ll be there. Can you send me the exact location?',
          lastMessageTime: new Date(now.getTime() - 3600000 * 2),
          unreadCount: 1,
          isOnline: true
        },
        {
          id: '2',
          participantId: 'buyer-2',
          participantName: 'Sarah Johnson',
          participantRole: 'buyer',
          propertyId: 'prop-2',
          propertyTitle: 'Mountain View Property',
          propertyImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
          propertyPrice: 125000,
          messages: [
            { id: 'm1', senderId: 'buyer-2', text: 'Hello! I saw your mountain view property listing. The views look amazing!', timestamp: new Date(now.getTime() - 3600000 * 48), read: true },
            { id: 'm2', senderId: 'current-user', text: 'Thank you! The views are even better in person. Are you interested in visiting?', timestamp: new Date(now.getTime() - 3600000 * 47), read: true },
            { id: 'm3', senderId: 'buyer-2', text: 'Yes, definitely! What\'s the best time to visit?', timestamp: new Date(now.getTime() - 3600000 * 24), read: true },
          ],
          lastMessage: 'Yes, definitely! What\'s the best time to visit?',
          lastMessageTime: new Date(now.getTime() - 3600000 * 24),
          unreadCount: 0,
          isOnline: false
        },
        {
          id: '3',
          participantId: 'buyer-3',
          participantName: 'Michael Davis',
          participantRole: 'buyer',
          propertyId: 'prop-1',
          propertyTitle: 'Beautiful 10-Acre Ranch',
          propertyImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&h=100&fit=crop',
          propertyPrice: 75000,
          messages: [
            { id: 'm1', senderId: 'buyer-3', text: 'Is the price negotiable for the ranch property?', timestamp: new Date(now.getTime() - 3600000 * 72), read: true },
            { id: 'm2', senderId: 'current-user', text: 'I\'m open to reasonable offers. What did you have in mind?', timestamp: new Date(now.getTime() - 3600000 * 71), read: true },
            { id: 'm3', senderId: 'buyer-3', text: 'I was thinking around $70,000. Would that work?', timestamp: new Date(now.getTime() - 3600000 * 48), read: false },
            { id: 'm4', senderId: 'buyer-3', text: 'Let me know when you get a chance. Thanks!', timestamp: new Date(now.getTime() - 3600000 * 36), read: false },
          ],
          lastMessage: 'Let me know when you get a chance. Thanks!',
          lastMessageTime: new Date(now.getTime() - 3600000 * 36),
          unreadCount: 2,
          isOnline: true
        },
      ]);
    } else {
      // Buyer sees messages from sellers
      setConversations([
        {
          id: '1',
          participantId: 'seller-1',
          participantName: 'Robert Wilson',
          participantRole: 'seller',
          propertyId: 'prop-1',
          propertyTitle: 'Lakefront Paradise - 5 Acres',
          propertyImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=100&h=100&fit=crop',
          propertyPrice: 95000,
          messages: [
            { id: 'm1', senderId: 'current-user', text: 'Hi! I\'m very interested in your lakefront property. Is it still available?', timestamp: new Date(now.getTime() - 3600000 * 24), read: true },
            { id: 'm2', senderId: 'seller-1', text: 'Hello! Yes, it\'s still available. It\'s a beautiful property with direct lake access.', timestamp: new Date(now.getTime() - 3600000 * 23), read: true },
            { id: 'm3', senderId: 'current-user', text: 'That sounds perfect! Can I schedule a visit?', timestamp: new Date(now.getTime() - 3600000 * 22), read: true },
            { id: 'm4', senderId: 'seller-1', text: 'Of course! I\'m available this weekend. Would Saturday or Sunday work better for you?', timestamp: new Date(now.getTime() - 3600000 * 3), read: false },
          ],
          lastMessage: 'Of course! I\'m available this weekend. Would Saturday or Sunday work better for you?',
          lastMessageTime: new Date(now.getTime() - 3600000 * 3),
          unreadCount: 1,
          isOnline: true
        },
        {
          id: '2',
          participantId: 'seller-2',
          participantName: 'Emily Brown',
          participantRole: 'seller',
          propertyId: 'prop-2',
          propertyTitle: 'Desert Oasis - 20 Acres',
          propertyImage: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=100&h=100&fit=crop',
          propertyPrice: 45000,
          messages: [
            { id: 'm1', senderId: 'current-user', text: 'Hello! I saw your desert property listing. What utilities are available?', timestamp: new Date(now.getTime() - 3600000 * 72), read: true },
            { id: 'm2', senderId: 'seller-2', text: 'Hi there! The property has electricity at the road and a well permit is included.', timestamp: new Date(now.getTime() - 3600000 * 70), read: true },
            { id: 'm3', senderId: 'current-user', text: 'Great! Is there road access?', timestamp: new Date(now.getTime() - 3600000 * 68), read: true },
            { id: 'm4', senderId: 'seller-2', text: 'Yes, there\'s a maintained dirt road that leads directly to the property.', timestamp: new Date(now.getTime() - 3600000 * 48), read: true },
          ],
          lastMessage: 'Yes, there\'s a maintained dirt road that leads directly to the property.',
          lastMessageTime: new Date(now.getTime() - 3600000 * 48),
          unreadCount: 0,
          isOnline: false
        },
        {
          id: '3',
          participantId: 'seller-3',
          participantName: 'David Martinez',
          participantRole: 'seller',
          propertyId: 'prop-3',
          propertyTitle: 'Wooded Retreat - 15 Acres',
          propertyImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&h=100&fit=crop',
          propertyPrice: 85000,
          messages: [
            { id: 'm1', senderId: 'current-user', text: 'Is this property suitable for building a cabin?', timestamp: new Date(now.getTime() - 3600000 * 96), read: true },
            { id: 'm2', senderId: 'seller-3', text: 'Absolutely! The property has several great building sites with beautiful tree coverage.', timestamp: new Date(now.getTime() - 3600000 * 94), read: true },
          ],
          lastMessage: 'Absolutely! The property has several great building sites with beautiful tree coverage.',
          lastMessageTime: new Date(now.getTime() - 3600000 * 94),
          unreadCount: 0,
          isOnline: true
        },
      ]);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is updated before scrolling
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        const messagesContainer = messagesEndRef.current.parentElement;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedConversation?.messages]);


  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: userId,
      text: newMessage.trim(),
      timestamp: new Date(),
      read: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMsg.text,
          lastMessageTime: newMsg.timestamp
        };
      }
      return conv;
    }));

    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMsg],
      lastMessage: newMsg.text,
      lastMessageTime: newMsg.timestamp
    } : null);

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'unread') {
      return matchesSearch && conv.unreadCount > 0;
    }
    return matchesSearch;
  });

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const selectConversation = (conv: Conversation) => {
    // Prevent page scroll by storing current scroll position
    const currentScrollY = window.scrollY;
    
    // Mark messages as read
    setConversations(prev => prev.map(c => {
      if (c.id === conv.id) {
        return {
          ...c,
          unreadCount: 0,
          messages: c.messages.map(m => ({ ...m, read: true }))
        };
      }
      return c;
    }));

    setSelectedConversation({
      ...conv,
      unreadCount: 0,
      messages: conv.messages.map(m => ({ ...m, read: true }))
    });
    setShowMobileList(false);
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white pt-28 pb-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
                <p className="text-blue-100 text-sm mt-1">
                  {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          <div className="flex h-full">

            {/* Conversations List */}
            <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${!showMobileList && selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filterType === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                      filterType === 'unread' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Unread
                    {totalUnread > 0 && (
                      <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                        filterType === 'unread' ? 'bg-white/20' : 'bg-red-500 text-white'
                      }`}>
                        {totalUnread}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-4 flex gap-3 hover:bg-blue-50 transition-colors border-b border-gray-50 text-left ${
                        selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {conv.propertyImage ? (
                          <img
                            src={conv.propertyImage}
                            alt={conv.propertyTitle}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {conv.participantName.charAt(0)}
                          </div>
                        )}
                        {conv.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className={`font-semibold text-sm truncate ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                              {conv.participantName}
                            </h3>
                            {conv.propertyTitle && (
                              <p className="text-xs text-blue-600 truncate flex items-center gap-1 mt-0.5">
                                <Home className="w-3 h-3" />
                                {conv.propertyTitle}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatTime(conv.lastMessageTime)}
                            </span>
                            {conv.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm mt-1 truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${showMobileList && !selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowMobileList(true)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <div className="relative">
                        {selectedConversation.propertyImage ? (
                          <img
                            src={selectedConversation.propertyImage}
                            alt={selectedConversation.propertyTitle}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {selectedConversation.participantName.charAt(0)}
                          </div>
                        )}
                        {selectedConversation.isOnline && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.participantName}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          {selectedConversation.isOnline ? (
                            <span className="text-green-600">Online</span>
                          ) : (
                            <span>Offline</span>
                          )}
                          {selectedConversation.propertyTitle && (
                            <>
                              <span className="mx-1">•</span>
                              <span className="text-blue-600">{selectedConversation.propertyTitle}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedConversation.propertyPrice && (
                        <span className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-lg">
                          <DollarSign className="w-4 h-4" />
                          {selectedConversation.propertyPrice.toLocaleString()}
                        </span>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                    {/* Property Card */}
                    {selectedConversation.propertyTitle && (
                      <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 max-w-sm">
                          {selectedConversation.propertyImage && (
                            <img
                              src={selectedConversation.propertyImage}
                              alt={selectedConversation.propertyTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-xs text-gray-500">Conversation about:</p>
                            <p className="font-semibold text-gray-900 text-sm">{selectedConversation.propertyTitle}</p>
                            {selectedConversation.propertyPrice && (
                              <p className="text-blue-600 font-bold text-sm">${selectedConversation.propertyPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedConversation.messages.map((message, index) => {
                      const isOwn = message.senderId === userId;
                      const showAvatar = index === 0 || selectedConversation.messages[index - 1].senderId !== message.senderId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                            {!isOwn && showAvatar && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {selectedConversation.participantName.charAt(0)}
                              </div>
                            )}
                            {!isOwn && !showAvatar && <div className="w-8" />}
                            
                            <div>
                              <div
                                className={`px-4 py-2.5 rounded-2xl ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-md'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.text}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-gray-400">{formatMessageTime(message.timestamp)}</span>
                                {isOwn && (
                                  message.read ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex-1 relative flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        />
                        <button className="absolute right-3 text-gray-400 hover:text-gray-600">
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all h-[48px] flex items-center justify-center"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (

                /* Empty State */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-50/50 to-white">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <MessageCircle className="w-12 h-12 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a conversation from the list to start messaging with {userRole === 'seller' ? 'potential buyers' : 'property sellers'}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
