'use client'
import { Tabs } from '@mantine/core';
import AllListings from './components/allListing';
import MyListings from './components/myListing';

export default function HouseListingPage() {
  return (
    <div className="md:p-4 pt-4 px-1">
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All Listings</Tabs.Tab>
          <Tabs.Tab value="my">My Listings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="all" pt="md">
          <AllListings />
        </Tabs.Panel>

        <Tabs.Panel value="my" pt="md">
          <MyListings />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}