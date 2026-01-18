'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MUIDataGrid from '@/components/MUIDataGrid';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { vehicleTypesAPI } from '@/services/api';
import { toast } from 'sonner';

interface VehicleType {
  id: number;
  documentId: string;
  name: string;
  group?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vehicle type name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
});

export default function VehicleTypesMUIPage() {
  const [data, setData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VehicleType | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vehicleTypesAPI.find();
      const vehicleTypesData = response.data || [];
      setData(vehicleTypesData);
    } catch (error) {
      console.error('Failed to fetch vehicle types:', error);
      toast.error('Failed to load vehicle types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id: string | number) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      setEditingItem(item);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: string | number) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;

    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        await vehicleTypesAPI.delete(item.documentId);
        setData(data.filter((d) => d.id !== id));
        setNotification({
          open: true,
          message: 'Vehicle type deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Failed to delete vehicle type:', error);
        setNotification({
          open: true,
          message: 'Failed to delete vehicle type',
          severity: 'error',
        });
      }
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editingItem) {
        // Edit existing item
        const response = await vehicleTypesAPI.update(
          editingItem.documentId,
          values
        );
        setData(
          data.map((item) => (item.id === editingItem.id ? response : item))
        );
        setNotification({
          open: true,
          message: 'Vehicle type updated successfully',
          severity: 'success',
        });
      } else {
        // Add new item
        const response = await vehicleTypesAPI.create(values);
        setData([...data, response]);
        setNotification({
          open: true,
          message: 'Vehicle type created successfully',
          severity: 'success',
        });
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save vehicle type:', error);
      setNotification({
        open: true,
        message: 'Failed to save vehicle type',
        severity: 'error',
      });
    }
  };

  const getColumns = () => {
    // Extract unique column names from the data
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (key) => key !== 'documentId' && key !== 'publishedAt' && key !== 'group'
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Box className="space-y-6">
          {/* Header */}
          <Box className="bg-card p-6 rounded-lg shadow-sm border">
            <Typography variant="h4" gutterBottom>
              Vehicle Types Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all vehicle types and models in your inventory
            </Typography>
          </Box>

          {/* MUI Data Grid */}
          <MUIDataGrid
            data={data}
            columns={getColumns()}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            loading={loading}
            title="Vehicle Types"
            entityName="Vehicle Type"
            addButtonLabel="Add Vehicle Type"
          />

          {/* Add/Edit Dialog */}
          <Dialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              className: 'rounded-lg',
            }}
          >
            <DialogTitle>
              {editingItem ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
            </DialogTitle>
            <Formik
              initialValues={{
                name: editingItem?.name || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, handleChange, values }) => (
                <Form>
                  <DialogContent>
                    <Box className="space-y-4">
                      <Field
                        as={TextField}
                        fullWidth
                        id="name"
                        name="name"
                        label="Vehicle Type Name"
                        placeholder="e.g., TERIOS R AT"
                        variant="outlined"
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions className="p-6">
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                      {editingItem ? 'Update' : 'Save'}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Dialog>

          {/* Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={() => setNotification({ ...notification, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              variant="filled"
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </DashboardLayout>
    </ProtectedRoute>
  );
}