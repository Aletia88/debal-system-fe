export interface Chat {
    id: number;
    name: string;
    lastMessage: string;
    unread: number;
    online: boolean;
  }
  
  export interface MatchUser {
    id: number;
    name: string;
    matchPercentage: number;
    image: string;
  }