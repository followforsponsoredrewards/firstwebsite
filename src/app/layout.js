import './globals.css';

export const metadata = {
  title: 'FOLLOW FOR SPONSORED REWARDS',
  description: 'JUST FOLLOW THE ACCOUNT ON INSTA TO STAY UPDATED',
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
