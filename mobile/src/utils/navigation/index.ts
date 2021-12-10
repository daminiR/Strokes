import { EditInputVar} from '../../cache'

const _first_name = () => {
      EditInputVar({inputType: 'Name Input', displayInput: true})
      console.log(EditInputVar())

};
const _age = () => {
      EditInputVar({inputType: 'Birthday Input', displayInput: true})
      console.log(EditInputVar())
};
const _gender = () => {
  EditInputVar({inputType: 'Gender Input', displayInput: true});
  console.log(EditInputVar());
};
const _neighborhood = () => {
  EditInputVar({inputType: 'Neighborhood Input', displayInput: true});
  console.log(EditInputVar());
};
const _editSports = () => {
    EditInputVar({inputType: 'Sports Input', displayInput: true});
  }
  const _editDescription = () => {
      EditInputVar({inputType: 'Description Input', displayInput: true})
}

export {_editDescription, _editSports, _neighborhood, _gender, _age, _first_name}
