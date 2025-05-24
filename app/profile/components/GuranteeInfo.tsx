import { useState, useEffect } from 'react';
import { Check, Pencil, Plus } from 'lucide-react';
import { 
    useGetGarantorProfileByIdQuery,
    useGetGetGarantorProfileQuery,
  useGetProfileByIdQuery, 
  useGetProfileQuery,
} from "@/store/profile";
import { Modal, Button, TextInput, FileInput, LoadingOverlay } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const GuarantorInfo = () => {
    const { data: profileD, refetch } = useGetProfileQuery({});
    const [modalOpened, setModalOpened] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { id } = useParams();
    const { data } = useGetProfileByIdQuery(id);
    const{data:Gprofile} = useGetGarantorProfileByIdQuery(id)
    
    const profile = id ? data : profileD;
    const isCurrentUserProfile = id ? profileD?.user._id === id : true;
    const { data: guarantorData } = useGetGetGarantorProfileQuery({});
    const displayGuarantor = id ?  Gprofile :  guarantorData;
    const hasGuarantor = !!guarantorData;

    const form = useForm({
        initialValues: {
            guarantorName: '',
            guarantorImage: null as File | null,
            address: '',
            work: '',
            verificationCard: null as File | null,
            phoneNumber: '',
        },
        validate: {
            guarantorName: (value) => (value ? null : 'Guarantor name is required'),
            address: (value) => (value ? null : 'Address is required'),
            phoneNumber: (value) => (value ? null : 'Phone number is required'),
        },
    });

    useEffect(() => {
        if (profile?.guarantor) {
            form.setValues({
                guarantorName: profile.guarantor.guarantorName || '',
                guarantorImage: null,
                address: profile.guarantor.address || '',
                work: profile.guarantor.work || '',
                verificationCard: null,
                phoneNumber: profile.guarantor.phoneNumber || '',
            });
        }
    }, [profile]);

    const handleSubmit = async (values: typeof form.values) => {
        setIsSubmitting(true);
        setError(null);
        
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const formData = new FormData();
            
            // Append all fields to FormData
            formData.append('guarantorName', values.guarantorName);
            formData.append('address', values.address);
            formData.append('work', values.work || '');
            formData.append('phoneNumber', values.phoneNumber);
            
            if (values.guarantorImage) {
                formData.append('guarantorImage', values.guarantorImage);
            }
            
            if (values.verificationCard) {
                formData.append('verificationCard', values.verificationCard);
            }

            const endpoint = `${baseUrl}/gurantor/create`;
            const method = 'POST';

            const response = await fetch(endpoint, {
                method,
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save guarantor information');
            }

            // Refresh the profile data after successful submission
            // window.location.reload();
            setModalOpened(false)
            await refetch()
        } catch (err) {
            console.error('Error submitting guarantor info:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
         <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <LoadingOverlay visible={isSubmitting} />
                
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Guarantor Information
                        {hasGuarantor && (
                            <span className="ml-2 text-green-500">
                                <Check size={16} />
                            </span>
                        )}
                    </h3>
                    {isCurrentUserProfile && (
                        <button 
                            className={`flex items-center gap-1 ${hasGuarantor ? 'text-purple-600 hover:text-purple-800' : 'bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700'}`}
                            onClick={() => setModalOpened(true)}
                        >
                            {hasGuarantor ? (
                                <>
                                    <Pencil size={16} />
                                    <span>Edit</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={16} />
                                    <span>Add Guarantor</span>
                                </>
                            )}
                        </button>
                    )}
                </div>

                {hasGuarantor ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium capitalize">{displayGuarantor?.guarantorName || 'Not specified'}</h4>
                                <p className="text-sm text-gray-500">Guarantor Name</p>
                            </div>
                            <div>
                                <h4 className="font-medium">{displayGuarantor?.phoneNumber || 'Not specified'}</h4>
                                <p className="text-sm text-gray-500">Phone Number</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{displayGuarantor?.address || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Address</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{displayGuarantor?.work || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Occupation</p>
                        </div>
                        {displayGuarantor?.guarantorImage && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-1">Guarantor Image</p>
                                <img 
                                    src={displayGuarantor.guarantorImage} 
                                    alt="Guarantor" 
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            </div>
                        )}
                        {displayGuarantor?.verificationCard && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-1">Verification Document</p>
                                <a 
                                    href={displayGuarantor.verificationCard} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:underline"
                                >
                                    View Document
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {isCurrentUserProfile ? (
                            <p>No guarantor information added yet</p>
                        ) : (
                            <p>No guarantor information available</p>
                        )}
                    </div>
                )}
            </div>
            <Modal
                opened={modalOpened}
                onClose={() => !isSubmitting && setModalOpened(false)}
                title={isEditing ? "Edit Guarantor Information" : "Add Guarantor Information"}
                size="lg"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {error && (
                        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded">
                            {error}
                        </div>
                    )}
                    
                    <TextInput
                        label="Guarantor Name"
                        placeholder="Enter guarantor's full name"
                        {...form.getInputProps('guarantorName')}
                        mb="md"
                        required
                    />
                    
                    <TextInput
                        label="Address"
                        placeholder="Enter guarantor's address"
                        {...form.getInputProps('address')}
                        mb="md"
                        required
                    />
                    
                    <TextInput
                        label="Occupation"
                        placeholder="Enter guarantor's occupation"
                        {...form.getInputProps('work')}
                        mb="md"
                    />
                    
                    <TextInput
                        label="Phone Number"
                        placeholder="Enter guarantor's phone number"
                        {...form.getInputProps('phoneNumber')}
                        mb="md"
                        required
                    />
                    
                    <FileInput
                        label="Guarantor Image"
                        placeholder={isEditing ? "Change guarantor's photo" : "Upload guarantor's photo"}
                        accept="image/*"
                        onChange={(file) => form.setFieldValue('guarantorImage', file)}
                        value={form.values.guarantorImage}
                        mb="md"
                    />
                    
                    <FileInput
                        label="Verification Card"
                        placeholder={isEditing ? "Change verification document" : "Upload verification document"}
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(file) => form.setFieldValue('verificationCard', file)}
                        value={form.values.verificationCard}
                        mb="md"
                    />
                    
                    <div className="flex justify-end space-x-3 mt-6">
                        <Button 
                            variant="default" 
                            onClick={() => setModalOpened(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            loading={isSubmitting}
                        >
                            {isEditing ? 'Update' : 'Save'} Information
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default GuarantorInfo;