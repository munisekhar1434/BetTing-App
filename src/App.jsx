import { useEffect, useState } from "react"
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom"

function Body() {

  const [date, setDate] = useState('')
  const [selectedDate, setSelectedDate] = useState('6/22/2023')
  const [matchDetails, setMatchDetails] = useState('')

  useEffect(()=>{
    getFetchDate()
  },[])

  async function getFetchDate() {
    const response = await fetch(`http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1`)
    const data = await response.json();
    setDate(Array.from(new Set(data?.map( date => date?.MatchDate?.split(' ').shift()))))
    setMatchDetails(data)
    
  }

  function convertDate(date) {

  const utcDate = new Date(date);
  const indianDate = utcDate.toString().split(' ').slice(0,5).join(' ')
   return indianDate
  }

  convertDate("06-22-2023 2:00:00 UTC")
  

  return (
    <>

    <div className="border-2 border-black w-11/12 m-auto 5 auto 5 rounded-lg m-3 p-3  w-4/6 h-full my-0 mx-auto shadow-2xl">
      <h1 className="bg-black text-white font-bold p-4 text-center">Bet Builder Fixture</h1>
      <br/>
      <div className=" flex flex-row overflow-x-auto hover:overflow-scroll">
        {date && date?.map( date =><button className="border-2 border-red-500 w-11/12 m-auto 5 auto 5 bg-gray-200 list-none rounded-full m-3 p-3 hover:bg-red-500 focus:bg-red-500 border-b-4" value={date} onClick={(e) => setSelectedDate(e.target.value)} key={date}>{date}</button> )}
      </div>
      <br/>

    {matchDetails && matchDetails?.map( matches =>selectedDate === matches?.MatchDate?.split(' ').shift()? <><div className="rounded-3xl border-black"><div className="p-1 bg-red-500 text-center">{matches.Country}</div><Link to={'/watch/'+matches.MatchId}><div className="text-center p-3 bg-slate-300" key={matches.MatchId}>{matches.MatchName}</div></Link><p className="text-gray-300  bg-white text-center">{convertDate(matches.KickOffUtc)}</p></div></>: '')}
    </div>
    </>
  )
}

const MatchComponent = () => {
  const [matches, setMatches] = useState('')
  const [marketNameValue, setMarketNameValue] = useState('')
  const [selectionValue, setSelectionValue] = useState('')
  const [marketName, setMarketName] = useState('')
  const [legValue, setLegValue] = useState('')
  const [betBuilderData, setBetBuilderData] = useState('')
  const {id} = useParams()
  useEffect(()=>{
    getFetchDate()
     
  },[])
 

  async function getFetchDate() {
    const response = await fetch(`http://cms.bettorlogic.com/api/BetBuilder/GetFixtures?sports=1`)
    const data = await response.json();
    setMatches(data)  
  }

  useEffect(()=>{
    getMarketName() 
    getMarketLegs() 

  },[marketName, legValue])

  
  async function getMarketName() {
    const response = await fetch(`http://cms.bettorlogic.com/api/BetBuilder/GetMarkets?sports=1`)
    const data = await response.json();
    setMarketNameValue(data)
    
  }
  async function getMarketLegs() {
    const response = await fetch(`http://cms.bettorlogic.com/api/BetBuilder/GetSelections?sports=1`)
    const data = await response.json();
    setSelectionValue(data) 
  }
  useEffect(()=>{
    getBetBuilderTable() 
  },[id, marketName, legValue])

  console.log(id)
  console.log(marketName)
  console.log(legValue)

  async function getBetBuilderTable() {
    const response = await fetch(`http://cms.bettorlogic.com/api/BetBuilder/GetBetBuilderBets?sports=1&matchId=${id}&marketId=${marketName}&legs=${legValue}&language=en`)
    const data = await response.json();
    setBetBuilderData(data)   
  }
  console.log("bet builder",betBuilderData)

  function convertDate(date) {

    const utcDate = new Date(date);
    const indianDate = utcDate.toString().split(' ').slice(0,5).join(' ')
     return indianDate
    }

  return (
    <div className="rounded-lg w-4/6 h-full p-8 bg-slate-400 my-0 mx-auto">
    <div>{matches && matches?.map(match => match?.MatchId === id? <><div className="text-red-500 font-extrabold text-3xl text-center" key={match.MatchName}>{ match.MatchName}</div><hr/>{convertDate(match.KickOffUtc)}</> : '')}</div>
    <label className="text-lg">Betslip Selection:</label>
    <select
            onClick={(e) => setMarketName(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500  hover:text-violet-500"
          >
            <br/>

            {marketNameValue && marketNameValue?.map(marketName => <option key={marketName.MarketId} value={marketName.MarketId}>{marketName.MarketName}</option> )}
        
          </select>
          <label className="text-lg">Leg Value:</label>
          <br/>
    <select
            onClick={(e) => setLegValue(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500  hover:text-violet-500"
          >
            {selectionValue && selectionValue?.map(legValue => <option key={legValue.selectionValue} value={legValue.selectionValue}>{legValue.selectionValue}</option> )}
        
          </select>
          <br />
        <div className="text-red-500 font-extrabold text-1xl">bet builder odds:{betBuilderData.TotalOdds}</div>  
          <br/>

          <table className="min-w-full border border-gray-300">
  <thead>
    <tr>
      <th className="border-b border-gray-300 py-2 px-4">Pick</th>
      <th className="border-b border-gray-300 py-2 px-4">Market</th>
      <th className="border-b border-gray-300 py-2 px-4">Sub Market</th>
      <th className="border-b border-gray-300 py-2 px-4">Outcome</th>
      <th className="border-b border-gray-300 py-2 px-4">Stat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border-b border-gray-300 py-2 px-4">1</td>
      <td className="border-b border-gray-300 py-2 px-4">{marketNameValue && marketNameValue?.map(market => market.MarketId === marketName? market.MarketName.split(' ').shift() : '' )}</td>
      <td className="border-b border-gray-300 py-2 px-4">-</td>
      <td className="border-b border-gray-300 py-2 px-4">{marketNameValue && marketNameValue?.map(market => market.MarketId === marketName? market.MarketName.split(' ').pop() : '' )}</td>
      <td className="border-b border-gray-300 py-2 px-4">-</td>
    </tr>
  </tbody>
</table>
  
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Body />} />
      <Route path="/watch/:id" element={<MatchComponent />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
