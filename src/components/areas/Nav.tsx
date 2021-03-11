import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Nav.css";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import ReactModal from "react-modal";
import SideBarMenus from "./sidebar/SideBarMenus";
import { Link } from "react-router-dom";

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { width } = useWindowDimensions();

  const onClickToggle = (e: React.MouseEvent<Element, MouseEvent>) => {
    setShowMenu(!showMenu);
  };
  
  const getMobileMenu = () => {
    if (width <= 768) {
      return (
        <FontAwesomeIcon
          onClick={onClickToggle}
          icon={faBars}
          size="lg"
          className="nav-mobile-menu"
        />
      );
    }
    return null;
  };


  // Press 'ESC' or click whitespace to close modal
  const onRequestClose = (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    setShowMenu(false);
  };

  return (
    <React.Fragment>
      <ReactModal
        className="modal-menu"
        isOpen={showMenu}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
      >
        <SideBarMenus />
      </ReactModal>
      <nav>
        {getMobileMenu()}
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          <strong>SuperForum</strong>
        </Link>
      </nav>
    </React.Fragment>
  );
};

export default Nav;
