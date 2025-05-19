'use client'
import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileQuery, useUpdatePersonalInfoMutation } from "@/store/profile";
import { Modal, Button, TextInput, Select, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';

const PersonalInfo = () => {
    const { data: profile } = useGetProfileQuery({});
    const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfoMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const form = useForm({
        initialValues: {
            age: profile?.personalInfo?.age?.toString() || '',
            gender: profile?.personalInfo?.gender || '',
            occupation: profile?.personalInfo?.occupation || '',
            religion: profile?.personalInfo?.religion || '',
            relationship_status: profile?.personalInfo?.relationship_status || 'single',
        },
        validate: {
            age: (value) => (value && !isNaN(Number(value)) ? null : 'Please enter a valid age'),
            gender: (value) => (value ? null : 'This field is required'),
        },
    });

    // Update form values when profile data changes
    useEffect(() => {
        if (profile?.personalInfo) {
            form.setValues({
                age: profile.personalInfo.age?.toString() || '',
                gender: profile.personalInfo.gender || '',
                occupation: profile.personalInfo.occupation || '',
                religion: profile.personalInfo.religion || '',
                relationship_status: profile.personalInfo.relationship_status || 'single',
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updatePersonalInfo({
                age: Number(values.age),
                gender: values.gender,
                occupation: values.occupation,
                religion: values.religion,
                relationship_status: values.relationship_status,
            }).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update personal info:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Personal Information
                        {profile?.personalInfo && (
                            <span className="ml-2 text-green-500">
                                <Check size={16} />
                            </span>
                        )}
                    </h3>
                    <button 
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => setModalOpened(true)}
                    >
                        <Pencil size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium">{profile?.personalInfo?.age || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Age</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.personalInfo?.gender || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Gender</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium capitalize">{profile?.personalInfo?.relationship_status || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Relationship Status</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.personalInfo?.religion || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Religion</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium">{profile?.personalInfo?.occupation || 'Not specified'}</h4>
                        <p className="text-sm text-gray-500">Occupation</p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Personal Information"
                size="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Age"
                        type="number"
                        {...form.getInputProps('age')}
                        mb="md"
                    />
                    
                    <Select
                        label="Gender"
                        data={['male', 'female']}
                        {...form.getInputProps('gender')}
                        mb="md"
                    />
                    
                    <TextInput
                        label="Occupation"
                        {...form.getInputProps('occupation')}
                        mb="md"
                    />
                    
                    <Select
                        label="Religion"
                        data={['christianity', 'islam', 'hinduism', 'judaism', 'other', 'none']}
                        {...form.getInputProps('religion')}
                        mb="md"
                    />
                    
                    <Radio.Group
                        label="Relationship Status"
                        {...form.getInputProps('relationship_status')}
                        mb="md"
                    >
                        <div className="flex flex-col space-y-2 mt-2">
                            <Radio value="single" label="Single" />
                            <Radio value="in_relationship" label="In a relationship" />
                            <Radio value="married" label="Married" />
                        </div>
                    </Radio.Group>
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button 
                            variant="default" 
                            onClick={() => setModalOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            loading={isLoading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default PersonalInfo;