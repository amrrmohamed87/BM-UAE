import Select from "react-select";
import "../CSS/Select.css";
import { motion } from "framer-motion";
import React from "react";

export const Filter = ({
  uniqueFirstOptions,
  uniqueFirstQueue,
  setUniqueFirstQueue,
  firstPlaceHolder,
  uniqueSecondOptions,
  uniqueSecondQueue,
  setUniqueSecondQueue,
  secondPlaceHolder,
  uniqueThirdOptions,
  uniqueThirdQueue,
  setUniqueThirdQueue,
  ThirdPlaceHolder,
  children,
}) => {
  const selectInputs = [
    <Select
      key="uniqueFirstSelect"
      options={uniqueFirstOptions}
      value={uniqueFirstOptions.find(
        (option) => option.value === uniqueFirstQueue
      )}
      onChange={(option) => setUniqueFirstQueue(option && option.value)}
      isClearable
      className="w-full"
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      placeholder={firstPlaceHolder}
    />,
    <Select
      key="uniqueSecondSelect"
      options={uniqueSecondOptions}
      value={uniqueSecondOptions.find(
        (option) => option.value === uniqueSecondQueue
      )}
      onChange={(option) => setUniqueSecondQueue(option && option.value)}
      isClearable
      className="w-full"
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      placeholder={secondPlaceHolder}
    />,
    <Select
      key="uniqueThirdSelect"
      options={uniqueThirdOptions}
      value={uniqueThirdOptions.find(
        (option) => option.value === uniqueThirdQueue
      )}
      onChange={(option) => setUniqueThirdQueue(option && option.value)}
      isClearable
      className="w-full"
      classNamePrefix="react-select"
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      placeholder={ThirdPlaceHolder}
    />,
  ];

  if (children) {
    const newSelectInput = React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        key: `child - ${index}`,
        className: `${child.props.className} w-full`,
      })
    );

    selectInputs.push(newSelectInput);
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      style={{ overflow: "hidden" }}
      className="flex justify-between gap-6"
    >
      {selectInputs}
    </motion.div>
  );
};

export default Filter;
