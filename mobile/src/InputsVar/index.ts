import { EditAccounDetailInputVar, EditAccountInputVar, EditInputVar} from '@cache'

const _first_name = () => {
      EditInputVar({inputType: 'Name Input', displayInput: true})
      console.log(EditInputVar())
};
const _phone_number = () => {
      EditAccounDetailInputVar({inputType: 'Phone Input', displayInput: true})
      console.log(EditInputVar())
};
const _email = () => {
      EditAccounDetailInputVar({inputType: 'Email Input', displayInput: true})
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
const _editAccount = () => {
      EditAccountInputVar({inputType: 'Account Input', displayInput: true})
}
export {_email, _phone_number,_editDescription, _editSports, _editAccount, _neighborhood, _gender, _age, _first_name}
