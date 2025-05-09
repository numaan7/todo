import './App.css';
import Todo from './components/Todo';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ErrorBoundary>
          <Todo />
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
