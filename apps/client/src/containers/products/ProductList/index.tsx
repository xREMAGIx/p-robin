import { ROUTE } from "@config/enums";
import { useStore } from "@nanostores/react";
import { $getProductList } from "@stores/productStore";
import React, { useState } from "react";

export interface ProductListProps {}

interface ProductListPageProps {
  offset: number;
}

const LIMIT_PAGINATION = 12;

const ProductListPage: React.FC<ProductListPageProps> = ({ offset }) => {
  const [renderNext, setRenderNext] = useState(false);

  const [$products] = useState(
    $getProductList({
      limit: LIMIT_PAGINATION,
      offset: offset,
    })
  );

  const { data, loading, error } = useStore($products);

  const isFirstLoad = loading && !data;

  if (isFirstLoad || !data)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={`loading-${index}`} className="flex flex-col gap-4">
            <div className="skeleton aspect-square w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        ))}
      </div>
    );

  if (error) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {data.data.map((product, index) => (
          <div
            key={`product-${product.id}-${index}`}
            className="card card-compact bg-base-100 shadow-xl"
          >
            <a href={`${ROUTE.PRODUCTS}/${product.id}`}>
              <figure>
                <img
                  className="aspect-square w-full object-cover"
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt={product.name}
                />
              </figure>
            </a>
            <div className="card-body">
              <a href={`${ROUTE.PRODUCTS}/${product.id}`}>
                <p className="card-title line-clamp-2">{product.name}</p>
              </a>
              <p className="text-secondary text-lg font-bold">
                {product.price}
              </p>
              <div className="card-actions">
                <button className="btn btn-primary w-full">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        {data.meta.hasMore && (
          <>
            {renderNext ? (
              <ProductListPage offset={offset + LIMIT_PAGINATION} />
            ) : (
              <button
                className="btn btn-secondary w-full"
                onClick={() => setRenderNext(true)}
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

const ProductList: React.FC<ProductListProps> = () => {
  return (
    <div className="c-productList">
      <ProductListPage offset={0} />
    </div>
  );
};

export default ProductList;
