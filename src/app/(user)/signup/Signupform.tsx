'use client';
import {
  signInWithCredentials,

  signUpWithGoogle,
  signUpWithKaKao,
  signUpWithNaver,
  signupWithOAuth,
} from '@/data/actions/authAction';

import Button from '@/components/Button';
import Submit from '@/components/Submit';
import Toast from '@/components/Toast';
import { signup } from '@/data/actions/userAction';
import { fetchEmailValidation } from '@/data/postFetch';
import useToast from '@/hooks/useToast';
import { UserForm } from '@/types';
import useModalStore from '@/zustand/useModalStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Signupform() {
  const openModal = useModalStore((state) => state.openModal);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm<UserForm>({
    // mode: 'onSubmit', 
  });

 const [selectedType, setSelectedType] = useState<'user' | 'seller'>('user');
  const { toast, message, showToast } = useToast();
 

  const handleTypeClick = (value: 'user' | 'seller') => {
    setSelectedType(value);
    setValue('type', value);
  };

  const emailValue = watch('email', '');

  const addUser = async (formData: UserForm) => {
    setIsSubmitted(true);
    const userData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'attach' && key !== 'extra') {
        userData.append(key, value as string);
      }
    });
    if (formData.attach && formData.attach.length > 0) {
      userData.append('attach', formData.attach[0]);
    }

    if (formData.address) {
      userData.append('address', formData.address);
    }

    if (selectedType === 'seller') {
      if (!formData.attach || formData.attach.length === 0) {
        setError('attach', { type: 'required', message: '이미지는 필수입니다.' });
        return;
      }
      if(!formData.address){
        setError('address', { type: 'required', message: '강사 소개는 필수입니다.' });
        return;
      }
    }

    const resData = await signup(userData);
    if (resData.ok) {
      openModal({
        content: `${resData.item.name}님 회원가입을 환영합니다. :)`,
        callbackButton: {
          확인 : () => {
            router.push('/');
          },
        },
      });
  
    } else {
      if ('errors' in resData) {
        resData.errors.forEach(error =>
          setError(error.path, { message: error.msg }),
        );
      } else if (resData.message) {
        showToast(resData.message);
      }
    }
  };

  const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const handleEmailValidationClick = async () => {
    if (emailValue.trim() === '') {
      alert('이메일 주소를 입력해주세요');
      return;
    }
  
    if (!EMAIL_REGEX.test(emailValue)) {
      alert('유효한 이메일 형식이 아닙니다');
      return;
    }

    try {
      const response = await fetchEmailValidation(emailValue);
      if (response.ok === 1) {

        alert('사용 가능한 이메일입니다.');
      } else if (response.ok === 0) {
        alert('이미 사용 중인 이메일입니다.');
      } else {
      alert('이메일 확인 중 오류가 발생했습니다.');
    }
    } catch (error) {
      console.error('Error during email validation:', error);
      alert('이메일 확인 중 오류가 발생했습니다.');

    }
  };

  return (
    <>
    <form
      // action="/"
      action={signInWithCredentials}
      onSubmit={handleSubmit(addUser)}
      className="max-w-screen-md mx-auto mt-14"
    >
      {toast && <Toast text={message} />}

      <div className="mb-12 flex justify-center gap-14" id="type">
        <button
          className={`px-8 py-4 ${selectedType === 'user' ? 'bg-main-green' : 'bg-main-gray'} hover:bg-main-yellow text-white font-semibold rounded-md cursor-pointer`}
          value="user"
          onClick={() => handleTypeClick('user')}
        >
          일반회원
        </button>
        <button
          className={`px-8 py-4 ${selectedType === 'seller' ? 'bg-main-yellow' : 'bg-main-gray'} hover:bg-main-yellow text-white font-semibold rounded-md cursor-pointer`}
          value="seller"
          onClick={() => handleTypeClick('seller')}
        >
          강사회원
        </button>
        <input
          type="hidden"
          {...register('type', { required: true })}
          value={selectedType}
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-500 mb-2 font-semibold"
          htmlFor="name"
        >
          이름
        </label>
        <input
          id="name"
          type="name"
          placeholder="이름을 입력하세요"
          className="w-full px-3 py-2 border rounded-md"
          {...register('name', {
            required: '이름을 입력하세요.',
            minLength: {
              value: 2,
              message: '이름을 2글자 이상 입력해주세요.',
            },
          })}
        />
         {isSubmitted && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div className="mb-8">
        <div className="flex justify-between ">
          <label
            className="block text-gray-500 mb-2 font-semibold pt-2"
            htmlFor="email"
          >
            이메일
          </label>
          <div className="flex align-bottom mb-2">
            <Button size="sm" radius="lg" onClick={handleEmailValidationClick}>
              중복확인
            </Button>
          </div>
        </div>
        <input
          id="email"
          type="email"
          placeholder="이메일을 입력하세요"
          className="w-full px-3 py-2 border rounded-md"
          {...register('email', {
            required: '이메일은 필수 입니다.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '이메일 형식이 아닙니다.',
            },
          })}
        />
         {isSubmitted && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div className="mb-8">
        <label
          className="block text-gray-500 mb-2 font-semibold"
          htmlFor="password"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="w-full px-3 py-2 border rounded-md"
          {...register('password', { required: '비밀번호를 입력하세요' })}
        />
        {isSubmitted && errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div className="mb-8">
        <label
          className="block text-gray-500 mb-2 font-semibold"
          htmlFor="attach"
        >
          프로필 이미지
        </label>
        <div className="w-50 h-50 border rounded-md ">
          <input
            type="file"
            id="attach"
            accept="image/*"
            placeholder="이미지를 선택하세요"
            className="w-full px-3 py-2 border rounded-lg"
            {...register('attach', {
              required: selectedType === 'seller' ? '이미지는 필수입니다.' : false,
            })}

          />
        </div>
        {isSubmitted && errors.attach && <p className="text-red-500 text-sm mt-1">{errors.attach.message}</p>}
      </div>
      {selectedType === 'seller' && (
        <div className="mb-8">
           <label
          className="block text-gray-500 mb-2 font-semibold"
          htmlFor="address"
        >
          자기소개
        </label>
        <div className="w-50 h-50 border rounded-md ">
          <textarea {...register('address', { required: '강사 소개는 필수입니다.' })}
          placeholder='강사님의 소개를 적어주세요'
          className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        {isSubmitted && errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>
      )}

      <div className="mt-10 flex justify-center items-center">
        <Submit className="w-full px-3 py-4 bg-main-green hover:bg-main-yellow text-white font-semibold rounded-md">
          회원가입
        </Submit>
      </div>
    </form>
      <div className="flex items-center my-4 mt-10 ">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="mx-4 text-gray-400 text-xl font-semibold">
          간편 회원가입
        </span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex justify-center space-x-12 my-4 mt-6 mb-10">
        <button onClick={() => signUpWithNaver()}>
          <img
            src="/images/naver-login.svg"
            alt="Naver"
            className="h-10 w-10 cursor-pointer"
          />
        </button>

        <button type="submit" onClick={()=> signUpWithKaKao()}>
          <img
            src="/images/kakao-talk.svg"
            alt="KakaoTalk"
            className="h-10 w-10 cursor-pointer"
          />
        </button>

        <button onClick={()=> signUpWithGoogle()}>
          <img
            src="/images/google-login.svg"
            alt="Google"
            className="h-10 w-10 cursor-pointer"
          />
          
        </button>
      </div>
      </>
  );
}

export default Signupform;
