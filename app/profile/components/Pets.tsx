import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileQuery, useUpdatePetsMutation } from "@/store/profile";
import { Modal, Button, Switch, Select } from '@mantine/core';
import { useForm } from '@mantine/form';

const PetsInfo = () => {
    const { data: profile } = useGetProfileQuery({});
    const [updatePets, { isLoading }] = useUpdatePetsMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const form = useForm({
        initialValues: {
            has_pets: false,
            pet_tolerance: '',
        },
        validate: {
            pet_tolerance: (value, values) => 
                !values.has_pets || value ? null : 'This field is required',
        },
    });

    useEffect(() => {
        if (profile?.pets) {
            form.setValues({
                has_pets: profile.pets.has_pets || false,
                pet_tolerance: profile.pets.pet_tolerance || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updatePets(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update pet preferences:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Pet Preferences
                        {profile?.pets && (
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
                    <div>
                        <h4 className="font-medium">
                            {profile?.pets?.has_pets ? 'Has pets' : 'No pets'}
                        </h4>
                        <p className="text-sm text-gray-500">Pet Ownership</p>
                    </div>
                    {profile?.pets?.has_pets && (
                        <div>
                            <h4 className="font-medium capitalize">{profile.pets.pet_tolerance || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Pet Tolerance</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Pet Preferences"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Switch
                        label="Do you have pets?"
                        {...form.getInputProps('has_pets', { type: 'checkbox' })}
                        mb="md"
                    />
                    
                    {form.values.has_pets && (
                        <Select
                            label="Pet Tolerance"
                            data={ ['no-pets', 'cats', 'dogs', 'both']}
                            {...form.getInputProps('pet_tolerance')}
                            mb="md"
                        />
                    )}
                    
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

export default PetsInfo;