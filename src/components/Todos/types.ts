export type TodoModel = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type DeleteTodoConfirmationModalState = {
  show: boolean;
  todoId: number;
};

export type TodoEditModalState = {
  show: boolean;
  todoId: number;
  title: string;
};

export type AddNewTodoModalState = {
  show: boolean;
};
