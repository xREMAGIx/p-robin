import { useStore } from "@nanostores/react";
import { addProductToCart } from "@stores/cartStore";
import { $getProductDetail } from "@stores/productStore";
import React, { useState } from "react";

const imgList = [
  {
    id: "item-1",
    src: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  },
  {
    id: "item-2",
    src: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  },
  {
    id: "item-3",
    src: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  },
  {
    id: "item-4",
    src: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
  },
];

const sizeList = [
  {
    id: "s",
    label: "S",
  },
  {
    id: "m",
    label: "M",
  },
  {
    id: "l",
    label: "L",
  },
  {
    id: "xl",
    label: "XL",
  },
  {
    id: "2XL",
    label: "2XL",
  },
];

const colorList = [
  {
    id: "red",
    label: "Red",
  },
  {
    id: "blue",
    label: "Blue",
  },
  {
    id: "green",
    label: "Green",
  },
  {
    id: "white",
    label: "White",
  },
  {
    id: "black",
    label: "Black",
  },
];

export interface ProductDetailProps {
  id: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id }) => {
  const [$products] = useState(
    $getProductDetail({
      id,
    })
  );

  const { data, loading, error } = useStore($products);

  const handleAddToCart = () => {
    addProductToCart({
      id: Math.random(),
      createdAt: "2024-08-07T04:12:10.226Z",
      updatedAt: "2024-08-07T04:12:10.226Z",
      name: "product 3",
      description: null,
      barcode: "345",
      price: 200000,
      salePrice: 100000,
      costPrice: 8,
      createdByUserId: 1,
      updatedByUserId: 1,
      status: 0,
    });
  };

  const isFirstLoad = loading && !data;

  if (isFirstLoad || !data) {
    return (
      <div className="c-productDetail">
        {/* Carousel */}
        <div className="carousel w-full">
          {imgList.map((ele) => (
            <div id={ele.id} key={ele.id} className="carousel-item w-full">
              <div className="skeleton aspect-square w-full"></div>
            </div>
          ))}
        </div>
        <div className="carousel gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <a key={`skeleton-img-${idx}`} href={`#${idx}`}>
              <div className="carousel-item">
                <div className="skeleton w-full h-20 aspect-square "></div>
              </div>
            </a>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8">
          <div className="skeleton h-20 w-full"></div>
          <div className="skeleton mt-1 h-4 w-40"></div>
          <div className="mt-4">
            <div className="skeleton w-60 h-10"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="skeleton h-7 w-32"></div>
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-4 w-10"></div>
          </div>
          <p className="mt-4 font-bold">Size</p>
          <div className="mt-2 flex gap-2 overflow-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-size-${idx}`}
                className="skeleton h-4 w-16"
              ></div>
            ))}
          </div>
          <p className="mt-4 font-bold">Color</p>
          <div className="mt-2 flex gap-2 overflow-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`skeleton-size-${idx}`}
                className="skeleton h-4 w-16"
              ></div>
            ))}
          </div>
          <p className="mt-4 font-bold">Quantity</p>
          <div className="skeleton h-10 w-40"></div>
          <div className="divider my-4" />
          <div className="flex gap-2">
            <div className="skeleton h-10 flex-1"></div>
            <div className="skeleton h-10 flex-1"></div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <p className="font-bold">Description</p>
          <div className="mt-2">
            <div className="skeleton h-80 w-full"></div>
          </div>
        </div>

        {/* Rating */}
        <div className="divider" />
        <div className="mt-8 flex gap-2 justify-between items-center">
          <div className="skeleton w-40 h-10"></div>
          <div className="skeleton w-32 h-10"></div>
        </div>

        {/* Comment */}
        <div className="mt-8">
          <p className="mb-2 font-bold">Comment</p>

          <div className="skeleton w-full h-40"></div>
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="c-productDetail">
      {/* Carousel */}
      <div className="carousel w-full">
        {imgList.map((ele) => (
          <div id={ele.id} key={ele.id} className="carousel-item w-full">
            <img src={ele.src} className="w-full aspect-square object-cover" />
          </div>
        ))}
      </div>
      <div className="carousel gap-2">
        {imgList.map((ele) => (
          <a key={ele.id} href={`#${ele.id}`}>
            <div className="carousel-item">
              <img src={ele.src} className="aspect-square object-cover" />
            </div>
          </a>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">{data.data.name}</h2>
        <span className="mt-1 text-sm">Barcode: {data.data.barcode}</span>
        <div className="mt-4">
          <div className="rating">
            <input type="radio" name="rating-1" className="mask mask-star" />
            <input
              type="radio"
              name="rating-1"
              className="mask mask-star"
              defaultChecked
            />
            <input type="radio" name="rating-1" className="mask mask-star" />
            <input type="radio" name="rating-1" className="mask mask-star" />
            <input type="radio" name="rating-1" className="mask mask-star" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {data.data.salePrice ? (
            <>
              <b className="text-secondary text-3xl">{data.data.salePrice} </b>
              <span className="line-through">{data.data.price}</span>
              <span className="badge badge-error">
                -
                {Number((data.data.salePrice / data.data.price).toFixed(2)) *
                  100}
                %
              </span>
            </>
          ) : (
            <b className="text-secondary">{data.data.price}</b>
          )}
        </div>
        <p className="mt-4 font-bold">Size</p>
        <div className="mt-2 flex gap-2 overflow-auto">
          {sizeList.map((ele) => (
            <button
              key={ele.id}
              className="badge badge-primary badge-outline min-w-16"
            >
              {ele.label}
            </button>
          ))}
        </div>
        <p className="mt-4 font-bold">Color</p>
        <div className="mt-2 flex gap-2 overflow-auto">
          {colorList.map((ele) => (
            <button
              key={ele.id}
              className="badge badge-primary badge-outline min-w-16"
            >
              {ele.label}
            </button>
          ))}
        </div>
        <p className="mt-4 font-bold">Quantity</p>
        <div className="mt-2 join">
          <button className="btn w-12 join-item">-</button>
          <input className="input max-w-12 join-item" value={1} />
          <button className="btn w-12 join-item">+</button>
        </div>
        <div className="divider my-4" />
        <div className="flex gap-2">
          <button
            className="flex-1 btn btn-secondary"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
          <button className="flex-1 btn btn-primary">Buy now</button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <p className="font-bold">Description</p>
        <div className="mt-2">{data.data.description}</div>
      </div>

      {/* Rating */}
      <div className="divider" />
      <div className="mt-8 flex gap-2 justify-between items-center">
        <div className="rating">
          <input type="radio" name="rating-1" className="mask mask-star" />
          <input
            type="radio"
            name="rating-1"
            className="mask mask-star"
            defaultChecked
          />
          <input type="radio" name="rating-1" className="mask mask-star" />
          <input type="radio" name="rating-1" className="mask mask-star" />
          <input type="radio" name="rating-1" className="mask mask-star" />
        </div>
        <button className="btn btn-primary btn-outline">Write rating</button>
      </div>

      {/* Comment */}
      <div className="mt-8">
        <p className="mb-2 font-bold">Comment</p>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <div className="chat-header">
            Obi-Wan Kenobi
            <time className="ml-1 text-xs opacity-50">12:45</time>
          </div>
          <div className="chat-bubble">
            It was said that you would, destroy the Sith, not join them.
          </div>
          <button className="mt-2 btn btn-outline btn-sm">reply</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
