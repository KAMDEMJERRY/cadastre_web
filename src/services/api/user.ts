import { User } from "@/types/user";

export const fetchUserProfile = async (token: string):Promise<User> => {
  const response = await fetch('http://localhost/api/accounts/users/me/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

