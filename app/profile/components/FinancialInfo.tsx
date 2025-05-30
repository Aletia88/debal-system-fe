import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProfileQuery, useUpdateFinancialMutation } from "@/store/profile";
import { Modal, Button, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const FinancialInfo = () => {
    const { data: profileD } = useGetProfileQuery({});
    const [updateFinancial, { isLoading }] = useUpdateFinancialMutation();
    const [modalOpened, setModalOpened] = useState(false);
    
    const {id} = useParams()
    const {data} = useGetProfileByIdQuery(id)

    const profile = id ? data : profileD
    const isCurrentUserProfile = id ? profileD?.user._id === id : true;

    const incomeLevels = [
        'Under 30,000',
        '30,000-50,000',
        '50,000-75,000',
        '75,000-100,000',
        '100,000-150,000',
        'Over 150,000'
    ];

    const form = useForm({
        initialValues: {
            income_level: '',
            budget_range: {
                min: 2000,
                max: 3000,
            },
        },
        validate: {
            income_level: (value) => (value ? null : 'This field is required'),
            budget_range: {
                max: (value, values) => 
                    value >= values.budget_range.min ? null : 'Max budget must be greater than min',
            },
        },
    });

    useEffect(() => {
        if (profile?.financial) {
            form.setValues({
                income_level: profile.financial.income_level || '',
                budget_range: {
                    min: profile.financial.budget_range?.min || 2000,
                    max: profile.financial.budget_range?.max || 3000,
                },
            });
        }
    }, [profile]);

    const handleSubmit = async (values: any) => {
        try {
            await updateFinancial({
                income_level: values.income_level,
                budget_range: {
                    min: values.budget_range.min,
                    max: values.budget_range.max,
                }
            }).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update financial info:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Financial Information
                        {profile?.financial && (
                            <span className="ml-2 text-green-500">
                                <Check size={16} />
                            </span>
                        )}
                    </h3>
                    {isCurrentUserProfile && (
                        <button 
                            className="text-purple-600 hover:text-purple-800"
                            onClick={() => setModalOpened(true)}
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium">{profile?.financial?.income_level || 'Not specified'}</h4>
                        <p className="text-sm text-gray-500">Income Level</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium">BIRR {profile?.financial?.budget_range?.min?.toLocaleString() || '0'}</h4>
                            <p className="text-sm text-gray-500">Min Budget</p>
                        </div>
                        <div>
                            <h4 className="font-medium">BIRR {profile?.financial?.budget_range?.max?.toLocaleString() || '0'}</h4>
                            <p className="text-sm text-gray-500">Max Budget</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Financial Information"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Income Level"
                        data={incomeLevels}
                        {...form.getInputProps('income_level')}
                        mb="md"
                    />
                    
                    <NumberInput
                        label="Minimum Budget"
                        min={500}
                        max={5000}
                        {...form.getInputProps('budget_range.min')}
                        mb="sm"
                    />
                    
                    <NumberInput
                        label="Maximum Budget"
                        min={500}
                        max={5000}
                        {...form.getInputProps('budget_range.max')}
                        mb="md"
                    />
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="default" onClick={() => setModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isLoading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default FinancialInfo;