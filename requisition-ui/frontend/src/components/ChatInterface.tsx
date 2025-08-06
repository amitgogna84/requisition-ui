import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
  id: number;
  content: string;
  senderType: 'user' | 'vendor';
  createdAt: string;
  vendor?: {
    name: string;
    company: string;
  };
}

interface Conversation {
  id: number;
  title: string;
  vendor: {
    name: string;
    company: string;
  };
  messages: Message[];
  updatedAt: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  company: string;
  skills: string[];
  rating: number;
}

export default function ChatInterface() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    company: '',
    skills: [] as string[],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('conversationHistory', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userTyping', (data: { isTyping: boolean; senderType: string }) => {
      setIsTyping(data.isTyping);
    });

    setSocket(newSocket);

    // Load initial data
    loadConversations();
    loadVendors();

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chat/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadVendors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/chat/vendors');
      setVendors(response.data);
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const joinConversation = (conversation: Conversation) => {
    if (socket && conversation.id) {
      socket.emit('joinConversation', { conversationId: conversation.id });
      setSelectedConversation(conversation);
    }
  };

  const sendMessage = () => {
    if (socket && selectedConversation && newMessage.trim()) {
      socket.emit('sendMessage', {
        conversationId: selectedConversation.id,
        content: newMessage,
        senderType: 'user',
      });
      setNewMessage('');
    }
  };

  const createNewConversation = async (vendorId: number) => {
    try {
      const vendor = vendors.find(v => v.id === vendorId);
      const response = await axios.post('http://localhost:3000/chat/conversations', {
        title: `Chat with ${vendor?.name}`,
        vendorId,
        type: 'general',
      });
      
      const newConversation = response.data;
      setConversations(prev => [newConversation, ...prev]);
      joinConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const createVendor = async () => {
    try {
      await axios.post('http://localhost:3000/chat/vendors', newVendor);
      setShowVendorModal(false);
      setNewVendor({ name: '', email: '', company: '', skills: [] });
      loadVendors();
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Vendor Chat</h2>
          <button
            onClick={() => setShowVendorModal(true)}
            className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Vendor
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Conversations</h3>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => joinConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-800">{conversation.vendor.name}</div>
                <div className="text-sm text-gray-500">{conversation.vendor.company}</div>
                {conversation.messages[0] && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {conversation.messages[0].content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vendors List */}
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Available Vendors</h3>
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => createNewConversation(vendor.id)}
                className="p-3 rounded-lg cursor-pointer mb-2 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-800">{vendor.name}</div>
                <div className="text-sm text-gray-500">{vendor.company}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Skills: {vendor.skills.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedConversation.vendor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedConversation.vendor.company}</p>
                </div>
                <div className="text-sm text-gray-400">
                  {isTyping && 'Vendor is typing...'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Welcome to Vendor Chat</h3>
              <p className="text-gray-500">Select a conversation or start a new one with a vendor</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Vendor</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vendor Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Company"
                value={newVendor.company}
                onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={newVendor.skills.join(', ')}
                onChange={(e) => setNewVendor({ 
                  ...newVendor, 
                  skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={createVendor}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Vendor
              </button>
              <button
                onClick={() => setShowVendorModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 