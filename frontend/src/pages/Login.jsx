import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { serverUrl } from '../main';
function Login() {
    let navigate = useNavigate();
    const [show, setShow] = React.useState(false);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    let [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear any previous errors
        try {
            let response = await fetch(`${serverUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            let data = await response.json();

            if (!response.ok) {
                // Handle server errors (e.g., 400, 401, 500)
                setError(data.message || 'Login failed. Please check your credentials.');
                setLoading(false);
                return;
            }

            // Success logic (e.g., store token, navigate)
            console.log('Login successful:', data);
            // Add your success handling here, like localStorage.setItem('token', data.token);
            // navigate('/dashboard'); // Or wherever after login
            setLoading(false);
        } catch (error) {
            // Handle network errors
            console.log(error);
            setError('Network error. Please try again.');
            setLoading(false);
        }
    }
    return (
        <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
            <div className='w-full max-w-[500px] h-[600px] bg-white rounded-xl shadow-gray-400 shadow-lg flex flex-col gap-[30px]'>
                <div className='w-full h-[200px] bg-[#20c7ff] shadow-gray-400 shadow-lg flex items-center justify-center rounded-b-[30%]'>
                    <h1 className='text-gray-600 font-bold text-[30px] '>
                        welcome to <span className='text-white'>ChatApp</span>
                    </h1>
                </div>
                <form className='w-full h-full flex flex-col gap-[20px] p-[30px] items-center justify-center' onSubmit={handleLogin}>

                    <input type='email' placeholder='email' className='border border-gray-300 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <div className='relative w-full'>
                        <input type={show ? 'text' : 'password'} placeholder='password' className='border border-gray-300 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <span className='absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer' onClick={() => setShow(!show)}>
                            {show ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                    <button className='w-full bg-[#20c7ff] text-white font-bold py-[10px] rounded-lg hover:bg-[#1aa0c7] transition duration-300 mt-[20px]'>{loading ? "loading..." : "Login"}</button>
                    <p className='mx-auto cursor-pointer' onClick={() => navigate('/signup')}>
                        Already have an account? <span className='text-blue-500 hover:underline'>SignUp</span>
                    </p>
                </form>
            </div>
        </div>
    )

}

export default Login