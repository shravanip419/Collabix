import Board from './Components/Board.jsx'
import './App.css'
import  Activity from './Components/Activity.jsx' 
import {Routes,Route} from 'react-router-dom'
import Setting from './Components/Setting.jsx'
function App() {

  

  return (
    <Routes>
      <Route path='/' element={<Board/>}/>
      <Route path='/activity' element={<Activity/>}/>
      <Route path='/setting' element={<Setting/>}/>
    </Routes>
     
  )
}

export default App
