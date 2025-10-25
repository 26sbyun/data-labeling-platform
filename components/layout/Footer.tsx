import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/30 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h4 className="font-semibold text-lg">Data Labeling Co.</h4>
          <p className="text-sm text-gray-400 mt-2">
            High-quality annotation & QA for computer vision and NLP.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/industries" className="hover:text-white">Industries</Link></li>
            <li><Link href="/join" className="hover:text-white">Join Network</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p className="text-sm text-gray-400">
            📧 estellezjy@gmail.com
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} Data Labeling Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}