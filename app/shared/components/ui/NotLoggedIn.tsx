import Link from "next/link";

export default function NotLoggedIn() {
    return (
        <main className="text-center mx-auto text-gray-700 p-4">
            <div className="card w-96 bg-base-100 shadow-xl mx-auto">
                <svg className="w-2/3 mx-auto text-error" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"></path>
                </svg>
                <div className="card-body">
                    <h2 className="card-title">Für diese Seite musst du eingeloggt sein!</h2>
                    <div className="card-actions justify-center py-4">
                        <button className="btn btn-error">
                            <Link href="/login" id="goto-login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Zum Login</Link>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
