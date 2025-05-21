import { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { useGetProfileByIdQuery, useGetProfileQuery, useUpdateFoodMutation } from "@/store/profile";
import { Modal, Button, Select, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'next/navigation';

const FoodInfo = () => {
    const { data: profileD } = useGetProfileQuery({});
    const [updateFood, { isLoading }] = useUpdateFoodMutation();
    const [modalOpened, setModalOpened] = useState(false);

    const {id} = useParams()
     const {data} = useGetProfileByIdQuery(id)
        
            const profile = id ? data : profileD

    const isCurrentUserProfile = id ?  profileD?.user._id === id : true;

    const form = useForm({
        initialValues: {
            cooking_frequency: '',
            diet_type: '',
            shared_groceries: false,
        },
        validate: {
            cooking_frequency: (value) => (value ? null : 'This field is required'),
        },
    });

    useEffect(() => {
        if (profile?.food) {
            form.setValues({
                cooking_frequency: profile.food.cooking_frequency || '',
                diet_type: profile.food.diet_type || '',
                shared_groceries: profile.food.shared_groceries || false,
            });
        }
    }, [profile]);

    const handleSubmit = async (values:any) => {
        try {
            await updateFood(values).unwrap();
            setModalOpened(false);
        } catch (error) {
            console.error('Failed to update food preferences:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Food Preferences
                        {profile?.food && (
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
                            <h4 className="font-medium capitalize">{profile?.food?.cooking_frequency || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Cooking Frequency</p>
                        </div>
                        <div>
                            <h4 className="font-medium capitalize">{profile?.food?.diet_type || 'Not specified'}</h4>
                            <p className="text-sm text-gray-500">Diet Type</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium">
                            {profile?.food?.shared_groceries ? 'Shares groceries' : 'Does not share groceries'}
                        </h4>
                        <p className="text-sm text-gray-500">Grocery Sharing</p>
                    </div>
                </div>
            </div>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Edit Food Preferences"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Select
                        label="Cooking Frequency"
                        data={ ['never', 'sometimes', 'often', 'always']}
                        {...form.getInputProps('cooking_frequency')}
                        mb="md"
                    />
                    
                    <Select
                        label="Diet Type"
                        data={['vegan', 'vegetarian', 'omnivore', 'pescatarian', 'other']}
                        {...form.getInputProps('diet_type')}
                        mb="md"
                    />
                    
                    <Switch
                        label="Share groceries with roommates?"
                        {...form.getInputProps('shared_groceries', { type: 'checkbox' })}
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

export default FoodInfo;