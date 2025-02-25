import QnaForm from './QnaForm';
import { fetchQnaLecturelist } from '@/data/fetchMypage';

async function page({ searchParams }: { searchParams: URLSearchParams }) {
  const prodId = Object.keys(searchParams)[0];

  const data = await fetchQnaLecturelist();
  const productData = data?.item?.flatMap(item => item.products);

  // const list = data?.item?.map((item, index) => (
  //   <OrderSaleList key={index} item={item} />
  // ));

  return <QnaForm product={productData} prodId={Number(prodId)} />;
}

export default page;
