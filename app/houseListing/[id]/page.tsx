'use client'
import { useGetHouseListingQuery, useDeleteListingMutation, useUploadListingImagesMutation, useDeleteListingImageMutation } from '@/store/houseListing';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Dialog, Group, Modal, FileButton, ActionIcon, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useGetProfileQuery } from '@/store/profile';
import { IconTrash, IconUpload } from '@tabler/icons-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: listing, isLoading, isError, refetch } = useGetHouseListingQuery(id as string);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [uploadModalOpened, { open: openUploadModal, close: closeUploadModal }] = useDisclosure(false);
  const [files, setFiles] = useState<File[]>([]);
  const [deleteListing] = useDeleteListingMutation();
  const [uploadImages] = useUploadListingImagesMutation();
  const [deleteImage] = useDeleteListingImageMutation();
  const { data: profile } = useGetProfileQuery({});

  const isMyListing = listing?.user_id._id === profile?.user._id;

  const handleDelete = async () => {
    try {
      await deleteListing(id as string).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Listing deleted successfully',
        color: 'green',
      });
      router.push('/houseListing');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete listing',
        color: 'red',
      });
    }
  };

  const handleUploadImages = async () => {
    if (files.length === 0) return;
  
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file); // If backend expects multiple files as an array
      });
  
      const token = localStorage.getItem('token'); // or your token key
  
      const response = await fetch(`${baseUrl}api/list/images/${listing._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type when using FormData — browser will handle it
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }
  
      notifications.show({
        title: 'Success',
        message: 'Images uploaded successfully',
        color: 'green',
      });
  
      refetch();
      closeUploadModal();
      setFiles([]);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload images',
        color: 'red',
      });
      console.error(error);
    }
  };
  
  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage({ id: id as string, imageId }).unwrap();
      notifications.show({
        title: 'Success',
        message: 'Image deleted successfully',
        color: 'green',
      });
      refetch();
      setSelectedImageIndex(0);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete image',
        color: 'red',
      });
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (isError) return <div className="text-center py-8">Error loading listing</div>;
  if (!listing) return <div className="text-center py-8">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Delete Confirmation Modal */}
      <Dialog opened={deleteModalOpened} withCloseButton onClose={closeDeleteModal} size="lg" radius="md">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this listing? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteModal}>Cancel</Button>
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Dialog>

      {/* Image Upload Modal */}
      <Modal opened={uploadModalOpened} onClose={closeUploadModal} title="Upload Images" centered>
        <div className="space-y-4">
          <FileButton onChange={setFiles} accept="image/*" multiple>
            {(props) => (
              <Button {...props} leftSection={<IconUpload size="1rem" />}>
                Select Images
              </Button>
            )}
          </FileButton>

          {files.length > 0 && (
            <div>
              <Text size="sm" mt="sm">
                Selected files:
              </Text>
              <ul className="list-disc pl-5 mt-1">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <Group justify="right" mt="md">
            <Button 
              onClick={handleUploadImages} 
              disabled={files.length === 0}
              // loading={uploadImages.isLoading}
            >
              Upload
            </Button>
          </Group>
        </div>
      </Modal>

      {/* Header with back button and action buttons */}
      <div className="mb-4 flex justify-between items-center">
        <Link href="/houseListing" className="text-blue-600 hover:underline">
          ← Back to listings
        </Link>
        
        {isMyListing && (
          <Group>
            <Button 
              onClick={openUploadModal}
              leftSection={<IconUpload size="1rem" />}
              variant="outline"
            >
              Add Images
            </Button>
            <Link href={`/houseListing/edit/${id}`}>
              <Button variant="outline">Edit Listing</Button>
            </Link>
            <Button color="red" onClick={openDeleteModal}>Delete Listing</Button>
          </Group>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Image gallery */}
        <div className="md:w-1/2">
          {/* Main image */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden mb-4">
            {listing.photos?.length > 0 ? (
              <>
                <Image
                  src={`${baseUrl}${listing.photos[selectedImageIndex].url}`}
                  alt={listing.photos[selectedImageIndex].description || 'House listing'}
                  fill
                  className="object-cover"
                  priority
                />
                {isMyListing && (
                  <div className="absolute top-2 right-2">
                    <ActionIcon
                      color="red"
                      variant="filled"
                      onClick={() => handleDeleteImage(listing.photos[selectedImageIndex]._id)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {listing.photos?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-2">
              {listing.photos.map((photo: any, index: any) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden ${selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <Image
                      src={`${baseUrl}${photo.url}`}
                      alt={photo.description || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                  {isMyListing && (
                    <ActionIcon
                      color="red"
                      variant="filled"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => handleDeleteImage(photo._id)}
                    >
                      <IconTrash size="0.8rem" />
                    </ActionIcon>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side - House details */}
       
        {/* Right side - House details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-semibold">
              {listing.rent?.amount} {listing.rent?.currency}/{listing.rent?.period}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {listing.status}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Bedrooms</h3>
              <p className="text-2xl">{listing.bedrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Bathrooms</h3>
              <p className="text-2xl">{listing.bathrooms}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Available From</h3>
              <p>{new Date(listing.availableFrom).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-600">Max Occupants</h3>
              <p>{listing.rules?.maxOccupants}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {listing.amenities?.map((amenity:any, index:any) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">House Rules</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                {listing.rules?.petsAllowed ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                Pets allowed
              </li>
              <li className="flex items-center gap-2">
                {listing.rules?.smokingAllowed ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  <span className="text-red-500">✗</span>
                )}
                Smoking allowed
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p>
              {listing.address?.street}, {listing.address?.city}, {listing.address?.state}{' '}
              {listing.address?.zipCode}
            </p>
            {/* You can add a map component here using the coordinates */}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Provider Information</h2>
            <ul>
              <li>
                {listing.user_id.name}
              </li>
            </ul>
            {/* You can add a map component here using the coordinates */}
          </div>
        {/* </div> */}

          {/* ... rest of your existing listing details ... */}
        </div>
      </div>
    </div>
  );
}