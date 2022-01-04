import * as React from "react"
interface Props {
    children: any
}

const FormStateContext = React.createContext()
const FormDispatchContext  = React.createContext()
const initialState = {
  user: {
    values: {first_name: 'First Name', birthday: "28", gender: 'F', sports: "squash", image_set: "image_02.png", game_level: "intermediate"},
    errors: {},
  },
};

const formReducer = (state, action) => {
    const {type, payload} = action
    switch (type) {
      case 'SET_FORM':
        return {
          ...state,
          [payload.id]: {
            ...payload.data,
          },
        };
      case 'UPDATE_FORM':
        return {
          ...state,
          [payload.id]: {
            ...payload.data,
          },
        };
      case 'UPDATE_VALUES':
        return {
          ...state,
          [payload.id]: {
            values: {
              ...payload.data,
            },
          },
        };
      case 'UPDATE_ERRORS':
        return {
          ...state,
          [payload.id]: {
            errors: {
              ...payload.data,
            },
          },
        };
      default:
        return state;
    }
}

const trying = () => { console.log("trying")}

const FormProvider: React.FC<Props>= ({ children }) => {

  const [state , dispatch ] = React.useReducer( formReducer, initialState)
  return (
    <FormStateContext.Provider value={state}>
      <FormDispatchContext.Provider value={dispatch}>
        {children}
      </FormDispatchContext.Provider>
    </FormStateContext.Provider>
  )
}

const useFormState = id => {

    const formState = React.useContext(FormStateContext)

    if(formState === undefined){
      throw new Error('useFormState must be used within a FormProvider"')
    }

    return formState[id]
}


const useFormDispatch = () => {
  const dispatch = React.useContext(FormDispatchContext);
  if (dispatch === undefined) {
    throw new Error('useFormState must be used within a FormProvider"');
  }
  return dispatch;
};

export { FormProvider, useFormState, useFormDispatch };
