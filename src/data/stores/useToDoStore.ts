import { create, State, StateCreator } from 'zustand'

import { generateId } from '../helpers'

interface Task {
  id: string
  title: string
  createdAt: number
}

interface ToDoStore {
  tasks: Task[]
  createTask: (title: string) => void
  updateTask: (id: string, title: string) => void
  removeTask: (id: string) => void
}

function isTodoStore(object: any): object is ToDoStore {
  return 'tasks' in object
}

const localStorageUpdate =
  <T extends State>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (nextState, ...args) => {
        if (isTodoStore(nextState)) window.localStorage.setItem('tasks', JSON.stringify(nextState.tasks))
        set(nextState, ...args)
      },
      get,
      api,
    )

const getCurrentState = () => {
  try {
    const currentState = JSON.parse(window.localStorage.getItem('tasks') || '[]') as Task[]
    return currentState
  } catch (e) {
    window.localStorage.setItem('tasks', '[]')
  }

  return []
}

export const useToDoStore = create<ToDoStore>(
  localStorageUpdate((set, get) => ({
    tasks: getCurrentState(),
    createTask: title => {
      const { tasks } = get()
      const newTask = {
        id: generateId(),
        title,
        createdAt: Date.now(),
      }
      set({ tasks: [newTask, ...tasks] })
    },
    updateTask: (id, title) => {
      const { tasks } = get()
      set({
        tasks: tasks.map(task => (task.id === id ? { ...task, title } : task)),
      })
    },
    removeTask: id => {
      const { tasks } = get()
      set({
        tasks: tasks.filter(task => task.id !== id),
      })
    },
  })),
)
