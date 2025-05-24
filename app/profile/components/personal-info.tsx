'use client'
import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProfileQuery, useUpdatePersonalInfoMutation } from "@/store/profile";
import { Modal, Button, TextInput, Select, Radio, Textarea, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const PersonalInfo = () => {
    const { data: profileD } = useGetProfileQuery({});
    const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfoMutation();
    const [modalOpened, setModalOpened] = useState(false);
    const {id} = useParams()
     const {data} = useGetProfileByIdQuery(id)
    
        const profile = id ? data : profileD
    const isCurrentUserProfile = id ?  profileD?.user._id === id : true;

    const form = useForm({
        initialValues: {
            name: '',
            age: '',
            gender: '',
            occupation: '',
            religion: '',
            relationship_status: 'single',
            bio: '',
            phone_number: '',
            social_media_links: {
                facebook: '',
                instagram: '',
                twitter: '',
                linkedin: '',
                telegram: ''
            }
        },
        validate: {
            name: (value) => (value.trim().length > 0 ? null : 'Full name is required'),
            age: (value) => (value && !isNaN(Number(value)) ? null : 'Please enter a valid age'),
            gender: (value) => (value ? null : 'This field is required'),
            phone_number: (value) => (value.trim().length > 0 ? null : 'Phone number is required'),
        },
    });

    // Update form values when profile data changes
    useEffect(() => {
        if (profile?.personalInfo) {
            form.setValues({
                name: profile.user.name || '',
                age: profile.personalInfo.age?.toString() || '',
                gender: profile.personalInfo.gender || '',
                occupation: profile.personalInfo.occupation || '',
                religion: profile.personalInfo.religion || '',
                relationship_status: profile.personalInfo.relationship_status || 'single',
                bio: profile.personalInfo.bio || '',
                phone_number: profile.personalInfo.phone_number || '',
                social_media_links: {
                    facebook: profile.personalInfo.social_media_links?.facebook || '',
                    instagram: profile.personalInfo.social_media_links?.instagram || '',
                    twitter: profile.personalInfo.social_media_links?.twitter || '',
                    linkedin: profile.personalInfo.social_media_links?.linkedin || '',
                    telegram: profile.personalInfo.social_media_links?.telegram || ''
                }
            });
        }
    }, [profile]);

    const handleSubmit = async (values: any) => {
        try {
            await updatePersonalInfo({
                name: values.name,
                age: Number(values.age),
                gender: values.gender.toLowerCase(),
                occupation: values.occupation,
                religion: values.religion.toLowerCase(),
                relationship_status: values.relationship_status,
                bio: values.bio,
                phone_number: values.phone_number,
                social_media_links: {
                    facebook: values.social_media_links.facebook,
                    instagram: values.social_media_links.instagram,
                    twitter: values.social_media_links.twitter,
                    linkedin: values.social_media_links.linkedin,
                    telegram: values.social_media_links.telegram
                }
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
                            <h4 className="font-medium">{profile?.user?.name || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Full Name</p>
                        </div>
                        <div>
                            <h4 className="font-medium">{profile?.personalInfo?.age || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Age</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium capitalize">{profile?.personalInfo?.gender || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Gender</p>
                        </div>
                        <div>
                            <h4 className="font-medium">{profile?.personalInfo?.phone_number || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Phone Number</p>
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

                    {profile?.personalInfo?.bio && (
                        <div>
                            <h4 className="font-medium">{profile.personalInfo.bio}</h4>
                            <p className="text-sm text-gray-500">Bio</p>
                        </div>
                    )}

                    {(profile?.personalInfo?.social_media_links?.facebook || 
                      profile?.personalInfo?.social_media_links?.instagram ||
                      profile?.personalInfo?.social_media_links?.twitter ||
                      profile?.personalInfo?.social_media_links?.linkedin ||
                      profile?.personalInfo?.social_media_links?.telegram) && (
                        <div>
                            <h4 className="font-medium text-gray-500 text-sm mb-1">Social Media</h4>
                            <div className="flex flex-wrap gap-2">
                                {profile.personalInfo.social_media_links?.facebook && (
                                    <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">Facebook</span>
                                )}
                                {profile.personalInfo.social_media_links?.instagram && (
                                    <span className="text-sm bg-pink-50 text-pink-600 px-2 py-1 rounded">Instagram</span>
                                )}
                                {profile.personalInfo.social_media_links?.twitter && (
                                    <span className="text-sm bg-sky-50 text-sky-600 px-2 py-1 rounded">Twitter</span>
                                )}
                                {profile.personalInfo.social_media_links?.linkedin && (
                                    <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">LinkedIn</span>
                                )}
                                {profile.personalInfo.social_media_links?.telegram && (
                                    <span className="text-sm bg-teal-50 text-teal-600 px-2 py-1 rounded">Telegram</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Personal Information"
                size="lg"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Full Name"
                        placeholder="Your full name"
                        {...form.getInputProps('name')}
                        mb="md"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <TextInput
                            label="Age"
                            type="number"
                            placeholder="Your age"
                            {...form.getInputProps('age')}
                            required
                        />
                        
                        <Select
                            label="Gender"
                            placeholder="Select gender"
                            data={['male', 'female']}
                            {...form.getInputProps('gender')}
                            required
                        />
                    </div>

                    <TextInput
                        label="Phone Number"
                        placeholder="Your phone number"
                        {...form.getInputProps('phone_number')}
                        mb="md"
                        required
                    />

                    <TextInput
                        label="Occupation"
                        placeholder="Your occupation"
                        {...form.getInputProps('occupation')}
                        mb="md"
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Select
                            label="Religion"
                            placeholder="Select religion"
                            data={['christianity', 'islam', 'hinduism', 'judaism', 'other', 'none']}
                            {...form.getInputProps('religion')}
                        />
                        
                        <Radio.Group
                            label="Relationship Status"
                            {...form.getInputProps('relationship_status')}
                        >
                            <Group mt="xs">
                                <Radio value="single" label="Single" />
                                <Radio value="in_relationship" label="In a relationship" />
                                <Radio value="married" label="Married" />
                            </Group>
                        </Radio.Group>
                    </div>

                    <Textarea
                        label="Bio"
                        placeholder="Tell us about yourself"
                        {...form.getInputProps('bio')}
                        mb="md"
                        autosize
                        minRows={3}
                    />

                    <div className="space-y-3 mb-6">
                        <h4 className="font-medium text-sm">Social Media Links</h4>
                        <TextInput
                            label="Facebook"
                            placeholder="https://facebook.com/username"
                            {...form.getInputProps('social_media_links.facebook')}
                        />
                        <TextInput
                            label="Instagram"
                            placeholder="https://instagram.com/username"
                            {...form.getInputProps('social_media_links.instagram')}
                        />
                        <TextInput
                            label="Twitter"
                            placeholder="https://twitter.com/username"
                            {...form.getInputProps('social_media_links.twitter')}
                        />
                        <TextInput
                            label="LinkedIn"
                            placeholder="https://linkedin.com/in/username"
                            {...form.getInputProps('social_media_links.linkedin')}
                        />
                        <TextInput
                            label="Telegram"
                            placeholder="@username"
                            {...form.getInputProps('social_media_links.telegram')}
                        />
                    </div>
                    
                    <Group justify="flex-end" mt="xl">
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
                    </Group>
                </form>
            </Modal>
        </>
    );
};

export default PersonalInfo;