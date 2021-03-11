import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoryThread from "../../../models/CategoryThread";
import "./TopCategory.css";

interface TopCategoryProps {
  topCategories: Array<CategoryThread>;
}

const TopCategory: FC<TopCategoryProps> = ({ topCategories }) => {
  const [threads, setThreads] = useState<JSX.Element | undefined>();

  useEffect(() => {
    if (topCategories && topCategories.length > 0) {
      const newThreadElements = topCategories.map((top) => (
        <li key={top.threadId}>
          <span className="clickable-span">
            <Link to={`/thread/${top.threadId}`} className="topcat-link">
              {top.title}
            </Link>
          </span>
        </li>
      ));

      setThreads(<ul className="topcat-threads">{newThreadElements}</ul>);
    }
  }, [topCategories]);

  return (
    <div className="topcat-item-container">
      <div>
        <strong>{topCategories[0].categoryName}</strong>
      </div>
      {threads}
    </div>
  );
};

export default TopCategory;
