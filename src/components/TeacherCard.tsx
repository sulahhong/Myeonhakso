'use client';

import TeacherInfo from '@/components/TeacherInfo';
import { ITeacher } from '@/types';
import { IBookmark } from '@/types/lecture';
import Link from 'next/link';
import { useState } from 'react';

const SERVER = process.env.NEXT_PUBLIC_API_SERVER;

export interface ICardItem {
  _id: number;
  extra?: {
    type: string;
  };
}

export interface ICardProp {
  item: (ITeacher | IBookmark) & ICardItem;
}

export default function TeacherCard({ item }: ICardProp) {
  const [buttonState, setButtonState] = useState<boolean>(false);

  const setSharePopupState = () => {
    setButtonState(!buttonState);
  };

  let bgColorClass;
  let iconClass;

  return (
    // <Link
    //   href={`/${item?.extra?.type}/${item?._id}`}
    //   className={`bg-gray-10 flex rounded-xl items-center w-[80%] min-w-[150px] h-[90%] border border-gray-10`}
    // >
    <>
      {buttonState && (
        <TeacherInfo
          item={item}
          buttonState={buttonState}
          setButtonState={setButtonState}
        />
      )}
      <div className="w-full cursor-pointer" onClick={setSharePopupState}>
        <div className="w-full">
          <div className="min-w-34 h-36 rounded-xl ">
            <img
              src={`${SERVER}/${
                (item as IBookmark)?.user?.image ||
                (item as ITeacher)?.image ||
                ''
              }`}
              className="w-full h-full object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/lecture-default.jpg';
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col min-w-[30%] w-full h-36 px-3">
        <h4 className="m-auto font-semibold text-md w-full h-[50%] sm:text-sm text-center">
          {(item as IBookmark)?.user?.name || (item as ITeacher)?.name}
          <p className="font-light">선생님</p>
        </h4>
        <p className="text-sm mb-auto h-28 pt-2 box-border line-clamp-5 sm:text-xs">
          {(item as IBookmark)?.user?.address || (item as ITeacher)?.address}
        </p>
      </div>
      {/* </Link> */}
    </>
  );
}
