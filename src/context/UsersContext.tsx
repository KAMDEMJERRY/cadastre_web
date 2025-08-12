import { useAPI } from "@/hooks/useApi";
import { UserService } from "@/services/api/users";
import { User, UserCreatePayload, UserUpdatePayload } from "@/types/user"
import { createContext } from "react";

 type UsersContextType = {
    users: User[] | undefined;
    loading: boolean;
    error: string | null;
    fetchUsers: () => Promise<void>;
    createUser: (userData: Omit<UserCreatePayload, 'id'>) => Promise<User>;
    updateUser: (id: number, userData: Omit<UserUpdatePayload, 'id'>) => Promise<User>;
    deleteUser: (id: number) => Promise<void>;
}


export const UsersContext = createContext<UsersContextType | undefined>(undefined);


export function UsersProvider({ children }: { children: React.ReactNode }) {
    const { data: users, execute, loading, error, refresh } = useAPI<User[]>(UserService.getUsers, { immediate: true });

    const handleFetchUsers = async () => {
        await execute();
    };

    const handleCreateUser = async (userData: Omit<UserCreatePayload, 'id'>) => {
        const user = await UserService.postUser(userData);
        if (!user) {
            throw new Error("Failed to create user");
        }
        await handleFetchUsers();
        return user;
    };

    const handleUpdateUser = async (id: number, userData: Omit<UserUpdatePayload, 'id'>) => {
        const user = await UserService.updateUser(id, userData);
        if (!user) {
            throw new Error("Failed to update user");
        }
        await handleFetchUsers();
        return user;
    };

    const handleDeleteUser = async (id: number) => {
        await UserService.deleteUser(id);
        await handleFetchUsers();
    };

    return (
        <UsersContext.Provider value={{
            users: users ?? [],
            loading: loading,
            error: error,
            fetchUsers: handleFetchUsers,
            createUser: handleCreateUser,
            updateUser: handleUpdateUser,
            deleteUser: handleDeleteUser
        }}>
            {children}
        </UsersContext.Provider>
    );
}