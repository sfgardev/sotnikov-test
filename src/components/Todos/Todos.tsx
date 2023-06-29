import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useModalState } from "../../hooks/useModalState";
import { usePagination } from "../../hooks/usePagination";
import { useSet } from "../../hooks/useSet";
import useSorting from "../../hooks/useSorting";
import ListWithCheckbox from "../ListWithCheckbox";
import SelectPagination from "../SelectPagination";
import Sorting, { SortByItem } from "../Sorting";
import AddNewTodoModal from "../modals/AddNewTodoModal";
import ConfirmationModal from "../modals/ConfirmationModal";
import TodoEditModal from "../modals/TodoEditModal";
import TodosFilter from "./TodosFilter";
import {
  AddNewTodoModalState,
  DeleteTodoConfirmationModalState,
  TodoEditModalState,
  TodoModel,
} from "./types";

const todosSortByItems: SortByItem[] = [
  { value: "title", label: "Title" },
  { value: "completed", label: "Completed" },
];

export default function Todos() {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState(false);

  const [selectedTodosIdsSet, selectedTodosIdsSetActions] = useSet<number>([]);

  const {
    itemsNumberPerPage: todosNumberPerPage,
    handleChangeItemsNumberPerPage,
  } = usePagination("todosCountOnPage");
  const [completedTodosIds, setCompletedTodosIds] = useLocalStorage<number[]>(
    "completedTodosIds",
    []
  );
  const [completedTodosIdsSet] = useSet<number>(completedTodosIds);

  const [
    deleteTodoConfirmationModalState,
    closeDeleteTodoConfirmationModal,
    updateDeleteTodoConfirmationModalState,
  ] = useModalState<DeleteTodoConfirmationModalState>({
    show: false,
    todoId: -1,
  });

  const [todoEditModalState, closeTodoEditModal, updateTodoEditModalState] =
    useModalState<TodoEditModalState>({
      show: false,
      todoId: -1,
      title: "",
    });

  const [
    addNewTodoModalState,
    closeAddNewTodoModal,
    updateAddNewTodoModalState,
  ] = useModalState<AddNewTodoModalState>({
    show: false,
  });

  const {
    sortBy,
    sortDirection,
    handleChangeSortBy,
    handleChangeSortDirection,
  } = useSorting<"title" | "completed" | "">("completed", "desc");

  const { data: todosApi, isLoading } = useFetch<TodoModel[]>(
    `todos?_limit=${todosNumberPerPage}`
  );

  useEffect(() => {
    if (!todosApi) return;

    setTodos(() =>
      todosApi.map((todo) => {
        return completedTodosIdsSet.has(todo.id)
          ? { ...todo, completed: true }
          : todo;
      })
    );
  }, [completedTodosIdsSet, todosApi]);

  const handleSelectTodo = (todoId: number) => {
    selectedTodosIdsSetActions.has(todoId)
      ? selectedTodosIdsSetActions.delete(todoId)
      : selectedTodosIdsSetActions.add(todoId);
  };

  const handleToggleCompletedTodo = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    todoId: number
  ) => {
    e.stopPropagation();

    setCompletedTodosIds((prev) =>
      completedTodosIdsSet.has(todoId)
        ? prev.filter((completedTodoId) => completedTodoId !== todoId)
        : [...prev, todoId]
    );

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleToggleFilterCompleted = () => {
    setCompleted((prev) => !prev);
  };

  const handleDeleteSelected = () => {
    setTodos((prev) =>
      prev.filter((todo) => !selectedTodosIdsSetActions.has(todo.id))
    );
    selectedTodosIdsSetActions.clear();
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  const handleOpenTodoEditModal = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    title: string,
    todoId: number
  ) => {
    e.stopPropagation();
    updateTodoEditModalState({ title, todoId, show: true });
  };

  const handleEditTodo = (title: string, todoId: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === todoId ? { ...todo, title } : todo))
    );
  };

  const handleAddNewTodo = (title: string) => {
    const newTodo: TodoModel = {
      id: Date.now(),
      userId: 1,
      title,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const filteredTodos = useMemo(() => {
    if (!search && !completed) {
      return todos;
    }
    let newTodos = [...todos];
    if (search) {
      newTodos = newTodos.filter((todo) =>
        todo.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (completed) {
      newTodos = newTodos.filter((todo) => todo.completed);
    }
    return newTodos;
  }, [search, completed, todos]);

  const sortedTodos = useMemo(() => {
    if (sortDirection === "" || sortBy === "") {
      return filteredTodos;
    }

    const newTodos = [...filteredTodos];

    newTodos.sort((a, b) => {
      const value1 = a[sortBy];
      const value2 = b[sortBy];

      if (typeof value1 === "string" && typeof value2 === "string") {
        return sortDirection === "asc"
          ? value1.localeCompare(value2)
          : value2.localeCompare(value1);
      }

      if (typeof value1 === "boolean" && typeof value2 === "boolean") {
        return sortDirection === "desc" ? +value1 - +value2 : +value2 - +value1;
      }

      return 0;
    });

    return newTodos;
  }, [filteredTodos, sortDirection, sortBy]);

  if (!todosApi || isLoading) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}
      />
    );
  }

  return (
    <>
      <AddNewTodoModal
        onClose={closeAddNewTodoModal}
        onAddNewTodo={handleAddNewTodo}
        {...addNewTodoModalState}
      />
      <TodoEditModal
        onClose={closeTodoEditModal}
        onEditTodo={handleEditTodo}
        {...todoEditModalState}
      />
      <ConfirmationModal
        open={deleteTodoConfirmationModalState.show}
        text={"Are you sure you want to delete?"}
        onClose={closeDeleteTodoConfirmationModal}
        onConfirm={() => {
          selectedTodosIdsSet.size > 0
            ? handleDeleteSelected()
            : handleDeleteTodo(deleteTodoConfirmationModalState.todoId);

          updateDeleteTodoConfirmationModalState({
            show: false,
          });
        }}
      />
      <SelectPagination
        itemsPerPage={todosNumberPerPage}
        onChangeItemsPerPage={handleChangeItemsNumberPerPage}
      />
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => updateAddNewTodoModalState({ show: true })}
      >
        Add post
      </Button>
      <Sorting
        sortBy={sortBy}
        sortDirection={sortDirection}
        sortByItems={todosSortByItems}
        onChangeSortBy={handleChangeSortBy}
        onChangeSortDirection={handleChangeSortDirection}
      />
      <TodosFilter
        search={search}
        completed={completed}
        onSearch={handleSearch}
        onToggleCompleted={handleToggleFilterCompleted}
      />
      <ListWithCheckbox
        selectedItemsSet={selectedTodosIdsSet}
        items={sortedTodos}
        showBulkFavoriteAction={false}
        onSelectItem={handleSelectTodo}
        onOpenAddToFavoriteConfirmationModal={() => undefined}
        onOpenDeleteConfirmationItemModal={() =>
          updateDeleteTodoConfirmationModalState({ show: true })
        }
        renderPrimary={(todo) => (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              fontWeight={700}
              sx={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={(e) => handleToggleCompletedTodo(e, todo.id)}
            >
              {todo.title}
            </Typography>

            <Box>
              <IconButton
                aria-label="edit"
                onClick={(e) => handleOpenTodoEditModal(e, todo.title, todo.id)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  updateDeleteTodoConfirmationModalState({
                    show: true,
                    todoId: todo.id,
                  });
                }}
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            </Box>
          </Stack>
        )}
        renderSecondary={() => null}
      />
    </>
  );
}
