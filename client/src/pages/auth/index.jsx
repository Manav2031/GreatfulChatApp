import Background from '@/assets/login2.png';
import Victory from '@/assets/victory.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateSignup = () => {
    if (!email.length) {
      toast.error('Email is required', { duration: 5000 });
      return false;
    }
    if (!password.length) {
      toast.error('Password is required', { duration: 5000 });
      return false;
    }
    if (!confirmPassword.length) {
      toast.error('Confirm Password is required', { duration: 5000 });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Password and confirm password should be the same', { duration: 5000 });
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error('Email is required', { duration: 5000 });
      return false;
    }
    if (!password.length) {
      toast.error('Password is required', { duration: 5000 });
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
      if (response.status === 201) {
        toast.success('OTP sent successfully', { duration: 5000 });
        setUserInfo(response.data.user);
        navigate('/verifyotp', { state: { email } });
      }
      console.log({ response });
    }
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        toast.success('Login Successful', { duration: 5000 });
        if (response.data.user.profileSetup) navigate('/chat');
        else navigate('/profile');
      }
      console.log({ response });
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="h-[80vh] w-[90vw] lg:w-[75vw] xl:w-[60vw] bg-white border border-gray-200 shadow-lg rounded-3xl grid xl:grid-cols-2">
        {/* Left Section - Tabs */}
        <div className="flex flex-col gap-10 items-center justify-center px-6 lg:px-12">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-bold">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[80px]" />
            </div>
            <p className="font-medium text-gray-700">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <Tabs className="w-full" defaultValue="login">
            <TabsList className="w-full flex justify-between">
              <TabsTrigger
                value="login"
                className="w-full py-3 text-center border-b-2 transition-colors data-[state=active]:border-purple-600 data-[state=active]:text-purple-600"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="w-full py-3 text-center border-b-2 transition-colors data-[state=active]:border-purple-600 data-[state=active]:text-purple-600"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-5 mt-6" value="login">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 shadow-sm focus:ring-2 focus:ring-purple-600 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 shadow-sm focus:ring-2 focus:ring-purple-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className="w-full rounded-full p-4 bg-purple-600 text-white hover:bg-purple-700 transition" onClick={handleLogin}>
                Login
              </Button>
            </TabsContent>
            <TabsContent className="flex flex-col gap-5 mt-6" value="signup">
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-4 shadow-sm focus:ring-2 focus:ring-purple-600 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-4 shadow-sm focus:ring-2 focus:ring-purple-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-4 shadow-sm focus:ring-2 focus:ring-purple-600 transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button className="w-full rounded-full p-4 bg-purple-600 text-white hover:bg-purple-700 transition" onClick={handleSignup}>
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Section - Image */}
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="Background" className="h-[80%] object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
