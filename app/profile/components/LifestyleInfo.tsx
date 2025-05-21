import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProfileQuery, useUpdateLifestyleMutation } from "@/store/profile";
import { Modal, Button, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const LifestyleInfo = () => {
    const { data: profileD } = useGetProfileQuery({});
    const [updateLifestyle, { isLoading }] = useUpdateLifestyleMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const {id} = useParams()
     const {data} = useGetProfileByIdQuery(id)
        
            const profile = id ? data : profileD

    const isCurrentUserProfile = id ?  profileD?.user._id === id : true;

    const form = useForm({
        initialValues: {
            personality_type: '',
            daily_routine: '',
            sleep_pattern: '',
        },
        validate: {
            personality_type: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile?.lifestyle) {
            form.setValues({
                personality_type: profile.lifestyle.personality_type || '',
                daily_routine: profile.lifestyle.daily_routine || '',
                sleep_pattern: profile.lifestyle.sleep_pattern || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateLifestyle(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update lifestyle info:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Lifestyle Information
                        {profile?.lifestyle && (
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium capitalize">{profile?.lifestyle?.personality_type || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Personality Type</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.lifestyle?.sleep_pattern || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Sleep Pattern</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium">{profile?.lifestyle?.daily_routine ? 'View Routine' : 'Not specified'}</h4>
                        <p className="text-sm text-gray-500">Daily Routine</p>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Lifestyle Information"
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Personality Type"
                        data={['Introvert', 'Extrovert', 'Ambivert']}
                        {...form.getInputProps('personality_type')}
                        mb="md"
                    />
                    
                    <Textarea
                        label="Daily Routine"
                        description="Describe your typical daily routine"
                        {...form.getInputProps('daily_routine')}
                        mb="md"
                    />
                    
                    <Select
                        label="Sleep Pattern"
                        data={['Early bird', 'Night owl', 'Flexible']}
                        {...form.getInputProps('sleep_pattern')}
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

export default LifestyleInfo;