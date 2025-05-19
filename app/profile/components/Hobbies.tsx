import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileQuery, useUpdateHobbiesMutation } from "@/store/profile";
import { Modal, Button, MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';

const HobbiesInfo = () => {
    const { data: profile } = useGetProfileQuery({});
    const [updateHobbies, { isLoading }] = useUpdateHobbiesMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const hobbiesOptions = ['reading', 'sports', 'travelling', 'music', 'movies', 'gaming', 'cooking', 'art','board games'];

    const form = useForm({
        initialValues: {
            hobbies: [],
        },
        validate: {
            hobbies: (value) => (value.length > 0 ? null : 'Select at least one hobby'),
        },
    });

    useEffect(() => {
        if (profile?.hobbies) {
            form.setValues({
                hobbies: profile.hobbies || [],
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateHobbies(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update hobbies:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Hobbies & Interests
                        {profile?.hobbies?.length > 0 && (
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

                <div className="space-y-2">
                    {profile?.hobbies?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.hobbies.map((hobby: any, index:any) => (
                                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hobbies specified</p>
                    )}
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Hobbies & Interests"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <MultiSelect
                        label="Hobbies"
                        data={hobbiesOptions}
                        {...form.getInputProps('hobbies')}
                        mb="md"
                        searchable
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

export default HobbiesInfo;