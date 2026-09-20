import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FAFBFC] text-[#1A1F2B]">
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-[#595959] mb-6">The requested policy page could not be located.</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#1958E8] text-white rounded-full font-bold text-sm shadow-sm"
      >
        Return to ClaimReady
      </Link>
    </div>
  );
}
