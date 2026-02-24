'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useSalaryStream } from '@/hooks/use-salary-stream';
import { ArrowLeft, Send, Plus } from 'lucide-react';
import { formatAddress } from '@/lib/wallet';

const formSchema = z.object({
  employeeAddress: z.string().min(42, 'Invalid address'),
  amount: z.string().min(1, 'Amount required'),
  durationDays: z.string().min(1, 'Duration required'),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployerDashboardProps {
  address: string;
  onDisconnect: () => void;
  onBack: () => void;
}

export function EmployerDashboard({ address, onDisconnect, onBack }: EmployerDashboardProps) {
  const { createStream, isLoading, error } = useSalaryStream();
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeAddress: '',
      amount: '',
      durationDays: '30',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await createStream(
        values.employeeAddress,
        values.amount,
        parseInt(values.durationDays)
      );

      if (result?.success) {
        setActiveStreams([...activeStreams, {
          id: result.id,
          employee: values.employeeAddress,
          amount: values.amount,
          duration: parseInt(values.durationDays),
          startTime: new Date(),
          txHash: result.transactionHash,
        }]);

        setSuccessMessage(`Stream created successfully!`);
        form.reset();
        setShowForm(false);
        
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error creating stream:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-black/95 backdrop-blur">
        <div className="w-full px-4 sm:px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-4 hover:bg-[#0a0a0a]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Employer Dashboard</h1>
            <p className="text-sm text-[#cccccc]">Manage salary streams</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-mono text-[#cccccc] hidden sm:block">
              {formatAddress(address)}
            </div>
            <Button variant="outline" size="sm" onClick={onDisconnect} className="border-[#1a1a1a] hover:bg-[#0a0a0a]">
              Disconnect
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        {successMessage && (
          <div className="mb-6 p-4 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-lg">
            <p className="text-sm text-[#FFD600]">{successMessage}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Active Streams</div>
              <div className="text-3xl font-bold text-[#FFD600]">{activeStreams.length}</div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Total Streaming</div>
              <div className="text-3xl font-bold text-white">
                ${activeStreams.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="pt-6">
              <div className="text-sm text-[#cccccc] mb-1">Employees</div>
              <div className="text-3xl font-bold text-[#FFD600]">
                {new Set(activeStreams.map(s => s.employee)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            {!showForm ? (
              <Button 
                onClick={() => setShowForm(true)}
                size="lg"
                className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Stream
              </Button>
            ) : (
              <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardHeader>
                  <CardTitle className="text-lg">Create Stream</CardTitle>
                  <CardDescription className="text-[#cccccc]">Set up a new salary stream</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="employeeAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0x..." 
                                {...field}
                                className="bg-[#1a1a1a] border-[#1a1a1a] text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Amount (cUSD)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="1000" 
                                {...field}
                                className="bg-[#1a1a1a] border-[#1a1a1a] text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="durationDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="30" 
                                {...field}
                                className="bg-[#1a1a1a] border-[#1a1a1a] text-white"
                              />
                            </FormControl>
                            <FormDescription>How long to stream the salary</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="flex-1 bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-bold"
                        >
                          {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                          Create
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          className="border-[#1a1a1a] hover:bg-[#0a0a0a]"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Streams List */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Active Streams</h2>
              <p className="text-sm text-[#cccccc]">View and manage all salary streams</p>
            </div>

            {activeStreams.length === 0 ? (
              <Card className="border-[#1a1a1a] bg-[#0a0a0a]/50">
                <CardContent className="pt-12 text-center">
                  <div className="text-[#cccccc] mb-4">No streams created yet</div>
                  <p className="text-sm text-[#cccccc]">Create your first stream to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeStreams.map((stream) => (
                  <Card key={stream.id} className="border-[#1a1a1a] bg-[#0a0a0a] hover:border-[#FFD600]/30 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm text-[#cccccc]">Employee</div>
                          <div className="font-mono text-sm">{stream.employee.substring(0, 10)}...</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[#cccccc]">Monthly Amount</div>
                          <div className="text-2xl font-bold text-[#FFD600]">${stream.amount}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#cccccc]">Duration:</span>
                          <span className="ml-2 font-semibold">{stream.duration} days</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#cccccc]">Started:</span>
                          <span className="ml-2 font-semibold">{new Date(stream.startTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
