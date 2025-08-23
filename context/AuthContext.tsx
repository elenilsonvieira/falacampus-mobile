import { ILogin } from "@/interface/ILogin";
import { IUser } from "@/interface/IUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import React, { createContext,  useState } from "react";


type AuthContextType = {
  dataUser?: IUser;
  login: (values: ILogin) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export type ChildrenProps = {
  children: React.ReactNode;
};

export default function AuthContextProvider({ children }: ChildrenProps) {
  const [dataUser, setDataUser] = useState<IUser>()

  const login = async(values:ILogin)=>{

      try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        values
      );

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
        const authority = user.roles[0].authority;
        // const authority = "User"
        
        setDataUser(user)

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await AsyncStorage.setItem("auth_token", token);
        
        console.log("Login success");
        if (authority === "ADMIN") {
          router.replace({
            pathname: "../(adminTabs)/feed",
            
          });
          
        } else {
          router.replace({
            pathname: "../(userTabs)/feed",  
          });
        }
      } else {
        //adicionar mensagem para usuario de requisicao invalida
        console.log("deu erro");
      }
    } catch (error) {
      console.error("Login failed:", AxiosError);
    }
  }

  const logout = async()=>{
    try {
      const token = AsyncStorage.getItem('auth_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post('http://localhost:8080/api/logout' );

      if(response.status === 200){
        delete axios.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem('userToken');

        setTimeout(() => {  
          router.replace("/")
        }, 1000);
      }
      
    } catch (error) {
      console.log(error);
    }
    
  }

    
  return (
    <AuthContext.Provider value={{dataUser,login,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
