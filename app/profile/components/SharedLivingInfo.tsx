import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProfileQuery, useUpdateSharedLivingMutation } from "@/store/profile";
import { Modal, Button, Select, Radio, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const SharedLivingInfo = () => {
    const { data: profileD } = useGetProfileQuery({});
    const [updateSharedLiving, { isLoading }] = useUpdateSharedLivingMutation();
    const [modalOpened, setModalOpened] = useState(false);
    const {id} = useParams()
     const {data} = useGetProfileByIdQuery(id)
        
            const profile = id ? data : profileD

    

    const isCurrentUserProfile = id ?  profileD?.user._id === id : true;

    const form = useForm({
        initialValues: {
            cleanliness_level: '',
            chore_sharing_preference: 'separate',
            noise_tolerance: 'average',
            guest_frequency: 'rarely',
            party_habits: 'rarely',
        },
        validate: {
            cleanliness_level: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile?.sharedLiving) {
            form.setValues({
                cleanliness_level: profile.sharedLiving.cleanliness_level || '',
                chore_sharing_preference: profile.sharedLiving.chore_sharing_preference || 'separate',
                noise_tolerance: profile.sharedLiving.noise_tolerance || 'average',
                guest_frequency: profile.sharedLiving.guest_frequency || 'rarely',
                party_habits: profile.sharedLiving.party_habits || 'rarely',
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateSharedLiving(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update shared living preferences:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Shared Living Preferences
                        {profile?.sharedLiving && (
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
                            <h4 className="font-medium capitalize">{profile?.sharedLiving?.cleanliness_level || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Cleanliness Level</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.sharedLiving?.noise_tolerance || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Noise Tolerance</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium capitalize">{profile?.sharedLiving?.chore_sharing_preference || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Chore Sharing</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.sharedLiving?.guest_frequency || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Guest Frequency</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium capitalize">{profile?.sharedLiving?.party_habits || 'Not specified'}</h4>
                        <p className="text-sm text-gray-500">Party Habits</p>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Shared Living Preferences"
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Cleanliness Level"
                        data={['very-clean', 'clean', 'average', 'messy']}
                        {...form.getInputProps('cleanliness_level')}
                        mb="md"
                    />
                    
                    <Radio.Group
                        label="Chore Sharing Preference"
                        {...form.getInputProps('chore_sharing_preference')}
                        mb="md"
                    >
                        <Group mt="xs">
                            <Radio value="shared" label="Shared equally" />
                            <Radio value="separate" label="Separate responsibilities" />
                            <Radio value="flexible" label="Flexible" />
                        </Group>
                    </Radio.Group>
                    
                    <Select
                        label="Noise Tolerance"
                        data={ ['quiet', 'average', 'noisy']}
                        {...form.getInputProps('noise_tolerance')}
                        mb="md"
                    />
                    
                    <Select
                        label="Guest Frequency"
                        data={ ['never', 'rarely', 'sometimes', 'often']}
                        {...form.getInputProps('guest_frequency')}
                        mb="md"
                    />
                    
                    <Select
                        label="Party Habits"
                        data={ ['never', 'rarely', 'sometimes', 'often']}
                        {...form.getInputProps('party_habits')}
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

export default SharedLivingInfo;