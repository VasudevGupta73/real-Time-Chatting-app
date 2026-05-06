import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { serverUrl } from '../main';
function SignUp() {
    let navigate = useNavigate();
    const [show, setShow] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading,setLoading] = React.useState(false);
    const [error,setError] = React.useState('');
    const handleSignUp = async (e) => {
    e.preventDefault();
        setLoading(true);
    try {
        let response = await fetch(`${serverUrl}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        let data = await response.json();
        console.log(data);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
        setError('An error occurred during sign up.');
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
                <form className='w-full h-full flex flex-col gap-[20px] p-[30px] items-center justify-center' onSubmit={handleSignUp}>
                    <input type='text' placeholder='username' className='border border-gray-300 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ' value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    <input type='email' placeholder='email' className='border border-gray-300 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <div className='relative w-full'>
                        <input type={show ? 'text' : 'password'} placeholder='password' className='border border-gray-300 rounded-lg p-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <span className='absolute right-[10px] top-[50%] translate-y-[-50%] cursor-pointer' onClick={() => setShow(!show)}>
                            {show ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    {error && <p className='text-red-500'>{error}</p>}
                    <button className='w-full bg-[#20c7ff] text-white font-bold py-[10px] rounded-lg hover:bg-[#1aa0c7] transition duration-300 mt-[20px] disabled={loading}'>{loading?"loading...":"Sign Up"}</button>
                    <p className='mx-auto cursor-pointer' onClick={() => navigate('/login')}>
                        Already have an account? <span className='text-blue-500 hover:underline'>Login</span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp