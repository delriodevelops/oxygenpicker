import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import {CompactPicker} from 'react-color'

const defaultBg = 'linear-gradient(130.53deg, #404040 17.47%, #404040 27.71%, #B0B0B0 27.72%, #B0B0B0 36.75%, #404040 36.76%, #404040 45.49%, #B0B0B0 45.5%, #B0B0B0 54.23%, #404040 54.24%, #404040 63.27%, #B0B0B0 63.27%, #B0B0B0 71.71%, #404040 71.71%)'

export default function Home() {
  const [palete,setPalete]=useState([defaultBg,defaultBg,defaultBg,defaultBg,defaultBg])
  const [active,setActive]=useState(null)
  const [iptValue,setIptValue]=useState('')
  const [favs,setFavs]=useState([])

  useEffect(()=>{
    checkLocalStorage('paletes')
    const savedPaletes = getLocalStorage('paletes')
    setFavs(savedPaletes)
  },[])

  function checkLocalStorage(key) {
    const savedPaletes= getLocalStorage(key)
    !savedPaletes && localStorage.setItem(key,JSON.stringify([]))
  }
  const handleClick = (index)=>{
    setActive(index)
  }

  function deletePalete (index) {
    const localPalete = getLocalStorage('paletes')
    console.log(index)
    localPalete.splice(index,1)
    setFavs(localPalete)
    localStorage.setItem(`paletes`,JSON.stringify(localPalete))
  }

  function displayPalete(value){
    setPalete(value)
  }

  function getLocalStorage(key) {
    const obj = localStorage.getItem(key)
    return JSON.parse(obj)
  }

  const fillCircle= (color)=> {
    palete[active]=color.hex
    setActive(null)
  }

  const savePalete = (e)=>{
    e.preventDefault()
    if(iptValue!==''){
      const obj = {
        name:iptValue,
        savedPalete:palete
      }

      const savedPaletes = getLocalStorage('paletes')
      const newPaletes = [obj,...savedPaletes]
      localStorage.setItem('paletes',JSON.stringify(newPaletes))
      setPalete([defaultBg,defaultBg,defaultBg,defaultBg,defaultBg])
      setFavs(newPaletes)
    }
  }


  return (
    <>
      <header>
        Color palette generator
      </header>

      <div>
        <div className={styles.circleHoldr}>
          {palete.map((element,index)=>
            <span onClick={e=>{handleClick(index,e)}} key={index} id={`iptCircle${index}`} className={`iptCircle ${active===index && 'active'}`} >{palete[index]===defaultBg && '+'}</span>
          )}
        </div>
      </div>
      <div>
        <CompactPicker onChange={fillCircle}/>
        <form onSubmit={savePalete}>
          <label htmlFor="name"/>
          <input type="text" name="name" placeholder='Website color scheme' value={iptValue} onChange={(e)=>setIptValue(e.target.value)}/>
          <input type="submit" value="+" />
        </form>
      </div>

      <section>
        {favs.map(({name,savedPalete},index)=>
          <div key={index}>
          <span>{name}</span>
          <span onClick={()=>{deletePalete(index)}}> x</span>
          <div className='savedPalete' onClick={()=>{displayPalete(savedPalete)}}>
            {savedPalete.map((color,index)=>
              <span className='savedCircle' style={{backgroundColor:color}} key={index}></span>
            )}
          </div>
        </div>
          
        
        )}
      </section>

      
      
      <style jsx>
        {`
          .iptCircle{
            width:88px;
            height: 88px;
            border: solid 2px #fff;
            display: grid;
            border-radius: 50%;
            place-items: center;
            font-size:48px;
          }

          #iptCircle0{
            background:${palete[0]};
          }
          #iptCircle1{
            background:${palete[1]};
          }
          #iptCircle2{
            background:${palete[2]};
          }
          #iptCircle3{
            background:${palete[3]};
          }
          #iptCircle4{
            background:${palete[4]};
          }
          .active {
            width:100px;
            height:100px;
          }
          .savedPalete{
            display:flex;
            gap:4px;
          }
          .savedCircle {
            width:40px;
            height:40px;
            border:solid 2px #fff;
            border-radius:50%;
          }

        `}
      </style>
    </>
  )
}
