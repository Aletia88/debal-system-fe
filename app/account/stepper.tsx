import { useState, useEffect } from 'react';
import { Stepper, Button, Group, Flex, Box, Text, LoadingOverlay } from '@mantine/core';
import PersonalInfo from './components/personal-Info';
import NeighborhoodInfo from './components/neighborhood-Info';
import LifestyleInfo from './components/lifestyle-Info';
import HobbiesInfo from './components/hobbies-Info';
import FinancialInfo from './components/financial-Info';
import SharedLivingInfo from './components/sharedLiving-Info';
import PetsInfo from './components/pets-Info';
import FoodInfo from './components/food-Info';
import WorkInfo from './components/work-Info';
import { useGetProfileQuery, useUpdateFinancialMutation, useUpdateFoodMutation, useUpdateHobbiesMutation, useUpdateLifestyleMutation, useUpdateNeighborhoodMutation, useUpdatePersonalInfoMutation, useUpdatePetsMutation, useUpdateSharedLivingMutation, useUpdateWorkMutation } from '@/store/profile';
import PrivacyInfo from './components/privacy';
import CompleteMessage from './components/complete';
import ProviderInfo from './components/provider-info'; // You'll need to create this component
import { useRouter } from 'next/navigation';

export default function Form() {
  const [active, setActive] = useState(0);
  const [activeHp, setActiveHp] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(active);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'houseprovider' | null>(null);
  const router = useRouter();
  const { data: profileData, isLoading } = useGetProfileQuery({});

  useEffect(() => {
    // Check if we have profile data and determine the role
    if (profileData?.user.role) {
      setUserRole(profileData.user.role);
    }
  }, [profileData]);

  const handleStepChange = (nextStep: number) => {
    if (nextStep > (userRole === 'houseprovider' ? 1 : 10) || nextStep < 0) return;
    setActive(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };
  const handleHpStepChange = (nextStep: number) => {
    if (nextStep > (userRole === 'houseprovider' ? 1 : 10) || nextStep < 0) return;
    setActiveHp(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;
  const shouldAllowSelectHpStep = (step: number) => highestStepVisited >= step && activeHp !== step;

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  // If we haven't determined the role yet, show loading
  if (userRole === null) {
    return <LoadingOverlay visible />;
  }

  return (
    <Flex gap="xl" align="flex-start" className='p-5' pos="relative">
      <LoadingOverlay visible={isSubmitting} />
      
      {/* Vertical stepper - different for house houseproviders */}
      {userRole === 'houseprovider' ? (
        <Box>
          <Stepper active={active} onStepClick={setActive} orientation="vertical" className='pr-5'>
            <Stepper.Step label="Provider Information" allowStepSelect={shouldAllowSelectHpStep(0)} />
            {/* <Stepper.Step label="Complete" allowStepSelect={shouldAllowSelectHpStep(1)} /> */}
          </Stepper>
        </Box>
      ) : (
        <Box>
          <Stepper active={active} onStepClick={setActive} orientation="vertical" className='pr-5'>
            <Stepper.Step label="Personal Info" allowStepSelect={shouldAllowSelectStep(0)} />
            <Stepper.Step label="Neighborhood" allowStepSelect={shouldAllowSelectStep(1)} />
            <Stepper.Step label="Lifestyle" allowStepSelect={shouldAllowSelectStep(2)} />
            <Stepper.Step label="Hobbies" allowStepSelect={shouldAllowSelectStep(3)} />
            <Stepper.Step label="Financial" allowStepSelect={shouldAllowSelectStep(4)} />
            <Stepper.Step label="Shared Living" allowStepSelect={shouldAllowSelectStep(5)} />
            <Stepper.Step label="Pets" allowStepSelect={shouldAllowSelectStep(6)} />
            <Stepper.Step label="Food" allowStepSelect={shouldAllowSelectStep(7)} />
            <Stepper.Step label="Work" allowStepSelect={shouldAllowSelectStep(8)} />
            <Stepper.Step label="Privacy" allowStepSelect={shouldAllowSelectStep(9)} />
            <Stepper.Step label="Complete" allowStepSelect={shouldAllowSelectStep(10)} />
          </Stepper>
        </Box>
      )}

      {/* Form content */}
      <Box style={{ flex: 1 }} bg='white' p={20} className='border-t-4 border-t-violet-600 '>
        {userRole === 'houseprovider' ? (
          <>
            {activeHp === 0 && (
              <ProviderInfo 
                onNext={() => handleHpStepChange(1)} 
                initialData={profileData?.houseproviderInfo}
              />
            )}
            {/* {active === 1 && (
              <CompleteMessage 
                onBack={() => handleHpStepChange(0)}
                isProvider={true}
              />
            )} */}
          </>
        ) : (
          <>
            {active === 0 && (
              <PersonalInfo 
                onNext={() => handleStepChange(1)} 
                initialData={profileData?.personalInfo}
              />
            )}
            {active === 1 && (
              <NeighborhoodInfo 
                onNext={() => handleStepChange(2)} 
                onBack={() => handleStepChange(0)}
                initialData={profileData?.neighborhoodPrefs}
              />
            )}
            {active === 2 && (
              <LifestyleInfo 
                onNext={() => handleStepChange(3)} 
                onBack={() => handleStepChange(1)}
                initialData={profileData?.lifestyle}
              />
            )}
            {active === 3 && (
              <HobbiesInfo 
                onNext={() => handleStepChange(4)} 
                onBack={() => handleStepChange(2)}
                initialData={profileData?.hobbies}
              />
            )}
            {active === 4 && (
              <FinancialInfo 
                onNext={() => handleStepChange(5)} 
                onBack={() => handleStepChange(3)}
                initialData={profileData?.financial}
              />
            )}
            {active === 5 && (
              <SharedLivingInfo 
                onNext={() => handleStepChange(6)} 
                onBack={() => handleStepChange(4)}
                initialData={profileData?.sharedLiving}
              />
            )}
            {active === 6 && (
              <PetsInfo 
                onNext={() => handleStepChange(7)} 
                onBack={() => handleStepChange(5)}
                initialData={profileData?.pets}
              />
            )}
            {active === 7 && (
              <FoodInfo 
                onNext={() => handleStepChange(8)} 
                onBack={() => handleStepChange(6)}
                initialData={profileData?.food}
              />
            )}
            {active === 8 && (
              <WorkInfo 
                onNext={() => handleStepChange(9)} 
                onBack={() => handleStepChange(7)}
                initialData={profileData?.work}
              />
            )}
            {active === 9 && (
              <PrivacyInfo 
                onNext={() => handleStepChange(10)}
                onBack={() => handleStepChange(8)}
                initialData={profileData?.privacy}
              />
            )}
            {active === 10 && (
              <CompleteMessage 
                onBack={() => handleStepChange(9)}
              />
            )}
          </>
        )}
      </Box>
    </Flex>
  );
}