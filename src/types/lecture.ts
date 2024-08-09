import { UserData } from '@/types/user';

export interface Ilecture {
  _id: number;
  seller_id: number;
  price: number;
  shippingFee: number;
  show: boolean;
  active: boolean;
  name: string;
  quantity: number;
  buyQuantity: number;
  mainImages: IlectureImage[];
  createdAt: string;
  updatedAt: string;
  seller: Iseller;
  extra: Pick<ILectureRegister, 'extra'>;
  replies: number;
  bookmarks: number;
  options: number;
  image?: IlectureImage;
}

export interface Iseller {
  _id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  image: string;
  extra: any;
}


export interface Iextra {
  type: string;
  level: string;
  schedule: string[];
  preview: string;
  options: {
    days: string[];
    startTime: Date | null | undefined;
    endTime: Date | null | undefined;
  }[];
  curriculum: { content: string }[];
  address?: string;
  url?: string;
}

export interface IlectureImage {
  path: string;
  name: string;
  originalname: string;
}

export interface ILectureRegister extends Omit<Ilecture, 'extra'> {
  content: string;
  extra: {
    type: string;
    level: string;
    schedule: string[];
    preview: string;
    options: {
      days: string[];
      startTime: Date | null | undefined;
      endTime: Date | null | undefined;
    }[];
    curriculum: { content: string }[];
    address?: string;
    url?: string;
  };
}

export interface ILectureDetail extends Omit<ILectureRegister, 'seller'> {
  seller: {
    _id: string;
    name: string;
    email: string;
    profileImage: string | null | undefined;
  };
}
