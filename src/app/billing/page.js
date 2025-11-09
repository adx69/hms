'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { billingAPI, patientsAPI, appointmentsAPI } from '@/services/api';
import { Plus, Edit, Trash2, Receipt, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function BillingPage() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    appointment: '',
    amount: '',
    paymentStatus: 'Pending',
    items: [{ description: '', quantity: 1, price: 0 }],
  });

  useEffect(() => {
    fetchBills();
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await billingAPI.getAll();
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll();
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate patient is selected
      if (!formData.patient || formData.patient === '') {
        toast.error('Please select a patient');
        return;
      }

      // Filter out empty items and validate
      const validItems = formData.items.filter(
        (item) => item.description && item.description.trim() !== '' && item.quantity > 0 && item.price >= 0
      );

      if (validItems.length === 0) {
        toast.error('Please add at least one valid bill item');
        return;
      }

      const totalAmount = validItems.reduce(
        (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
        0
      );

      if (totalAmount <= 0) {
        toast.error('Bill amount must be greater than 0');
        return;
      }

      // Prepare bill data - convert empty strings to null/undefined for optional fields
      const billData = {
        patient: formData.patient,
        appointment: formData.appointment && formData.appointment !== '' ? formData.appointment : undefined,
        amount: totalAmount,
        items: validItems.map(item => ({
          description: item.description.trim(),
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0,
        })),
        paymentStatus: formData.paymentStatus || 'Pending',
        ...(formData.paymentStatus === 'Paid' && { paymentDate: new Date() }),
      };

      if (editingBill) {
        await billingAPI.update(editingBill._id, billData);
        toast.success('Bill updated successfully');
      } else {
        await billingAPI.create(billData);
        toast.success('Bill created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchBills();
    } catch (error) {
      console.error('Error saving bill:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error saving bill';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      patient: bill.patient?._id || '',
      appointment: bill.appointment?._id || '',
      amount: bill.amount,
      paymentStatus: bill.paymentStatus,
      items: bill.items && bill.items.length > 0 ? bill.items : [{ description: '', quantity: 1, price: 0 }],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this bill?')) {
      try {
        const response = await billingAPI.delete(id);
        console.log('Delete response:', response);
        toast.success('Bill deleted successfully');
        // Force refresh the list
        await fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error(error.response?.data?.error || error.message || 'Error deleting bill');
      }
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      const response = await billingAPI.update(id, {
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString(),
      });
      console.log('Payment response:', response);
      toast.success('Bill marked as paid (simulated)');
      // Force refresh the list
      await fetchBills();
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error(error.response?.data?.error || error.message || 'Error updating bill');
    }
  };

  const resetForm = () => {
    setFormData({
      patient: '',
      appointment: '',
      amount: '',
      paymentStatus: 'Pending',
      items: [{ description: '', quantity: 1, price: 0 }],
    });
    setEditingBill(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, items: newItems });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Partial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const totalAmount = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground">Manage patient bills and payments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBill ? 'Edit Bill' : 'Create New Bill'}</DialogTitle>
              <DialogDescription>
                {editingBill ? 'Update bill information' : 'Enter bill details'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <select
                    id="patient"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment">Appointment</Label>
                  <select
                    id="appointment"
                    value={formData.appointment}
                    onChange={(e) => setFormData({ ...formData, appointment: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map((appointment) => (
                      <option key={appointment._id} value={appointment._id}>
                        {appointment.patient?.name} - {appointment.date ? new Date(appointment.date).toLocaleDateString() : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status *</Label>
                  <select
                    id="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Bill Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-right font-bold text-lg mt-2">
                  Total: ${totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill._id}>
                  <TableCell className="font-medium">
                    {bill.patient?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${bill.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(bill.paymentStatus)}`}
                    >
                      {bill.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    {bill.createdAt
                      ? new Date(bill.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {bill.paymentStatus !== 'Paid' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkPaid(bill._id)}
                          title="Mark as Paid"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(bill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(bill._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

