"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch("/api/user/session/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (response.ok) {
            const data: any = await response.json();
            if (data.token) {
                sessionStorage.setItem("token", data.token);
                router.push("/");
            }
        } else {
            setErrorMessage(
                response.status === 401 
                    ? "Invalid username or password. Please try again." 
                    : "Server error. Please try again later."
            );
        }
    };

    // Keep track of whether the access token has been verified
    const [isTokenVerified, setIsTokenVerified] = useState(false);

    const refreshAccessToken = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            router.push("/"); // Redirect without interrupting the render process
            return;
        }

        const response = await fetch("/api/user/session/token/refresh", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            if (data.token) sessionStorage.setItem("token", data.token);
        }
        setIsTokenVerified(true); // Allow rendering after token verification
    };

    useEffect(() => {
        refreshAccessToken();
    }, []);

    if (!isTokenVerified) {
        return null; // Render nothing until the token is verified
    }

    return (
        <div className='container'>
            <div className='content'>
                <div className='space-y-4'>
                    <h1 className='bookTitle'>Log In</h1>
                    {errorMessage && (
                        <div className='alert alert-danger' role='alert'>
                            {errorMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='mt-2'>
                            <label htmlFor='username' className='block font-semibold mb-1 h5'>
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='form-control background-dark text-white border-2 border-secondary rounded p-2'
                                placeholder='Enter your username...'
                                maxLength={16}
                                required
                            />
                        </div>

                        <div className='mt-2 relative'>
                            <label htmlFor='password' className='block font-semibold mb-1 h5'>
                                Password
                            </label>
                            <div className='flex items-center'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='form-control background-dark text-white border-2 border-secondary rounded p-2 flex-grow'
                                    placeholder='Enter your password...'
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='btn-primary btn mt-2 '
                                    aria-label='Toggle Password Visibility'
                                >
                                    Show Password <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        <h5 className='mt-3'>
                            Don't have an account?{" "}
                            <a href='/user/signup' className='bold text-info text-decoration-underline'>
                                Sign Up
                            </a>
                        </h5>
                        <div className='text-end mt-2'>
                            <button type='submit' className='btn btn-sm btn-primary rounded-pill px-4 py-1'>
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
