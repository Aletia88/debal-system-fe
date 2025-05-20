import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileQuery, useUpdateWorkMutation } from "@/store/profile";
import { Modal, Button, Select, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const WorkInfo = () => {
    const { data: profile } = useGetProfileQuery({});
    const [updateWork, { isLoading }] = useUpdateWorkMutation();
    const [modalOpened, setModalOpened] = useState(false);
    const {id} = useParams()

    const isCurrentUserProfile = id ?  profile?.user._id === id : true;

    const form = useForm({
        initialValues: {
            work_hours: '',
            works_from_home: false,
            chronotype: '',
        },
        validate: {
            work_hours: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile?.work) {
            form.setValues({
                work_hours: profile.work.work_hours || '',
                works_from_home: profile.work.works_from_home || false,
                chronotype: profile.work.chronotype || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateWork(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update work info:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Work Information
                        {profile?.work && (
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
                            <h4 className="font-medium capitalize">{profile?.work?.work_hours || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Work Hours</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.work?.chronotype || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Sleep Preference</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium">
                            {profile?.work?.works_from_home ? 'Works from home' : 'Does not work from home'}
                        </h4>
                        <p className="text-sm text-gray-500">Work Location</p>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Work Information"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Work Hours"
                        data={ ['9-5', 'flexible', 'shift-work', 'other']}
                        {...form.getInputProps('work_hours')}
                        mb="md"
                    />
                    
                    <Switch
                        label="Do you work from home?"
                        {...form.getInputProps('works_from_home', { type: 'checkbox' })}
                        mb="md"
                    />
                    
                    <Select
                        label="Chronotype (Natural sleep preference)"
                        data={['early-bird', 'night-owl', 'flexible']}
                        {...form.getInputProps('chronotype')}
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

export default WorkInfo;