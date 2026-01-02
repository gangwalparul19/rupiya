'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import { houseHelpService, houseHelpPaymentService, expenseService } from '@/lib/firebaseService';
import FormModal from '@/components/FormModal';
import FormField from '@/components/FormField';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormActions from '@/components/FormActions';

export default function HouseHelpPage() {
    const { user, houseHelps, houseHelpPayments, addHouseHelp, removeHouseHelp, addHouseHelpPayment, addExpense } = useAppStore();
    const { success, error } = useToast();
    const [showAddHelpModal, setShowAddHelpModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedHelpId, setSelectedHelpId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [helpFormData, setHelpFormData] = useState({
        name: '',
        type: 'Maid',
        mobile: '',
        monthlyWage: '',
        startDate: new Date().toISOString().split('T')[0],
    });

    const [paymentFormData, setPaymentFormData] = useState({
        amount: '',
        type: 'advance' as 'advance' | 'salary',
        notes: '',
        date: new Date().toISOString().split('T')[0],
    });

    const filteredHelp = useMemo(() => {
        return houseHelps.filter(h =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [houseHelps, searchTerm]);

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyPayments = houseHelpPayments.filter(p => {
            const pDate = new Date(p.date);
            return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
        });

        const totalPaidThisMonth = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalMonthlyWage = houseHelps.filter(h => h.status === 'active').reduce((sum, h) => sum + h.monthlyWage, 0);

        return {
            totalPaidThisMonth,
            totalMonthlyWage,
            activeStaff: houseHelps.filter(h => h.status === 'active').length,
        };
    }, [houseHelps, houseHelpPayments]);

    const handleAddHelp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const wage = parseFloat(helpFormData.monthlyWage);
            if (isNaN(wage) || wage <= 0) {
                error('Please enter a valid monthly wage');
                setIsSubmitting(false);
                return;
            }

            if (!user) return;

            const helpId = await houseHelpService.create({
                id: `help_${Date.now()}`,
                name: helpFormData.name,
                type: helpFormData.type,
                mobile: helpFormData.mobile,
                monthlyWage: wage,
                startDate: new Date(helpFormData.startDate),
                status: 'active',
                createdAt: new Date(),
            }, user.uid);

            addHouseHelp({
                id: helpId,
                name: helpFormData.name,
                type: helpFormData.type,
                mobile: helpFormData.mobile,
                monthlyWage: wage,
                startDate: new Date(helpFormData.startDate),
                status: 'active',
                createdAt: new Date(),
            });

            success('House help added successfully');
            setShowAddHelpModal(false);
            setHelpFormData({
                name: '',
                type: 'Maid',
                mobile: '',
                monthlyWage: '',
                startDate: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            error('Failed to add house help');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedHelpId) return;
        setIsSubmitting(true);

        try {
            const amount = parseFloat(paymentFormData.amount);
            if (isNaN(amount) || amount <= 0) {
                error('Please enter a valid amount');
                setIsSubmitting(false);
                return;
            }

            if (!user) return;

            const help = houseHelps.find(h => h.id === selectedHelpId);
            if (!help) return;

            const paymentDate = new Date(paymentFormData.date);

            // 1. Add to House Help payments (Firebase)
            const paymentId = await houseHelpPaymentService.create({
                id: `pay_${Date.now()}`,
                helpId: selectedHelpId,
                amount,
                type: paymentFormData.type,
                date: paymentDate,
                notes: paymentFormData.notes,
                createdAt: new Date(),
            }, user.uid);

            // Add to local store
            addHouseHelpPayment({
                id: paymentId,
                helpId: selectedHelpId,
                amount,
                type: paymentFormData.type,
                date: paymentDate,
                notes: paymentFormData.notes,
                createdAt: new Date(),
            });

            // 2. Add to main Expenses (Firebase)
            const expenseId = await expenseService.create({
                id: `exp_help_${Date.now()}`,
                amount,
                description: `${paymentFormData.type === 'advance' ? 'Advance' : 'Salary'} - ${help.name} (${help.type})`,
                category: 'House Help',
                date: paymentDate,
                paymentMethod: 'cash',
                notes: paymentFormData.notes,
            } as any, user.uid);

            // Add to main store
            addExpense({
                id: expenseId,
                amount,
                description: `${paymentFormData.type === 'advance' ? 'Advance' : 'Salary'} - ${help.name} (${help.type})`,
                category: 'House Help',
                date: paymentDate,
                paymentMethod: 'cash',
                notes: paymentFormData.notes,
            } as any);

            success(`${paymentFormData.type === 'advance' ? 'Advance' : 'Salary'} recorded successfully`);
            setShowPaymentModal(false);
            setPaymentFormData({
                amount: '',
                type: 'advance',
                notes: '',
                date: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            error('Failed to record payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteHelp = async (id: string) => {
        if (confirm('Are you sure you want to remove this house help?')) {
            if (!user) return;
            try {
                await houseHelpService.delete(user.uid, id);
                removeHouseHelp(id);
                success('House help removed');
            } catch (err) {
                error('Failed to remove house help from database');
            }
        }
    };

    return (
        <PageWrapper>
            <div className="py-4 sm:py-6 md:py-8">
                {/* Header */}
                <div className="mb-block">
                    <h1 className="heading-page">🧹 House Help</h1>
                    <p className="text-secondary">Manage staff, track monthly wages and mid-month advances</p>
                </div>

                {/* KPI Stats */}
                <div className="grid grid-cols-3 gap-2 mb-section">
                    <div className="kpi-card !p-2 border-blue-500/20 bg-blue-500/5 min-h-0">
                        <p className="kpi-label !text-[10px] text-blue-400 !mb-1 truncate">Budget</p>
                        <p className="kpi-value !text-sm text-white">₹{(stats.totalMonthlyWage / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="kpi-card !p-2 border-green-500/20 bg-green-500/5 min-h-0">
                        <p className="kpi-label !text-[10px] text-green-400 !mb-1 truncate">Paid</p>
                        <p className="kpi-value !text-sm text-white">₹{(stats.totalPaidThisMonth / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="kpi-card !p-2 border-purple-500/20 bg-purple-500/5 min-h-0">
                        <p className="kpi-label !text-[10px] text-purple-400 !mb-1 truncate">Staff</p>
                        <p className="kpi-value !text-sm text-white">{stats.activeStaff}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-block flex-wrap">
                    <button
                        onClick={() => {
                            setShowAddHelpModal(!showAddHelpModal);
                            setShowPaymentModal(false);
                        }}
                        className={`btn ${showAddHelpModal ? 'btn-secondary' : 'btn-primary'} px-8 shadow-lg shadow-blue-500/20`}
                    >
                        {showAddHelpModal ? '✕ Close Form' : '+ Add New Help'}
                    </button>
                </div>

                {/* Add Help Inline Form */}
                {showAddHelpModal && (
                    <FormModal
                        isOpen={showAddHelpModal}
                        title="Add House Help"
                        onClose={() => setShowAddHelpModal(false)}
                        maxWidth="lg"
                    >
                        <form onSubmit={handleAddHelp} className="space-y-4">
                            <FormField label="Full Name" required>
                                <FormInput
                                    type="text"
                                    placeholder="e.g., Mina Devi"
                                    value={helpFormData.name}
                                    onChange={e => setHelpFormData({ ...helpFormData, name: e.target.value })}
                                    required
                                />
                            </FormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Category" required>
                                    <FormSelect
                                        value={helpFormData.type}
                                        onChange={e => setHelpFormData({ ...helpFormData, type: e.target.value })}
                                    >
                                        <option value="Maid">Maid</option>
                                        <option value="Cook">Cook</option>
                                        <option value="Cleaner">Cleaner</option>
                                        <option value="Car Wash">Car Wash</option>
                                        <option value="Driver">Driver</option>
                                        <option value="Gardener">Gardener</option>
                                        <option value="Security">Security</option>
                                        <option value="Other">Other</option>
                                    </FormSelect>
                                </FormField>

                                <FormField label="Monthly Wage" required>
                                    <FormInput
                                        type="number"
                                        placeholder="e.g., 5000"
                                        value={helpFormData.monthlyWage}
                                        onChange={e => setHelpFormData({ ...helpFormData, monthlyWage: e.target.value })}
                                        required
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Mobile Number">
                                    <FormInput
                                        type="tel"
                                        placeholder="e.g., +91 91234 56789"
                                        value={helpFormData.mobile}
                                        onChange={e => setHelpFormData({ ...helpFormData, mobile: e.target.value })}
                                    />
                                </FormField>

                                <FormField label="Start Date" required>
                                    <FormInput
                                        type="date"
                                        value={helpFormData.startDate}
                                        onChange={e => setHelpFormData({ ...helpFormData, startDate: e.target.value })}
                                        required
                                    />
                                </FormField>
                            </div>

                            <FormActions
                                onSubmit={() => {}}
                                onCancel={() => setShowAddHelpModal(false)}
                                submitLabel="Register Help"
                                cancelLabel="Cancel"
                                isLoading={isSubmitting}
                            />
                        </form>
                    </FormModal>
                )}

                {/* Payment Inline Form */}
                {showPaymentModal && selectedHelpId && (
                    <FormModal
                        isOpen={showPaymentModal}
                        title="Record Payment"
                        subtitle={`For ${houseHelps.find(h => h.id === selectedHelpId)?.name}`}
                        onClose={() => setShowPaymentModal(false)}
                        maxWidth="lg"
                    >
                        <form onSubmit={handleAddPayment} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Payment Type" required>
                                    <FormSelect
                                        value={paymentFormData.type}
                                        onChange={e => setPaymentFormData({ ...paymentFormData, type: e.target.value as any })}
                                    >
                                        <option value="advance">Advance</option>
                                        <option value="salary">Full Salary</option>
                                    </FormSelect>
                                </FormField>

                                <FormField label="Amount" required>
                                    <FormInput
                                        type="number"
                                        placeholder="0.00"
                                        value={paymentFormData.amount}
                                        onChange={e => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                                        required
                                    />
                                </FormField>
                            </div>

                            <FormField label="Date" required>
                                <FormInput
                                    type="date"
                                    value={paymentFormData.date}
                                    onChange={e => setPaymentFormData({ ...paymentFormData, date: e.target.value })}
                                    required
                                />
                            </FormField>

                            <FormField label="Notes (Optional)">
                                <FormInput
                                    type="text"
                                    placeholder="e.g., Requested for family emergency"
                                    value={paymentFormData.notes}
                                    onChange={e => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                                />
                            </FormField>

                            <FormActions
                                onSubmit={() => {}}
                                onCancel={() => setShowPaymentModal(false)}
                                submitLabel="Confirm Payment"
                                cancelLabel="Cancel"
                                isLoading={isSubmitting}
                            />
                        </form>
                    </FormModal>
                )}

                {/* Search */}
                <div className="mb-block">
                    <input
                        type="text"
                        placeholder="Search by name or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input max-w-md"
                    />
                </div>

                {/* Staff Cards */}
                {/* Staff Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-block">
                    {filteredHelp.map((help) => {
                        const currentMonthPayments = houseHelpPayments.filter(p => {
                            const pDate = new Date(p.date);
                            const now = new Date();
                            return p.helpId === help.id && pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
                        });
                        const paidThisMonth = currentMonthPayments.reduce((sum, p) => sum + p.amount, 0);

                        return (
                            <div key={help.id} className="card !p-2 group hover:scale-[1.02] transition-all duration-300 border-slate-800 hover:border-blue-500/30">
                                <div className="mb-2">
                                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate">{help.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">{help.type}</p>
                                </div>

                                <div className="mb-2">
                                    <p className="text-xs font-bold text-white text-right">₹{help.monthlyWage >= 1000 ? `${(help.monthlyWage / 1000).toFixed(1)}k` : help.monthlyWage}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-slate-800/50 rounded-lg p-1.5 border border-slate-700/50 text-center">
                                        <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden mb-1">
                                            <div
                                                className={`h-full transition-all duration-1000 ${paidThisMonth >= help.monthlyWage ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${Math.min((paidThisMonth / help.monthlyWage) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[8px] font-bold text-white">₹{paidThisMonth / 1000}k</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedHelpId(help.id);
                                                setShowPaymentModal(true);
                                            }}
                                            className="btn btn-secondary !p-1 text-[10px] h-7 flex items-center justify-center gap-1 border-blue-500/20 hover:border-blue-500/50 text-blue-400"
                                        >
                                            💳 Pay
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHelp(help.id)}
                                            className="btn btn-secondary !p-1 text-[10px] h-7 flex items-center justify-center gap-1 border-red-500/20 hover:border-red-500/50 text-red-400"
                                        >
                                            🗑️ Del
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredHelp.length === 0 && (
                    <div className="card text-center py-20 bg-slate-900/40 border-dashed border-2 border-slate-800">
                        <div className="text-5xl mb-4 opacity-50">🧹</div>
                        <h3 className="text-xl font-bold text-white mb-2">No house help tracked yet</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8">Add your first staff member to start tracking wages and advances.</p>
                        <button
                            onClick={() => setShowAddHelpModal(true)}
                            className="btn btn-primary px-10"
                        >
                            + Add First Staff
                        </button>
                    </div>
                )}
            </div>

        </PageWrapper>
    );
}
