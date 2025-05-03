'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  image?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ name, image, className = '', size = 'md' }: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={image || "/image.png"} />
      <AvatarFallback>
        {name.split(' ').map(n => n[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};