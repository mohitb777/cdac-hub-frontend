function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google"
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* Soft blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-purple-100 to-pink-100" />

      {/* Blurred gradient shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl" />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-xl
             bg-[#1b191a]
             rounded-2xl
             border border-[#656462]
             shadow-[0_8px_20px_rgba(60,43,31,0.12)]
             px-10 py-12
             text-center"

      >

        {/* CDAC Logo */}
        <img
          src="/cdac-logo.png"
          alt="CDAC Logo"
          className="w-20 h-20 object-contain mx-auto rounded-2xl mb-6"
        />

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#9aa6ba]  mb-3">
          Welcome to CDACHub
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-lg mb-10">
          Sign in to submit, review, or browse projects
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white
                     hover:bg-gray-100
                     text-gray-900
                     font-semibold
                     py-4
                     rounded-2xl
                     transition-all duration-200
                     flex items-center justify-center gap-4
                     shadow-lg"
        >

          {/* Google G Logo */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
            />
            <path
              fill="#34A853"
              d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.6z"
            />
            <path
              fill="#FBBC05"
              d="M6.54 13.68A5.86 5.86 0 0 1 6.24 12c0-.58.1-1.14.3-1.68V7.79H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.21l3.25-2.53z"
            />
            <path
              fill="#EA4335"
              d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.39 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.71 5.39l3.25 2.53C7.31 8.01 9.46 6.29 12 6.29z"
            />
          </svg>

          <span>
            Continue with Google
          </span>

        </button>

        {/* Footer */}
        <p className="text-gray-400 mt-8">
          Only for CDAC students and alumni
        </p>

      </div>
    </div>
  )
}

export default LoginPage