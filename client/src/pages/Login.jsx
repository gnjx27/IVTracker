import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            await navigate("/");
        } catch (err) {
            console.error("Login failed: ", err.message);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className='text-center text-3xl font-extrabold text-gray-900'>Login</h2>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Email
                        </label>
                        <input
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Email'
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label>
                            Password
                        </label>
                        <input
                            className="border border-gray-300 appearance-none rounded-md w-full relative block px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Password'
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <button className="group cursor-pointer relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type='submit'>Sign in</button>
                    </div>

                    <div>
                        <p className='text-center'>Don't have an account? <a className='cursor-pointer' onClick={() => navigate("/register")}><u>Register</u></a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login; 