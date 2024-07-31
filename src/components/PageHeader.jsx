import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArchiveRestore, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

export const PageHeader = ({
  title,
  subTitle,
  isLoadingState,
  data,
  cardOneTitle,
  cardOneTextLink,
  cardOneLink,
  iconOne,
  cardTwoTitle,
  cardTwoTextLink,
  cardTwoLink,
  iconTwo,
  children,
}) => {
  const cards = [
    <div
      className="bg-white p-2 border shadow-md rounded-md w-full"
      key="card1"
    >
      <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
        {iconOne} {cardOneTitle}
      </h1>
      <div className="mb-3 text-neutral-900 font-semibold text-[28px]">
        {isLoadingState ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
            style={{ display: "inline-block" }}
          >
            <Loader className="text-black" />
          </motion.div>
        ) : (
          data.length
        )}
      </div>
      <Link
        to={cardOneLink}
        className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
      >
        {cardOneTextLink} <ArrowRight size={16} className="mt-1" />
      </Link>
    </div>,
    <div
      className="bg-white p-4 border shadow-md rounded-md w-full"
      key="card2"
    >
      <h1 className="flex items-center gap-1 text-[16px] text-neutral-400 mb-2">
        {iconTwo} {cardTwoTitle}
      </h1>
      <div className="mb-3 text-neutral-900 font-semibold text-[18px]">
        {cardTwoTextLink}
      </div>
      <Link
        to={cardTwoLink}
        className="flex justify-end items-center gap-1 text-blue-500 transition-all duration-300 hover:underline"
      >
        {cardTwoTextLink} <ArrowRight size={16} className="mt-1" />
      </Link>
    </div>,
  ];

  if (children) {
    const newCard = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        className: `${child.props.className} bg-white p-2 border shadow-md rounded-md w-full`,
      })
    );

    cards.push(newCard);
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row justify-center md:justify-start items-center md:gap-16">
      <div className="flex flex-col items-start w-full">
        <h1 className="text-3xl text-neutral-900">{title}</h1>
        <p className="text-sm text-neutral-500 mt-1">{subTitle}</p>
      </div>

      {cards}
    </div>
  );
};
