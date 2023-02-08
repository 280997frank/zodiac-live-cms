import { FC } from "react";
import { List, Box } from "@chakra-ui/react";
import s from "shortid";

import NavItem, { NavItemProps } from "@/components/Atoms/NavItem";

type NavbarProps = {
  menu: NavItemProps[];
};

const Navbar: FC<NavbarProps> = ({ menu }) => {
  return (
    <Box>
      <List>
        {menu.map((item: NavItemProps) => {
          return <NavItem key={s.generate()} {...item} />;
        })}
      </List>
    </Box>
  );
};

export default Navbar;
