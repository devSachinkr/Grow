"use client";
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editorAction";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { FunnelPage } from "@prisma/client";

export type DevicesTypes = "Mobile" | "DeskTop" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | { innerText?: string; href?: string; src?: string };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  device: DevicesTypes;
  previewMode: boolean;
  funnelPageId: string;
  selectedElement: EditorElement;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      name: "Body",
      styles: {},
      type: "__body",
      id: "__body",
    },
  ],
  selectedElement: {
    content: [],
    id: "",
    name: "",
    styles: {},
    type: null,
  },
  device: "DeskTop",
  liveMode: false,
  previewMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT") {
    throw new Error("Wrong action to peform");
  }
  return elements.map((e) => {
    if (e.id === action.payload.containerId && Array.isArray(e.content)) {
      return {
        ...e,
        content: [...e.content, action.payload.elementDetails],
      };
    } else if (e.content && Array.isArray(e.content)) {
      return {
        ...e,
        content: addElement(e.content, action),
      };
    }
    return e;
  });
};

const updateElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") {
    throw new Error("Wrong action to peform");
  }
  return elements.map((e) => {
    if (e.id === action.payload.elementDetails.id) {
      return { ...e, ...action.payload.elementDetails };
    } else if (e.content && Array.isArray(e.content)) {
      return { ...e, content: updateElement(e.content, action) };
    }
    return e;
  });
};

const deleteElement = (
  elements: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT") {
    throw new Error("Wrong action to peform");
  }

  return elements.filter((e) => {
    if (e.id === action.payload.elementDetails.id) {
      return false;
    } else if (e.content && Array.isArray(e.content)) {
      e.content = deleteElement(e.content, action);
    }
    return true;
  });
};
const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction
) => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updateEditorState = {
        ...state.editor,
        elements: addElement(state.editor.elements, action),
      };
      const updateHistory = [
        ...state.history.history.splice(0, state.history.currentIndex + 1),
        { ...updateEditorState },
      ];
      const newEditorState = {
        ...state,
        editor: updateEditorState,
        history: {
          ...state.history,
          history: updateHistory,
          currentIndex: updateHistory.length - 1,
        },
      };
      return newEditorState;
    case "UPDATE_ELEMENT":
      const updateAnElement = updateElement(state.editor.elements, action);
      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;
      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updateAnElement,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate },
      ];
      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };
      return updatedEditor;
    case "DELETE_ELEMENT":
      const deleteAnElement = deleteElement(state.editor.elements, action);
      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: deleteAnElement,
      };
      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateAfterDelete },
      ];

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };
      return deletedState;
    case "CHANGE_CLICKED_ELEMENT":
      const selectedElement = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };
      return selectedElement;
    case "CHANGE_DEVICE":
      const updatedDevice = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device || "DeskTop",
        },
      };
      return updatedDevice;
    case "TOGGLE_PREVIEW_MODE":
      const toggleMode = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };
      return toggleMode;
    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload?.value
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };
      return toggleLiveMode;
    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;
    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIdx = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIdx] };
        const newEditorState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIdx,
          },
        };
        return newEditorState;
      }
      return state;
    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        },
      };
    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;
      const newState = {
        ...state.editor,
        funnelPageId,
      };

      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...newState },
      ];
      const funnelPageIdState = {
        ...state,
        editor: newState,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        },
      };
      return funnelPageIdState;
    default:
      return state;
  }
};

export type EditorContextData = {
  device: DevicesTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DevicesTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: "",
  funnelId: "",
  pageDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  subAccountId: string;
  funnelId: string;
  pageDetails: FunnelPage;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId: props.subAccountId,
        funnelId: props.funnelId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor Hook must be used within the editor Provider");
  }
  return context;
};

export default EditorProvider;
