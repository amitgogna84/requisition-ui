import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Container,
  Fab,
  Card,
  CardContent,
  Divider,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AiIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';

interface Message {
  id: string;
  content: string;
  senderType: 'user' | 'ai';
  timestamp: Date;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://requisition-backend.onrender.com';

const quickSuggestions = [
  "Show me all vendors",
  "What are the rates for React developers?",
  "Who are the available consultants?",
  "Tell me about active contracts",
  "Compare vendor services",
  "What does TechCorp Solutions offer?",
  "Show me DevOps engineers and their rates",
];

export default function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant for IT services vendor management. I can help you find information about vendors, their rates, consultants, contracts, and services. What would you like to know?",
      senderType: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      senderType: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: inputMessage,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        senderType: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        senderType: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm your AI assistant for IT services vendor management. I can help you find information about vendors, their rates, consultants, contracts, and services. What would you like to know?",
        senderType: 'ai',
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Messages */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.senderType === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
              {message.senderType === 'ai' && (
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1, mt: 0.5 }}>
                  <AiIcon />
                </Avatar>
              )}
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  backgroundColor: message.senderType === 'user' ? 'primary.main' : 'white',
                  color: message.senderType === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                  }}
                >
                  {message.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 1,
                    opacity: 0.7,
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Paper>
              {message.senderType === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, mt: 0.5 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </Box>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1, mt: 0.5 }}>
                <AiIcon />
              </Avatar>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    AI is thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightbulbIcon fontSize="small" />
            Try asking about:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickSuggestions.map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                variant="outlined"
                size="small"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input */}
      <Box sx={{ p: 2, backgroundColor: 'white', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about IT services vendors, their rates, consultants, contracts, or services..."
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <Fab
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{
                minWidth: 56,
                height: 56,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <SendIcon />
            </Fab>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 