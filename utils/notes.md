Single Form Object takes following params :
1. Form ID
2. Input Array :  ArrayOf({
     name : FIELD_NAME,
     isValid : FIELD_VALIDATION_FUNCTION,
     enabledIf : {
          field_name : field_value
     },
     defaultValue : FIELD_STARTING_VALUE
})	
3. ResetButton
4. input-group-wrapper-class (to add error elements)
5. errorAlert(error_message)
6. infoAlert(info_message)


Form Object Functions
1. Attaching event listeners
2. submit event
3. checking if fields are valid and then if there is error , then passing that to the errorAlert function
4. reset event
5. when initialising , checking if fields should be disabled or not based on the current values of their enabledIf object fields. (if there is one)


