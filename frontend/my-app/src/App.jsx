import Board from './Components/Board.jsx'
import './App.css'
import  Activity from './Components/Activity.jsx' 
import {Routes,Route} from 'react-router-dom'
function App() {

  

  return (
    <Routes>
      <Route path='/' element={<Board/>}/>
      <Route path='/activity' element={<Activity/>}/>
    </Routes>
     
  )
}

export default App
