"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { logout } from "@/store/authSlice";
import { useGetProfileQuery } from "@/store/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Avatar } from "@mantine/core";
import { Menu, rem } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profile } from "console";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_OR;
export function NavbarDemo() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const profilePhoto = data?.photos?.find((photo:any) => photo.isProfile);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      router.push("/login");
      refetch();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleProfileClick = () => {
    if (data?.form_completed) {
      router.push("/profile");
    } else {
      router.push("/account");
    }
  };

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Your Matches", link: "/matches" },
    { name: "Chat", link: "/chat" },
    { name: "Find Room", link: "/houseListing" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <button className="flex items-center gap-2 focus:outline-none">
                  {/* <Avatar
                    src={data?.user.avatar}
                    radius="xl"
                    size="sm"
                    className="cursor-pointer"
                  >
                    {data?.user.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                   */}
                   <Avatar className="h-8 w-8  bg-cover">
            <AvatarImage
              src={profilePhoto ? ` ${profilePhoto.url}` : "/image.png"}
              alt="Profile"
            />
            <AvatarFallback>
              {data?.user.name?.split(' ').map((n:any) => n[0]).join('') || 'RU'}
            </AvatarFallback>
          </Avatar>
                  <span className="font-medium hidden sm:inline">
                    {data?.user.name}
                  </span>
                </button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleProfileClick}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={handleProfileClick}
                variant="primary"
                className="w-full"
              >
                Profile
              </NavbarButton>
              <NavbarButton
                onClick={handleLogout}
                variant="secondary"
                className="w-full"
              >
                Logout
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}