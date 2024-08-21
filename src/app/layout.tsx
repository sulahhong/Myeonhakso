import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import './globals.css';
import { Metadata } from 'next';
import { NextAuthProvider } from './providers';
import Script from 'next/script';
import Loading from './loading';

export const metadata: Metadata = {
  title: '면학소 Home',
  description: '면학소 초기 페이지입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <NextAuthProvider>
          <div className="flex flex-col h-lvh">
            <Header />
            <Script src="https://cdn.iamport.kr/v1/iamport.js" />
            {children}
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
