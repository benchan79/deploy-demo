import styles from './SimpleForm.module.css';
import { useState } from 'react';
import Joi, { process } from 'joi-browser'
// This allows us to create schemas as well as validate the entries

function SimpleForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  })
  const [error, setError] = useState({});

  //Schema -  set of rules we want our fields to follow
  const schema = {
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(1).max(100).required(),
  }

  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    const {name, value} = event.target;
    const errorMessage = validate(event);
    let errorData = {...error};

    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }

    let userData = {...user};
    userData[name] = value;

    setUser(userData);
    setError(errorData);
    if(process.env.NODE_ENV === "development") {
      console.log('userData', userData)
    }
  }
  const validate = (event) => {
    // Insert validate function code here
    const {name, value} = event.target; //name corresponds to the name attribute, value is the value of the field
    const objToCompare = {[name]: value};
    // use the [] to get the value of the name because if we didn't the key will always be "name"
    // recall when you are creating objects it follows the format {key:value}, typically the key is a string.
    // If I don't put [], if I type in the email field, the objCompare will be {name: terence.gaffud@skillsunion} or if I type in
    // the age field, the objCompare will be {name: 35}
    // But if I put [name] -> this gets the value of the name attribute of my event as it uses the name variable declared previously
    // So if I type in the email field, event.target.name and event.target.value, it would be reading the actual value of the name variable
    const subSchema = {[name] : schema[name]}; // part of the schema we want to compare specifically

    //actual validation
    const result = Joi.validate(objToCompare, subSchema); // We compare the inputs with our schema
    // we get the errors
    const {error} = result;
    return error ? error.details[0].message : null;
    // Note: this validation is done per input
  }

  /*
    Submit handler
  */
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {abortEarly: false}); // Replace null with JOI validation here
    const {error} = result;
    if (!error) {
      console.log(user);
      return user;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log(errorData);
      return errorData
    }
  }
  
  return (
    <div className={styles.container}>
      <h2>SimpleForm</h2>
      <form onSubmit={handlerOnSubmit}>
        <label>Name:</label>
        <input type='text' name='name' placeholder='Enter name' onChange={handlerOnChange} />
        <label>Email:</label>
        <input type='email' name='email' placeholder='Enter email address' onChange={handlerOnChange} />
        <label>Age:</label>
        <input type='number' name='age' placeholder='Enter age' onChange={handlerOnChange} />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default SimpleForm