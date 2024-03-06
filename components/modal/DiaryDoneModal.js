import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { useState } from "react";

const DiaryDoneModal = ({Open}) => {
  const [isOpen, setIsOpen] = useState(false);
setIsOpen(open);

  return (
    <div className="absolute w-full h-screen top-60 left-48 px-4 py-64  grid place-content-center">
      <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};



export default DiaryDoneModal;