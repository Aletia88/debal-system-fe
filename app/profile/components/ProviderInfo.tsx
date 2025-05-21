import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProviderProfileByIdQuery, useGetProviderProfileQuery, useUpdateProviderInfoMutation } from "@/store/profile";
import { Modal, Button, Select, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const ProfileInfo = () => {
    const { data: profileD } = useGetProviderProfileQuery({});
    const [updateProfile, { isLoading }] = useUpdateProviderInfoMutation();
    const [modalOpened, setModalOpened] = useState(false);
    const { id } = useParams()
     const {data} = useGetProviderProfileByIdQuery(id)
        
            const profile = id ? data : profileD

    const isCurrentUserProfile = id ? profileD?.user._id === id : true;

    const form = useForm({
        initialValues: {
            companyName: '',
            licenseNumber: '',
            contactPhone: '',
        },
        validate: {
            companyName: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile) {
            form.setValues({
                companyName: profile.companyName || '',
                licenseNumber: profile.licenseNumber || '',
                contactPhone: profile.contactPhone || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (values: any) => {
        try {
            await updateProfile(values).unwrap();
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
                        Company Information
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
                            <h4 className="font-medium capitalize">{profileD?.companyName || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Company Name</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.contactPhone || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Contact Phone Number</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium">
                            {profile?.licenseNumber ? 'Profiles from home' : 'Does no from home'}
                        </h4>
                        <p className="text-sm text-gray-500">License Number</p>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Profile Information"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Company Name"
                        placeholder="Your company name"
                        {...form.getInputProps('companyName')}
                        mb="md"
                        required
                    />
                    <TextInput
                        label="License Number"
                        placeholder="Your license number"
                        {...form.getInputProps('licenseNumber')}
                        mb="md"
                        required
                    />
                    <TextInput
                        label="Contact Phone"
                        placeholder="Your contact phone"
                        {...form.getInputProps('contactPhone')}
                        mb="md"
                        required
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

export default ProfileInfo;