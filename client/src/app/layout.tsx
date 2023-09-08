import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.css';

export const metadata: Metadata = {
  title: 'Members Reputation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className='bg-dark'
      >
        {children}
      </body>
    </html>
  );
}
