"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/ui/tabs"


export default function page () {
  return (
    <div>
      <h1>Login</h1>
      <Login_Register />
    </div>
  )
}

function Login_Register() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Login />

          </CardContent>

        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>

          </CardHeader>
          <CardContent className="space-y-2">
            <Register />

          </CardContent>

        </Card>
      </TabsContent>
    </Tabs>
  )
}

function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    // const router = useRouter();
  
    const handleLogin = () => {
      try {
        axios.post('http://localhost:6969/api/auth/login', {
          email, pass
        }, { withCredentials: true }).then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken)
          localStorage.setItem("user_email",email);
          redirect('/Home');
        })
      }
      catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div>
        <h1>Login</h1>
  
        <label htmlFor="email">Email</label>
        <input type="email" id="email" className="text-black" required onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pass">Password</label>
        <input type="password" id="pass" required className="text-black" onChange={(e) => setPass(e.target.value)} />
        <button type="submit" onClick={handleLogin}>Sign in</button>
  
      </div>
    );
  }

  function Register() {
    const [formData, setFormData] = useState({ email: "", pass: "" });
    const [error, setError] = useState("");
    const router = useRouter();
  
    interface FormData {
      email: string;
      pass: string;
    }
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { id, value } = e.target;
      setFormData((prevData: FormData) => ({ ...prevData, [id]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      try {
        axios.post('http://localhost:6969/api/auth/signup', formData).then((data)=>{
          if(data){
            router.push('/Home');
          }
        })
       
      } catch (error) {
        setError("Signup failed. Please try again.");
        console.error(error);
      }
    };
  
    return (
      <div>
        <h1>Signup</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required onChange={handleChange} />
          <label htmlFor="pass">Password</label>
          <input type="password" id="pass" required onChange={handleChange} />
          <button type="submit">Sign up</button>
        </form>
  
      </div>
    );
  };