import{useState, useEffect} from 'react';
import axios from 'axios';

function App() {
 const[ incomeExpense , setIncomeExpense] = useState('income');
 const[description, setDescription]=useState('');
 const[value,setValue]=useState();
 const [data, setData] = useState([]);
const [sumPercentage,setSumPercentage] = useState();



const handleSubmit = (e) => {
  e.preventDefault();
  const troskoviZarade = {  incomeExpense , description , value };

  // fetch za post sa forme na json server 

  fetch('http://localhost:8000/troskoviZarade', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(troskoviZarade)
  })
  window.location.reload()
}

// fetch za get sa json servera 

const fetchData = ()=>{ 
  axios.get('http://localhost:8000/troskoviZarade').then((res)=>{
    setData(res.data);
  })
} 
useEffect(() => {
 fetchData()
}, [])

// list of income 
const incomeList=  data.filter((item)=>{
  return item.incomeExpense.includes('income')
})
localStorage.setItem('listOfIncome', JSON.stringify(incomeList));

// list of expenses 
const expensesList=  data.filter((item)=>{
    return item.incomeExpense.includes('expences')
})
localStorage.setItem('listOfExpenses', JSON.stringify(expensesList));


// calculation values of income 
const incomeNumber = incomeList.map((item)=>{
  return( Number(item.value))
})

const sumIncome = incomeNumber.reduce((total, currentValue) => total = total + currentValue,0);

// calculation values of expenses 
const expenseNumber = expensesList.map((item)=>{
  return( Number(item.value))
})

const sumExpense = expenseNumber.reduce((total, currentValue) => total = total + currentValue,0); 

// total value 

let totalValue= sumIncome - sumExpense;

// percentage 
function percentage(numA, numB) {
  return ( numA/ numB) * 100;
}
let count = percentage(sumExpense,sumIncome);
let twoCount = count.toFixed(2)
console.log(count)
setTimeout(()=>{
 
    setSumPercentage(twoCount)
  
},150)
useEffect(()=>{ 
  setSumPercentage(twoCount)
},[])

// get item from localStorage 

const takeIncome = localStorage.getItem('listOfIncome');
const parsedIncome = JSON.parse(takeIncome);
const otputIncome = parsedIncome.map((element) => {
  return(
    <p>{element.description} {element.value}</p>
  )
});


const takeExpenses = localStorage.getItem('listOfExpenses');
const parsedExpenses = JSON.parse(takeExpenses);
const outputExpenses = parsedExpenses.map((element)=>{
  return(
    <p>{element.description} {element.value}</p>
  )
})

// deleting 
const handleDelete = (id)=>{
  axios.delete('http://localhost:8000/troskoviZarade/'+ id ).then((res)=>{    
        window.location.reload()  
        console.log(res)
})
}
// date 
const now =new Date();
const year = now.getFullYear();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthIndex = (new Date().getMonth());
let monthName = monthNames[monthIndex];

  return (
    <div className="App">
      <header className='header'>
        <p>{`available Budget in ${monthName} ${year}:`}</p>
       <h1>{totalValue>0 ? `+ ${totalValue}` : `- ${totalValue}` ? totalValue=0 : 0 }</h1>
        <p className='headerIncome'>INCOME:{sumIncome}</p>
        <p className='headerExpenses'>EXPENSES:{sumExpense}  <span>{sumPercentage && sumPercentage} %</span></p>
      </header>
      <section className="form">
        <form onSubmit={handleSubmit} >
          <select className='select'  value={incomeExpense}
          onChange={(e) => setIncomeExpense(e.target.value)}>
            <option value="income">+</option>
            <option value="expences">-</option>
          </select>
          <input className='description' value={description}
           onChange={(e) => setDescription(e.target.value)}
           type="text"  placeholder="Add description"/>
          <input className='value' value={value}
              onChange={(e) => setValue(e.target.value)} type="number"  
              min='1' step='1' placeholder="Add value" required />
              <button className={incomeExpense}>Submit</button>
         </form>
      </section>
      <div className="lists">
      <section className="IncomeList">
           <h1>INCOME:</h1>
           <ol>
             {
                incomeList.map((item)=>{
                  return( 
                  <div className=" incomeItem" key={item.id} onClick={(e)=>handleDelete(item.id)}>
                      <li>
                      <p> {item.description} {item.value}</p> 
                      </li>
                </div>) 
                })
              }
              </ol>
      </section>
      <section className='expensesList'>
              <h1>EXPENSES:</h1>
              <ol>
              {
                expensesList.map((item)=>{
                  return( 
                  <div className=" expenseItem" key={item.id} onClick={(e)=>handleDelete(item.id)}>
                 <li>
                  <p> {item.description} {item.value}</p> 
                  </li>
                </div>) 
                })
              }
              </ol>
      </section>
      </div>

     
     {/* <section>
              <h2>Income:</h2>
           {otputIncome}
     </section> */}
     {/* <section>
              <h2>Expenses:</h2>
           {outputExpenses}
     </section> */}
     
    </div>
  );
}

export default App;
