import { ILogin } from "@/interface/ILogin";
import { IUser } from "@/interface/IUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { createContext,  useEffect,  useState } from "react";
import { Alert } from "react-native";


type AuthContextType = {
  dataUser?: IUser;
  login: (values: ILogin) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export type ChildrenProps = {
  children: React.ReactNode;
};

export default function AuthContextProvider({ children }: ChildrenProps) {
  const [dataUser, setDataUser] = useState<IUser>()
  const [loading, setLoading]= useState(false)

  const login = async(values:ILogin)=>{
      setLoading(true);
      try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        values
      );

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;
        const authority = user.roles[0].authority;
        
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
      }
    } catch (error) {
      Alert.alert('Erro de login', 'Verifique sua matrícula e senha.');
      console.error("Login failed:", error);
    }
    setLoading(false);
  }

  const logout = async()=>{
    try {
      const token = AsyncStorage.getItem('auth_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post('http://localhost:8080/api/logout' );

      if(response.status === 200){
        delete axios.defaults.headers.common['Authorization'];
        await AsyncStorage.removeItem("auth_token");

        setTimeout(() => {  
          router.replace("/")
        }, 500);
      }
      
    } catch (error) {
      console.log(error);
    }
    
  }

  const validateSession = async ()=>{
    
    const token =  await AsyncStorage.getItem('auth_token');
    
    if(!token){
      return;
    }
    try {

      const tokenVerific = {
        token: token
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post('http://localhost:8080/api/isValidToken',tokenVerific );
      
      if(response.status === 200){
        const user = response.data.user;
        const authority = user.roles[0].authority;
        setDataUser(user)
        if (authority === "ADMIN") {
          router.replace({
            pathname: "../(adminTabs)/feed",
            
          });
          
        } else {
          router.replace({
            pathname: "../(userTabs)/feed",  
          });
        }

      }else{
        await AsyncStorage.removeItem("auth_token");
        delete axios.defaults.headers.common["Authorization"];
        Alert.alert("Sessão expirada", "Faça o login novamente.");
        router.replace("/")
      }
    } catch (error) {
      console.error("Erro na validação do token:", error);
      await AsyncStorage.removeItem("auth_token");
      delete axios.defaults.headers.common["Authorization"];
      router.replace("/");
    }
  }
  useEffect(() =>{
    validateSession()
  },[])
    
  return (
    <AuthContext.Provider value={{dataUser,login,logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
}
