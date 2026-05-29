import './globals.css';

export const metadata = {
  title: 'Supporter Rewards Archive',
  description: 'Transparent Community Verification Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0C] text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}