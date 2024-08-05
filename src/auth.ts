import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao"

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const res = await fetch(`${SERVER}/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const resJson = await res.json();
        console.log(resJson);
        if (resJson.ok) {
          const user = resJson.item;
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.profileImage && SERVER + user.profileImage,
            type: user.type,
            accessToken: user.token.accessToken,
            refreshToken: user.token.refreshToken,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  ],
	session: {
    strategy: "jwt", 
    maxAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 로그인 처리를 계속 할지 여부 결정
    // true를 리턴하면 로그인 처리를 계속하고 false를 리턴하거나 Error를 throw하면 로그인 흐름을 중단
    // user: authorize()가 리턴한 값
    async signIn({ user }) {
      return true;
      // user에 들어있는 사용자 정보를 이용해서 우리쪽 DB에 저장 (회원가입) 절차 필요
      // 가입된 회원의 경우 자동으로 로그인 처리 
    },

    // 로그인 성공한 회원 정보로 token 객체 설정
    // 최초 로그인시 user 객체 전달,
    async jwt({ token, user }) {
      // 토큰 만료 체크, refreshToken으로 accessToken 갱신
      // refreshToken도 만료되었을 경우 로그아웃 처리
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    // 클라이언트에서 세션 정보 요청시 호출
    // token 객체 정보로 session 객체 설정
    async session({ session, token }) {
      console.log('Session Callback:', { session, token });
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});
