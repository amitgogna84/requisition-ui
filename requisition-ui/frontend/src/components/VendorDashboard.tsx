import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as ContractIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface VendorStats {
  totalVendors: number;
  totalConsultants: number;
  totalContracts: number;
  totalServices: number;
  averageRating: number;
  totalContractValue: number;
}

interface TopVendor {
  id: number;
  name: string;
  company: string;
  rating: number;
  skills: string[];
  contractValue: number;
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch vendors data
      const vendorsResponse = await axios.get(`${API_BASE_URL}/chat/vendors`);
      const vendors = vendorsResponse.data;

      // Calculate stats
      const totalVendors = vendors.length;
      const totalConsultants = vendors.reduce((acc: number, vendor: any) => 
        acc + (vendor.consultants?.length || 0), 0);
      const totalContracts = vendors.reduce((acc: number, vendor: any) => 
        acc + (vendor.contracts?.length || 0), 0);
      const totalServices = vendors.reduce((acc: number, vendor: any) => 
        acc + (vendor.services?.length || 0), 0);
      const averageRating = vendors.reduce((acc: number, vendor: any) => 
        acc + vendor.rating, 0) / totalVendors;
      const totalContractValue = vendors.reduce((acc: number, vendor: any) => 
        acc + (vendor.contracts?.reduce((sum: number, contract: any) => 
          sum + contract.value, 0) || 0), 0);

      setStats({
        totalVendors,
        totalConsultants,
        totalContracts,
        totalServices,
        averageRating,
        totalContractValue,
      });

      // Get top vendors by rating
      const sortedVendors = vendors
        .sort((a: any, b: any) => b.rating - a.rating)
        .slice(0, 3)
        .map((vendor: any) => ({
          id: vendor.id,
          name: vendor.name,
          company: vendor.company,
          rating: vendor.rating,
          skills: vendor.skills,
          contractValue: vendor.contracts?.reduce((sum: number, contract: any) => 
            sum + contract.value, 0) || 0,
        }));

      setTopVendors(sortedVendors);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Vendor Management Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Vendors
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {stats?.totalVendors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Consultants
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {stats?.totalConsultants}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ContractIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Active Contracts
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                {stats?.totalContracts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Contract Value
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                ${(stats?.totalContractValue / 1000).toFixed(0)}k
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Vendors */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                Top Rated Vendors
              </Typography>
              <List>
                {topVendors.map((vendor, index) => (
                  <React.Fragment key={vendor.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: index === 0 ? 'warning.main' : 'grey.300' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={vendor.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {vendor.company}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                              <Typography variant="body2">
                                {vendor.rating.toFixed(1)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Typography variant="body2" color="text.secondary">
                          ${(vendor.contractValue / 1000).toFixed(0)}k
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Contract Value
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < topVendors.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingIcon sx={{ mr: 1, color: 'success.main' }} />
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 600, mr: 2 }}>
                  {stats?.averageRating.toFixed(1)}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      sx={{
                        color: star <= Math.round(stats?.averageRating || 0) ? 'warning.main' : 'grey.300',
                        fontSize: 24,
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Overall vendor rating across all services
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 