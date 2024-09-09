import Icon from "@cms/components/Icon";
import { useIntersectionObserver } from "@cms/hooks/useIntersectionObserver";
import cls from "classnames";
import { useCombobox } from "downshift";
import React, { PropsWithChildren } from "react";

interface ComboBoxProps<T> {
  id: string;
  items: T[];
  itemRender: (item: T) => React.ReactNode;
  onInputValueChange?: (val: string) => void;
  itemToString: (item: T | null) => string;
  selectedItem?: T | null;
  setSelectedItem?: (selectedItem: T) => void;
  label?: string;
  inputPlaceholder?: string;
  hasNextPage?: boolean;
  handleLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const ComboBox = <T extends object>({
  id,
  items,
  itemRender,
  onInputValueChange,
  itemToString,
  selectedItem,
  setSelectedItem,
  label,
  inputPlaceholder,
  hasNextPage,
  handleLoadMore,
  isLoadingMore,
}: PropsWithChildren<ComboBoxProps<T>>) => {
  const { ref: observerRef } = useIntersectionObserver({
    threshold: 0.5,
    onChange: (isIntersecting) => {
      if (isIntersecting && !isLoadingMore && handleLoadMore) {
        handleLoadMore();
      }
    },
  });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      if (onInputValueChange) onInputValueChange(inputValue);
    },
    items,
    itemToString: itemToString,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) =>
      setSelectedItem && setSelectedItem(newSelectedItem),
  });

  return (
    <div>
      <div className="flex flex-col gap-1">
        {label && (
          <label className="w-fit" {...getLabelProps()}>
            {label}
          </label>
        )}
        <div className="flex shadow-sm gap-0.5 join border border-base-content/20">
          <input
            placeholder={inputPlaceholder}
            className="input w-full join-item"
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="button w-12 shrink-0 flex justify-center items-center join-item"
            type="button"
            {...getToggleButtonProps()}
          >
            {isOpen ? (
              <Icon iconName="chevronUp" />
            ) : (
              <Icon iconName="chevronDown" />
            )}
          </button>
        </div>
      </div>
      <ul
        className={`absolute w-full mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 shadow ${
          !(isOpen && items.length) && "hidden"
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cls(
                highlightedIndex === index && "bg-secondary text-black",
                selectedItem === item && "font-bold",
                "py-2 px-3 shadow-sm flex flex-col",
                "bg-base-100"
              )}
              key={`combobox-${id}-${index}`}
              {...getItemProps({ item, index })}
            >
              {itemRender(item)}
            </li>
          ))}
        {hasNextPage && (
          <li ref={observerRef}>
            {isLoadingMore && (
              <span className="loading loading-bars loading-sm"></span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};
