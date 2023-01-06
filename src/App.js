import { process } from 'joi-browser';
import './App.css';
import SimpleForm from './components/SimpleForm';

function App() {
  return (
    <div className="App">
      <SimpleForm />
      <h3>{process.env.REACT_APP_MESSAGE}</h3>
    </div>
  );
}

export default App;
