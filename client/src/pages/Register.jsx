import  { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [credentials, setCredentials] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(credentials);
            await navigate("/");
        } catch (err) {
            console.error("Register failed: ", err);
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className='text-center text-3xl font-extrabold text-gray-900'>Register</h2>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label>
                            First Name
                        </label>
                        <input
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='First name'
                            value={credentials.first_name}
                            onChange={(e) => setCredentials({ ...credentials, first_name: e.target.value })}
                        />
                    </div>
                    
                    <div>
                        <label>
                            Last Name
                        </label>
                        <input
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Last name'
                            value={credentials.last_name}
                            onChange={(e) => setCredentials({ ...credentials, last_name: e.target.value })}
                        />
                    </div>

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
                        <label>
                            Confirm Password
                        </label>
                        <input
                            className="border border-gray-300 appearance-none rounded-md w-full relative block px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Confirm password'
                            value={credentials.password2}
                            onChange={(e) => setCredentials({ ...credentials, password2: e.target.value })}
                        />
                    </div>

                    <div>
                        <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type='submit'>Sign in</button>
                    </div>

                    <div>
                        <p className='text-center'>Already have an account? <a className='cursor-pointer' onClick={() => navigate("/login")}><u>Login</u></a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login; 