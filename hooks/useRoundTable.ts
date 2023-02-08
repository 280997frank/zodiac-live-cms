import { useState, useEffect, useMemo, useCallback } from "react";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import dayjs from "dayjs";
import cloneDeep from "lodash/cloneDeep";

type SeasonList = {
  id: string;
  title: string;
  hostName: string;
  startDate: string;
  isPasswordActive: boolean;
  capacity: string;
  isActive: boolean;
};

type RoundTableResponse = {
  roundTable: {
    page: number;
    totalPage: number;
    list: SeasonList[];
  };
};

type RoundtableVariables = {
  query?: string;
  startDate?: string;
  page: number;
};

type MutationReturn = {
  return: {
    updatedAt: number;
  };
};

export enum RoundTableCapacityTypes {
  TWO = "TWO",
  FOUR = "FOUR",
  EIGHT = "EIGHT",
  SIXTEEN = "SIXTEEN",
}

export const RoundTableCapacityList = [
  {
    label: "2",
    value: RoundTableCapacityTypes.TWO,
  },
  {
    label: "4",
    value: RoundTableCapacityTypes.FOUR,
  },
  {
    label: "8",
    value: RoundTableCapacityTypes.EIGHT,
  },
  {
    label: "16",
    value: RoundTableCapacityTypes.SIXTEEN,
  },
];

const ROUNDTABLE_QUERY = gql`
  query fetchRoundTable(
    $query: String = null
    $startDate: String = null
    $page: Int
  ) {
    roundTable: listSession(
      listSessionInput: {
        filter: { locationType: ROUNDTABLE, startDate: $startDate }
        search: { title: $query }
        page: $page
        limit: 10
      }
    ) {
      page
      totalPage
      list: sessions {
        id
        title
        hostName
        startDate
        isPasswordActive
        capacity
        isActive
      }
    }
  }
`;

const ROUNDTABLE_UPDATE_PASSWORD_MUTATION = gql`
  mutation updatePassword($id: ID!, $isActive: Boolean!) {
    return: togglePasswordRoundtable(
      toggleStatusRoundtableInput: { id: $id, active: $isActive }
    ) {
      updatedAt
    }
  }
`;

const ROUNDTABLE_UPDATE_CAPACITY_MUTATION = gql`
  mutation updateCapacity($id: ID!, $capacity: SessionCapacityType!) {
    return: changeCapacityRoundtable(
      changeCapacityRoundtableInput: { id: $id, capacity: $capacity }
    ) {
      updatedAt
    }
  }
`;

const ROUNDTABLE_UPDATE_ACTIVE_STATUS_MUTATION = gql`
  mutation updateActiveStatus($id: String!, $isActive: Boolean!) {
    return: publishSession(
      publishSessionInput: { id: $id, isActive: $isActive }
    ) {
      updatedAt
    }
  }
`;

const ROUNDTABLE_DELETE_MUTATION = gql`
  mutation deleteRoundTable($id: String!) {
    return: deleteSession(id: $id) {
      updatedAt
    }
  }
`;

const useRoundTable = () => {
  const [list, setList] = useState<SeasonList[]>([]);
  const [
    fetchRoundTable,
    { loading: isFetching, data, error: isFetchingError },
  ] = useLazyQuery<RoundTableResponse, RoundtableVariables>(ROUNDTABLE_QUERY, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      const dataList = data?.roundTable?.list ?? [];
      setList(dataList);
      setSearchingStatus(false);
    },
  });

  const totalPage = useMemo(() => data?.roundTable?.totalPage ?? 10, [data]);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Date>(
    dayjs(new Date()).subtract(1, "month").toDate()
  );
  const startDateString = useMemo(
    () => dayjs(startDate).format("YYYY-MM-DD"),
    [startDate]
  );
  const [searchQuery, setSearchQuery] = useState<string>();
  const [isSearching, setSearchingStatus] = useState(false);

  // Date filter
  const filterByStartDate = useCallback((startDate: Date) => {
    setList([]);
    setStartDate(startDate);
  }, []);

  // Searching
  const searchRoundTable = useCallback((query: string) => {
    setList([]);
    setSearchingStatus(true);
    setSearchQuery(query);
  }, []);

  /**
   * Update mutation
   */
  const [mutationId, setMutationId] = useState<string>();

  // Update password
  const [
    updatePasswordMutation,
    { loading: isUpdatingPasswordActive, error: isUpdatePasswordError },
  ] = useMutation<MutationReturn>(ROUNDTABLE_UPDATE_PASSWORD_MUTATION);
  const togglePassword = useCallback(
    async (id: string) => {
      const findItem = list.find((item) => item.id === id);
      if (!findItem) {
        return;
      }

      const isPasswordActive = !findItem.isPasswordActive;

      setMutationId(id);
      await updatePasswordMutation({
        variables: {
          id,
          isActive: isPasswordActive,
        },
      });

      setList(
        cloneDeep(list).map((item) => {
          if (item.id === id) {
            item.isPasswordActive = isPasswordActive;
          }
          return item;
        })
      );
      setMutationId("");
    },
    [updatePasswordMutation, list]
  );

  // Update capacity
  const [
    updateCapacityMutation,
    { loading: isUpdatingCapacity, error: isUpdateCapacityError },
  ] = useMutation<MutationReturn>(ROUNDTABLE_UPDATE_CAPACITY_MUTATION);
  const updateCapacity = useCallback(
    async (id: string, capacity: RoundTableCapacityTypes | string) => {
      setMutationId(id);
      await updateCapacityMutation({
        variables: {
          id,
          capacity: capacity as RoundTableCapacityTypes,
        },
      });

      setList(
        cloneDeep(list).map((item) => {
          if (item.id === id) {
            item.capacity = capacity;
          }
          return item;
        })
      );
      setMutationId("");
    },
    [updateCapacityMutation, list]
  );

  // Update password
  const [
    updateActiveStatusMutation,
    { loading: isUpdatingActiveStatus, error: isUpdateActiveStatusError },
  ] = useMutation<MutationReturn>(ROUNDTABLE_UPDATE_ACTIVE_STATUS_MUTATION);
  const toggleActiveStatus = useCallback(
    async (id: string) => {
      const findItem = list.find((item) => item.id === id);
      if (!findItem) {
        return;
      }

      const isActive = !findItem.isActive;

      setMutationId(id);
      await updateActiveStatusMutation({
        variables: {
          id,
          isActive: isActive,
        },
      });

      setList(
        cloneDeep(list).map((item) => {
          if (item.id === id) {
            item.isActive = isActive;
          }
          return item;
        })
      );
      setMutationId("");
    },
    [updateActiveStatusMutation, list]
  );

  // Delete row
  const [deleteMutation, { loading: isDeleting, error: isDeleteError }] =
    useMutation<MutationReturn>(ROUNDTABLE_DELETE_MUTATION);
  const deleteRoundTable = useCallback(async () => {
    await deleteMutation({
      variables: {
        id: mutationId,
      },
    });
    setList(cloneDeep(list).filter((item) => item.id !== mutationId));
    setMutationId("");
  }, [mutationId, deleteMutation, list]);

  // Pagination
  const prevPage = useCallback(() => {
    setPage((page) => {
      if (page === 0) return page;
      return page - 1;
    });
  }, []);

  const nextPage = useCallback(() => {
    setPage((page) => {
      if (page === totalPage) return page;
      return page + 1;
    });
  }, [totalPage]);

  const changePageNumber = useCallback(
    (page: number) => {
      const isValidPage = page >= 0 && page <= totalPage;
      if (!isValidPage) return;
      setPage(page);
    },
    [totalPage]
  );

  // Compound errors
  const error = useMemo<Error | undefined>(
    () =>
      isFetchingError ||
      isUpdatePasswordError ||
      isUpdateCapacityError ||
      isUpdateActiveStatusError ||
      isDeleteError,
    [
      isFetchingError,
      isUpdatePasswordError,
      isUpdateCapacityError,
      isUpdateActiveStatusError,
      isDeleteError,
    ]
  );

  useEffect(() => {
    fetchRoundTable({
      variables: {
        query: searchQuery,
        startDate: startDateString,
        page,
      },
    });
  }, [fetchRoundTable, page, startDateString, searchQuery]);

  return {
    list,
    error,
    startDate,
    fetchRoundTable,
    togglePassword,
    updateCapacity,
    toggleActiveStatus,
    deleteRoundTable,
    searchRoundTable,
    setStartDate,
    filterByStartDate,
    isFetching,
    isUpdatingPasswordActive,
    isUpdatingCapacity,
    isUpdatingActiveStatus,
    isDeleting,
    isSearching,
    mutationId,
    setMutationId,
    page,
    setPage,
    totalPage,
    prevPage,
    nextPage,
    changePageNumber,
  };
};

export default useRoundTable;
