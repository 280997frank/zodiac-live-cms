import { Button, Flex, Grid, Input } from "@chakra-ui/react";
import React, { ChangeEventHandler, FC, MouseEventHandler } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface PaginationProps {
  onPrevClick: MouseEventHandler<HTMLButtonElement>;
  onNextClick: MouseEventHandler<HTMLButtonElement>;
  total: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  currentPage?: number;
}

const Pagination: FC<PaginationProps> = ({
  onPrevClick,
  onNextClick,
  total,
  onChange,
  currentPage,
  ...props
}) => {
  return (
    <Flex width="100%" justifyContent="flex-end">
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={1}
        justifyItems="center"
        alignItems="center"
      >
        <Button onClick={onPrevClick}>
          <BsChevronLeft />
        </Button>
        <div style={{ width: "3rem" }}>
          <Input
            size="sm"
            value={currentPage === undefined ? 1 : currentPage}
            name="page"
            textAlign="center"
            onChange={onChange}
          />
        </div>
        <span>of {total}</span>
        <Button onClick={onNextClick}>
          <BsChevronRight />
        </Button>
      </Grid>
    </Flex>
  );
};

export default Pagination;
