import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileQuery, useUpdateNeighborhoodMutation } from "@/store/profile";
import { Modal, Button, Select, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const NeighborhoodInfo = () => {
    const { data: profile } = useGetProfileQuery({});
    const [updateNeighborhood, { isLoading }] = useUpdateNeighborhoodMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const {id} = useParams()

    const isCurrentUserProfile = id ?  profile?.user._id === id : true;

    const form = useForm({
        initialValues: {
            preferred_location_type: '',
            commute_tolerance_minutes: 30,
        },
        validate: {
            preferred_location_type: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile?.neighborhoodPrefs) {
            form.setValues({
                preferred_location_type: profile.neighborhoodPrefs.preferred_location_type || '',
                commute_tolerance_minutes: profile?.neighborhoodPrefs?.commute_tolerance_minutes || 30,
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateNeighborhood(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update neighborhood info:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Neighborhood Preferences
                        {profile?.neighborhoodPrefs && (
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
                            <h4 className="font-medium capitalize">{profile?.neighborhoodPrefs?.preferred_location_type || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Location Type</p>
                        </div>
                        <div>
                            <h4 className="font-medium">{profile?.neighborhoodPrefs?.commute_tolerance_minutes ? `${profile.neighborhoodPrefs.commute_tolerance_minutes} mins` : 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Max Commute Time</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Neighborhood Preferences"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Preferred Location Type"
                        data={ ['urban', 'suburban', 'rural']}
                        {...form.getInputProps('preferred_location_type')}
                        mb="md"
                    />
                    
                    <NumberInput
                        label="Commute Tolerance (minutes)"
                        min={5}
                        max={120}
                        {...form.getInputProps('commute_tolerance_minutes')}
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

export default NeighborhoodInfo;