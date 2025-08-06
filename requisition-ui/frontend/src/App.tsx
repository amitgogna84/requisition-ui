import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Fab,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import AiChatInterface from "./components/AiChatInterface";
import VendorDashboard from "./components/VendorDashboard";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation Header */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              IT Services Vendor Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<ChatIcon />}
                onClick={() => setActiveView('chat')}
                variant={activeView === 'chat' ? 'contained' : 'text'}
                sx={{
                  backgroundColor: activeView === 'chat' ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                AI Chat
              </Button>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => setActiveView('dashboard')}
                variant={activeView === 'dashboard' ? 'contained' : 'text'}
                sx={{
                  backgroundColor: activeView === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                Dashboard
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {activeView === 'chat' ? <AiChatInterface /> : <VendorDashboard />}
        </Box>

        {/* Floating Action Button for Quick Navigation */}
        <Fab
          color="primary"
          aria-label="switch view"
          onClick={() => setActiveView(activeView === 'chat' ? 'dashboard' : 'chat')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          {activeView === 'chat' ? <DashboardIcon /> : <ChatIcon />}
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;